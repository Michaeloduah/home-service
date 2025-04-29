import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import json

class ServiceRecommender:
    def __init__(self):
        """Initialize the recommendation system"""
        self.cards_df = None  # Service categories
        self.projects_df = None  # Creator projects
        self.gigs_df = None  # Available gigs
        self.user_profiles = {}  # Store user profiles
        self.user_interactions = {}  # Store user interactions
        
    def load_data(self, cards_data, projects_data, gigs_data):
        """Load data from JSON into pandas DataFrames"""
        self.cards_df = pd.DataFrame(cards_data)
        self.projects_df = pd.DataFrame(projects_data)
        self.gigs_df = pd.DataFrame(gigs_data)
        
        # Create category mapping
        self.category_mapping = {}
        for i, category in enumerate(self.cards_df['title']):
            self.category_mapping[category] = i
            
        # Add a category ID to gigs based on their descriptions
        self.gigs_df['category_id'] = self._assign_categories_to_gigs()
        
        # Normalize price for better comparison
        scaler = MinMaxScaler()
        self.gigs_df['normalized_price'] = scaler.fit_transform(self.gigs_df[['price']])
        
        print(f"Loaded {len(self.cards_df)} categories, {len(self.projects_df)} projects, and {len(self.gigs_df)} gigs.")
        
    def _assign_categories_to_gigs(self):
        """Assign category IDs to gigs based on their descriptions"""
        categories = []
        
        for _, gig in self.gigs_df.iterrows():
            desc_lower = gig['desc'].lower()
            assigned = False
            
            # Map gigs to categories based on keywords in description
            for cat_title in self.category_mapping:
                if cat_title.lower() in desc_lower:
                    categories.append(self.category_mapping[cat_title])
                    assigned = True
                    break
            
            # Assign to most common category if no match found
            if not assigned:
                # AI Art is most common based on descriptions
                categories.append(self.category_mapping.get('AI Artists', 0))
                
        return categories
        
    def create_user_profile(self, user_id, name, preferences=None, history=None):
        """
        Create or update a user profile
        
        Parameters:
        - user_id: Unique identifier for the user
        - name: User's name
        - preferences: Dict of category preferences (e.g., {'AI Artists': 0.8, 'Logo Design': 0.6})
        - history: List of previously purchased gig IDs
        """
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'name': name,
                'preferences': {},
                'history': [],
                'feature_vector': np.zeros(len(self.category_mapping))
            }
            
        # Update profile if new data provided
        if preferences:
            self.user_profiles[user_id]['preferences'] = preferences
            
        if history:
            self.user_profiles[user_id]['history'] = history
            
        # Update the feature vector
        self._update_user_feature_vector(user_id)
        
        return self.user_profiles[user_id]
        
    def _update_user_feature_vector(self, user_id):
        """Update a user's feature vector based on preferences and history"""
        profile = self.user_profiles[user_id]
        feature_vector = np.zeros(len(self.category_mapping))
        
        # Factor in explicit preferences
        for category, weight in profile['preferences'].items():
            if category in self.category_mapping:
                feature_vector[self.category_mapping[category]] = weight
                
        # Factor in purchase history
        if profile['history']:
            for gig_id in profile['history']:
                try:
                    gig = self.gigs_df[self.gigs_df['id'] == gig_id].iloc[0]
                    category_id = gig['category_id']
                    feature_vector[category_id] += 0.5  # Increase preference based on history
                except (IndexError, KeyError):
                    continue
                    
        # Normalize vector
        if np.sum(feature_vector) > 0:
            feature_vector = feature_vector / np.sum(feature_vector)
            
        self.user_profiles[user_id]['feature_vector'] = feature_vector
        
    def track_interaction(self, user_id, gig_id, interaction_type='view', value=1):
        """
        Track user interactions with gigs
        
        Parameters:
        - user_id: User identifier
        - gig_id: Gig identifier
        - interaction_type: Type of interaction ('view', 'click', 'favorite', 'purchase')
        - value: Strength of interaction (default 1)
        """
        if user_id not in self.user_interactions:
            self.user_interactions[user_id] = {}
            
        if gig_id not in self.user_interactions[user_id]:
            self.user_interactions[user_id][gig_id] = {}
            
        self.user_interactions[user_id][gig_id][interaction_type] = value
        
        # Update profile to reflect this interaction
        if user_id in self.user_profiles:
            try:
                gig = self.gigs_df[self.gigs_df['id'] == gig_id].iloc[0]
                category_id = gig['category_id']
                
                # Different interactions have different weights
                interaction_weights = {
                    'view': 0.1,
                    'click': 0.3,
                    'favorite': 0.7,
                    'purchase': 1.0
                }
                
                weight = interaction_weights.get(interaction_type, 0.1) * value
                
                # Update the user's preference for this category
                category_name = next((k for k, v in self.category_mapping.items() if v == category_id), None)
                if category_name:
                    preferences = self.user_profiles[user_id]['preferences']
                    preferences[category_name] = preferences.get(category_name, 0) + weight
                    
                # Update feature vector
                self._update_user_feature_vector(user_id)
                
            except (IndexError, KeyError):
                pass
        
    def get_user_recommendations(self, user_id, n=5, include_history=False, price_sensitivity=0.5):
        """
        Get personalized recommendations for a user
        
        Parameters:
        - user_id: User identifier
        - n: Number of recommendations to return
        - include_history: Whether to include previously purchased gigs
        - price_sensitivity: How much to factor in price (0 to 1)
        
        Returns:
        - List of recommended gig IDs
        """
        if user_id not in self.user_profiles:
            print(f"User {user_id} not found. Creating default profile.")
            self.create_user_profile(user_id, f"User {user_id}")
            
        profile = self.user_profiles[user_id]
        feature_vector = profile['feature_vector']
        
        # Create gig feature vectors (one-hot encoding of categories)
        gig_features = np.zeros((len(self.gigs_df), len(self.category_mapping)))
        for i, (_, gig) in enumerate(self.gigs_df.iterrows()):
            gig_features[i, gig['category_id']] = 1
            
        # Calculate similarity scores
        similarity_scores = cosine_similarity([feature_vector], gig_features)[0]
        
        # Adjust scores based on price sensitivity
        if price_sensitivity > 0:
            price_factor = 1 - self.gigs_df['normalized_price'].values * price_sensitivity
            similarity_scores = similarity_scores * price_factor
            
        # Adjust scores based on ratings
        similarity_scores = similarity_scores * (self.gigs_df['star'].values / 5.0)
        
        # Create dataframe with recommendations
        recommendations = pd.DataFrame({
            'gig_id': self.gigs_df['id'].values,
            'score': similarity_scores
        })
        
        # Filter out history if requested
        if not include_history and profile['history']:
            recommendations = recommendations[~recommendations['gig_id'].isin(profile['history'])]
            
        # Sort by score and get top N
        recommendations = recommendations.sort_values('score', ascending=False).head(n)
        
        # Get the full gig details
        result = []
        for _, row in recommendations.iterrows():
            gig_id = row['gig_id']
            gig_data = self.gigs_df[self.gigs_df['id'] == gig_id].iloc[0].to_dict()
            gig_data['recommendation_score'] = row['score']
            result.append(gig_data)
            
        return result
    
    def explain_recommendation(self, user_id, gig_id):
        """
        Explain why a particular gig was recommended
        
        Parameters:
        - user_id: User identifier
        - gig_id: Gig identifier
        
        Returns:
        - Explanation text
        """
        if user_id not in self.user_profiles:
            return "User profile not found."
            
        try:
            gig = self.gigs_df[self.gigs_df['id'] == gig_id].iloc[0]
        except IndexError:
            return "Gig not found."
            
        profile = self.user_profiles[user_id]
        explanations = []
        
        # Check if matching user preference
        category_id = gig['category_id']
        category_name = next((k for k, v in self.category_mapping.items() if v == category_id), None)
        
        if category_name in profile['preferences'] and profile['preferences'][category_name] > 0.3:
            explanations.append(f"This matches your interest in {category_name}.")
            
        # Check if similar to purchase history
        if gig_id in profile['history']:
            explanations.append("You've purchased this service before.")
        else:
            similar_gigs = []
            for hist_gig_id in profile['history']:
                try:
                    hist_gig = self.gigs_df[self.gigs_df['id'] == hist_gig_id].iloc[0]
                    if hist_gig['category_id'] == category_id:
                        similar_gigs.append(hist_gig['desc'])
                except IndexError:
                    continue
                    
            if similar_gigs:
                explanations.append(f"This is similar to services you've purchased before.")
                
        # Check rating and price
        if gig['star'] >= 4.5:
            explanations.append(f"This service has an excellent rating of {gig['star']} stars.")
        elif gig['star'] >= 4.0:
            explanations.append(f"This service is highly rated with {gig['star']} stars.")
            
        # Price comparison
        avg_price = self.gigs_df['price'].mean()
        if gig['price'] < avg_price * 0.8:
            explanations.append(f"This is more affordable than similar services.")
        
        if not explanations:
            explanations.append("This matches your overall preferences.")
            
        return " ".join(explanations)

    def get_trending_gigs(self, n=5):
        """Get trending gigs based on interaction data"""
        # In a real system, this would use actual trending data
        # Here we'll simulate it with ratings and a random factor
        
        trending_score = self.gigs_df['star'] * np.random.uniform(0.8, 1.2, len(self.gigs_df))
        
        # Create dataframe with trending scores
        trending = pd.DataFrame({
            'gig_id': self.gigs_df['id'].values,
            'score': trending_score
        })
        
        # Sort by score and get top N
        trending = trending.sort_values('score', ascending=False).head(n)
        
        # Get the full gig details
        result = []
        for _, row in trending.iterrows():
            gig_id = row['gig_id']
            gig_data = self.gigs_df[self.gigs_df['id'] == gig_id].iloc[0].to_dict()
            result.append(gig_data)
            
        return result
    
    def save_model(self, filename='recommender_model.json'):
        """Save the model data to a JSON file"""
        model_data = {
            'category_mapping': self.category_mapping,
            'user_profiles': self.user_profiles,
            'user_interactions': self.user_interactions
        }
        
        with open(filename, 'w') as f:
            json.dump(model_data, f)
            
        print(f"Model saved to {filename}")
        
    def load_model(self, filename='recommender_model.json'):
        """Load the model data from a JSON file"""
        try:
            with open(filename, 'r') as f:
                model_data = json.load(f)
                
            self.category_mapping = model_data['category_mapping']
            self.user_profiles = model_data['user_profiles']
            self.user_interactions = model_data['user_interactions']
            
            print(f"Model loaded from {filename}")
            return True
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading model: {e}")
            return False

# Example usage
def load_from_js_exports(js_file_path):
    """
    Parse JavaScript export statements to extract data
    Note: This is a simplified approach and may need adjustments 
    for different JS file formats
    """
    with open(js_file_path, 'r') as f:
        js_content = f.read()
    
    # Extract the data arrays (very simplified approach)
    # In a real system, use a proper JS parser
    data = {}
    
    # Extract cards array
    cards_start = js_content.find('export const cards = [')
    if cards_start != -1:
        cards_end = js_content.find('];', cards_start)
        cards_js = js_content[cards_start:cards_end+1].replace('export const cards = ', '')
        # Convert JS to valid JSON
        cards_json = cards_js.replace
        cards_json = cards_json.replace
        data['cards'] = json.loads(cards_json)
    
    # Extract projects array
    projects_start = js_content.find('export const projects = [')
    if projects_start != -1:
        projects_end = js_content.find('];', projects_start)
        projects_js = js_content[projects_start:projects_end+1].replace('export const projects = ', '')
        # Convert JS to valid JSON
        projects_json = projects_js.replace
        projects_json = projects_json.replace
        data['projects'] = json.loads(projects_json)
    
    # Extract gigs array
    gigs_start = js_content.find('export const gigs = [')
    if gigs_start != -1:
        gigs_end = js_content.find('];', gigs_start)
        gigs_js = js_content[gigs_start:gigs_end+1].replace('export const gigs = ', '')
        # Convert JS to valid JSON
        gigs_json = gigs_js.replace
        gigs_json = gigs_json.replace
        data['gigs'] = json.loads(gigs_json)
    
    return data

# Example of how to use the recommendation system
if __name__ == "__main__":
    # Option 1: Load data directly
    cards_data = [
        {"id": 1, "title": "AI Artists", "desc": "Add talent to AI"},
        {"id": 2, "title": "Logo Design", "desc": "Build yor brand"},
        # Add more card data here
    ]
    
    projects_data = [
        {"id": 1, "cat": "Web and Mobile Design", "username": "Anna Bell"},
        {"id": 2, "cat": "Logo Design", "username": "Morton Green"},
        # Add more project data here
    ]
    
    gigs_data = [
        {"id": 1, "desc": "I will create ai art character from your images and prompts", "price": 59, "star": 5, "username": "Anna Bell"},
        {"id": 2, "desc": "I will create ultra high quality character art with ai", "price": 79, "star": 5, "username": "Lannie Coleman"},
        # Add more gig data here
    ]
    
    # Initialize recommender
    recommender = ServiceRecommender()
    
    # Option 1: Load data directly
    recommender.load_data(cards_data, projects_data, gigs_data)
    
    # Option 2: Load from JavaScript file
    # data = load_from_js_exports('data.js')
    # recommender.load_data(data['cards'], data['projects'], data['gigs'])
    
    # Create a user profile
    user_id = "user123"
    recommender.create_user_profile(
        user_id=user_id,
        name="John Doe",
        preferences={
            "AI Artists": 0.8,
            "Logo Design": 0.4,
            "Illustration": 0.6
        },
        history=[3, 7]  # Previously purchased gig IDs
    )
    
    # Track some user interactions
    recommender.track_interaction(user_id, 1, 'view')
    recommender.track_interaction(user_id, 2, 'click')
    recommender.track_interaction(user_id, 5, 'favorite')
    
    # Get recommendations
    recommendations = recommender.get_user_recommendations(
        user_id=user_id,
        n=3,
        price_sensitivity=0.3
    )
    
    print("\nRecommendations for", user_id)
    for gig in recommendations:
        print(f"{gig['id']} - {gig['desc']} (${gig['price']}) - Score: {gig['recommendation_score']:.2f}")
        print(recommender.explain_recommendation(user_id, gig['id']))
        print()
    
    # Save the model for future use
    recommender.save_model()