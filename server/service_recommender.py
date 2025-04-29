import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import json

class ServiceRecommender:
    def __init__(self):
        """Initialize the recommendation system"""
        self.cards_df = None  # Service categories
        self.projects_df = None  # Completed projects
        self.gigs_df = None  # Available services
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
            
        # Add a category ID to services based on their category_name
        self.gigs_df['category_id'] = self._assign_categories_to_gigs()
        
        # Normalize price for better comparison
        scaler = MinMaxScaler()
        self.gigs_df['normalized_price'] = scaler.fit_transform(self.gigs_df[['price']])
        
        print(f"Loaded {len(self.cards_df)} categories, {len(self.projects_df)} projects, and {len(self.gigs_df)} services.")
        
    def _assign_categories_to_gigs(self):
        """Assign category IDs to services based on their category_name"""
        categories = []
        
        for _, gig in self.gigs_df.iterrows():
            assigned = False
            
            # Check if category_name is available
            if 'category_name' in gig and gig['category_name'] in self.category_mapping:
                categories.append(self.category_mapping[gig['category_name']])
                assigned = True
            else:
                # Try to infer from description
                desc_lower = gig['desc'].lower()
                for cat_title in self.category_mapping:
                    if cat_title.lower() in desc_lower:
                        categories.append(self.category_mapping[cat_title])
                        assigned = True
                        break
            
            # Assign to default category if no match found
            if not assigned:
                # Handyman is a good default for home services
                categories.append(self.category_mapping.get('Handyman', 0))
                
        return categories
        
    def create_user_profile(self, user_id, name, address=None, zip_code=None, preferences=None, history=None):
        """
        Create or update a user profile
        
        Parameters:
        - user_id: Unique identifier for the user
        - name: User's name
        - address: User's address
        - zip_code: User's ZIP code for location-based recommendations
        - preferences: Dict of category preferences (e.g., {'Plumbing': 0.8, 'Electrical': 0.6})
        - history: List of previously booked service IDs
        """
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'name': name,
                'address': address,
                'zip_code': zip_code,
                'preferences': {},
                'history': [],
                'feature_vector': np.zeros(len(self.category_mapping)),
                'urgent_need': False  # Flag for emergency service needs
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
                
        # Factor in booking history (with recency bias)
        if profile['history']:
            for idx, gig_id in enumerate(profile['history']):
                try:
                    gig = self.gigs_df[self.gigs_df['id'] == gig_id].iloc[0]
                    category_id = gig['category_id']
                    # More recent bookings have higher weight
                    recency_weight = 0.5 * (1 + (idx / len(profile['history'])))
                    feature_vector[category_id] += recency_weight
                except (IndexError, KeyError):
                    continue
                    
        # Normalize vector
        if np.sum(feature_vector) > 0:
            feature_vector = feature_vector / np.sum(feature_vector)
            
        self.user_profiles[user_id]['feature_vector'] = feature_vector
        
    def track_interaction(self, user_id, gig_id, interaction_type='view', value=1):
        """
        Track user interactions with services
        
        Parameters:
        - user_id: User identifier
        - gig_id: Service identifier
        - interaction_type: Type of interaction ('view', 'click', 'contact', 'book')
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
                    'contact': 0.7,
                    'book': 1.0
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

    def set_urgent_need(self, user_id, category=None):
        """
        Set a user's need for urgent/emergency service
        
        Parameters:
        - user_id: User identifier
        - category: Optional category needing urgent service
        """
        if user_id in self.user_profiles:
            self.user_profiles[user_id]['urgent_need'] = True
            
            if category and category in self.category_mapping:
                # Boost this category preference significantly
                self.user_profiles[user_id]['preferences'][category] = 1.0
                self._update_user_feature_vector(user_id)
        
    def get_user_recommendations(self, user_id, n=5, include_history=False, price_sensitivity=0.5, location_based=True, urgent_only=False):
        """
        Get personalized service recommendations for a user
        
        Parameters:
        - user_id: User identifier
        - n: Number of recommendations to return
        - include_history: Whether to include previously booked services
        - price_sensitivity: How much to factor in price (0 to 1)
        - location_based: Whether to factor in service area
        - urgent_only: Whether to only include services offering urgent/same-day service
        
        Returns:
        - List of recommended service details
        """
        if user_id not in self.user_profiles:
            print(f"User {user_id} not found. Creating default profile.")
            self.create_user_profile(user_id, f"User {user_id}")
            
        profile = self.user_profiles[user_id]
        feature_vector = profile['feature_vector']
        
        # Create service feature vectors (one-hot encoding of categories)
        gig_features = np.zeros((len(self.gigs_df), len(self.category_mapping)))
        for i, (_, gig) in enumerate(self.gigs_df.iterrows()):
            gig_features[i, gig['category_id']] = 1
            
        # Calculate similarity scores
        similarity_scores = cosine_similarity([feature_vector], gig_features)[0]
        
        # Filter dataset based on options
        filtered_df = self.gigs_df.copy()
        
        # Filter for urgent services if requested
        if urgent_only:
            urgent_mask = filtered_df.get('hasUrgent', False)
            if isinstance(urgent_mask, pd.Series) and not urgent_mask.empty:
                filtered_df = filtered_df[urgent_mask]
                similarity_scores = similarity_scores[urgent_mask.values]
            
        # Adjust scores based on price sensitivity
        if price_sensitivity > 0:
            price_factor = 1 - filtered_df['normalized_price'].values * price_sensitivity
            similarity_scores = similarity_scores * price_factor
            
        # Adjust scores based on ratings
        similarity_scores = similarity_scores * (filtered_df['star'].values / 5.0)
        
        # Adjust scores based on location if requested
        if location_based and 'zip_code' in profile and profile['zip_code']:
            user_zip = profile['zip_code']
            # This would be more sophisticated in a real implementation
            # Here we just boost services that mention the user's area
            location_boost = np.ones(len(filtered_df))
            for i, (_, gig) in enumerate(filtered_df.iterrows()):
                if 'serviceArea' in gig:
                    if str(user_zip) in str(gig['serviceArea']):
                        location_boost[i] = 1.5
            
            similarity_scores = similarity_scores * location_boost
        
        # Create dataframe with recommendations
        recommendations = pd.DataFrame({
            'gig_id': filtered_df['id'].values,
            'score': similarity_scores
        })
        
        # Filter out history if requested
        if not include_history and profile['history']:
            recommendations = recommendations[~recommendations['gig_id'].isin(profile['history'])]
            
        # Sort by score and get top N
        recommendations = recommendations.sort_values('score', ascending=False).head(n)
        
        # Get the full service details
        result = []
        for _, row in recommendations.iterrows():
            gig_id = row['gig_id']
            gig_data = filtered_df[filtered_df['id'] == gig_id].iloc[0].to_dict()
            gig_data['recommendation_score'] = row['score']
            gig_data['explanation'] = self.explain_recommendation(user_id, gig_id)
            result.append(gig_data)
            
        return result
    
    def explain_recommendation(self, user_id, gig_id):
        """
        Explain why a particular service was recommended
        
        Parameters:
        - user_id: User identifier
        - gig_id: Service identifier
        
        Returns:
        - Explanation text
        """
        if user_id not in self.user_profiles:
            return "User profile not found."
            
        try:
            gig = self.gigs_df[self.gigs_df['id'] == gig_id].iloc[0]
        except IndexError:
            return "Service not found."
            
        profile = self.user_profiles[user_id]
        explanations = []
        
        # Check if matching user preference
        category_id = gig['category_id']
        category_name = next((k for k, v in self.category_mapping.items() if v == category_id), None)
        
        if category_name in profile['preferences'] and profile['preferences'][category_name] > 0.3:
            explanations.append(f"This matches your interest in {category_name} services.")
            
        # Check if matches urgent need
        if profile.get('urgent_need', False) and gig.get('hasUrgent', False):
            explanations.append("This provider offers same-day emergency service.")
            
        # Check if covers user's location
        if 'zip_code' in profile and profile['zip_code'] and 'serviceArea' in gig:
            if str(profile['zip_code']) in str(gig['serviceArea']):
                explanations.append("This provider serves your area.")
            
        # Check if similar to booking history
        if gig_id in profile['history']:
            explanations.append("You've used this service before.")
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
                explanations.append(f"This is similar to services you've booked before.")
                
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

    def get_emergency_services(self, user_id=None, category=None, n=5):
        """
        Get services that offer urgent/same-day service
        
        Parameters:
        - user_id: Optional user ID to personalize results
        - category: Optional category to filter by
        - n: Number of results to return
        
        Returns:
        - List of emergency service details
        """
        # Filter for services with hasUrgent flag
        urgent_services = self.gigs_df[self.gigs_df.get('hasUrgent', False) == True]
        
        # Filter by category if specified
        if category and category in self.category_mapping:
            category_id = self.category_mapping[category]
            urgent_services = urgent_services[urgent_services['category_id'] == category_id]
            
        # If user_id is provided, use their location and preferences
        if user_id in self.user_profiles:
            profile = self.user_profiles[user_id]
            
            # Filter by user location if available
            if 'zip_code' in profile and profile['zip_code']:
                user_zip = profile['zip_code']
                # This would be more sophisticated in a real implementation
                # Here we just boost services that mention the user's area
                location_scores = np.ones(len(urgent_services))
                for i, (_, gig) in enumerate(urgent_services.iterrows()):
                    if 'serviceArea' in gig:
                        if str(user_zip) in str(gig['serviceArea']):
                            location_scores[i] = 2.0  # Higher priority for local services
                
                # Sort by location score and rating
                urgent_services['location_score'] = location_scores
                urgent_services = urgent_services.sort_values(['location_score', 'star'], ascending=[False, False])
            else:
                # Just sort by rating if no location
                urgent_services = urgent_services.sort_values('star', ascending=False)
        else:
            # Sort by rating if no user
            urgent_services = urgent_services.sort_values('star', ascending=False)
            
        # Return top N results
        return urgent_services.head(n).to_dict('records')
    
    def get_seasonal_recommendations(self, season, user_id=None, n=5):
        """
        Get seasonal service recommendations
        
        Parameters:
        - season: Season ('winter', 'spring', 'summer', 'fall')
        - user_id: Optional user ID to personalize results
        - n: Number of results to return
        
        Returns:
        - List of seasonal service recommendations
        """
        # Map seasons to service categories
        season_categories = {
            'winter': ['HVAC', 'Plumbing', 'Insulation'],
            'spring': ['Landscaping', 'Cleaning', 'Painting'],
            'summer': ['HVAC', 'Landscaping', 'Roofing'],
            'fall': ['HVAC', 'Landscaping', 'Roofing', 'Plumbing']
        }
        
        relevant_categories = season_categories.get(season.lower(), [])
        category_ids = [self.category_mapping.get(cat, -1) for cat in relevant_categories]
        category_ids = [cat_id for cat_id in category_ids if cat_id >= 0]
        
        # Filter services by seasonal categories
        if category_ids:
            seasonal_services = self.gigs_df[self.gigs_df['category_id'].isin(category_ids)]
        else:
            # If no valid categories, return empty list
            return []
            
        # If user_id is provided, personalize recommendations
        if user_id in self.user_profiles:
            # Get user recommendations within seasonal categories
            recs = self.get_user_recommendations(
                user_id=user_id, 
                n=n,
                location_based=True
            )
            
            # Filter to keep only seasonal categories
            seasonal_recs = [rec for rec in recs if rec['category_id'] in category_ids]
            
            # If we don't have enough, add top-rated seasonal services
            if len(seasonal_recs) < n:
                # Get IDs of services we already have
                existing_ids = [rec['id'] for rec in seasonal_recs]
                
                # Get additional seasonal services not already included
                additional = seasonal_services[~seasonal_services['id'].isin(existing_ids)]
                additional = additional.sort_values('star', ascending=False).head(n - len(seasonal_recs))
                
                seasonal_recs.extend(additional.to_dict('records'))
                
            return seasonal_recs
        else:
            # No user - return top-rated seasonal services
            return seasonal_services.sort_values('star', ascending=False).head(n).to_dict('records')
    
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
if __name__ == "__main__":
    # Sample data for a home service platform
    cards_data = [
        {"id": 1, "title": "Plumbing", "desc": "Fix leaks and installations"},
        {"id": 2, "title": "Electrical", "desc": "Professional electrical work"},
        {"id": 3, "title": "Cleaning", "desc": "Make your home shine"},
        {"id": 4, "title": "HVAC", "desc": "Heating and cooling solutions"},
        {"id": 5, "title": "Landscaping", "desc": "Beautiful outdoor spaces"},
        {"id": 6, "title": "Handyman", "desc": "General home repairs"}
    ]
    
    projects_data = [
        {"id": 1, "cat": "Plumbing", "username": "Mike's Plumbing"},
        {"id": 2, "cat": "Electrical", "username": "ElectriCare"},
        {"id": 3, "cat": "Cleaning", "username": "CleanTeam Pro"},
        {"id": 4, "cat": "HVAC", "username": "Cool Air Systems"}
    ]
    
    gigs_data = [
        {"id": 1, "desc": "Professional plumbing service for leaks and repairs", "price": 85, "star": 5, "username": "Mike's Plumbing", "category_name": "Plumbing", "hasUrgent": True, "serviceArea": "Chicago, 20 mile radius"},
        {"id": 2, "desc": "Licensed electrician for all residential work", "price": 95, "star": 5, "username": "ElectriCare", "category_name": "Electrical", "hasUrgent": False, "serviceArea": "Chicago, 15 mile radius"},
        {"id": 3, "desc": "Deep house cleaning - kitchen, bathrooms, floors", "price": 120, "star": 4, "username": "CleanTeam Pro", "category_name": "Cleaning", "hasUrgent": True, "serviceArea": "Chicago, 25 mile radius"},
        {"id": 4, "desc": "AC installation and repair - all brands serviced", "price": 110, "star": 4, "username": "Cool Air Systems", "category_name": "HVAC", "hasUrgent": True, "serviceArea": "Chicago, 30 mile radius"}
    ]
    
    # Initialize recommender
    recommender = ServiceRecommender()
    recommender.load_data(cards_data, projects_data, gigs_data)
    
    # Create a user profile
    user_id = "user123"
    recommender.create_user_profile(
        user_id=user_id,
        name="John Doe",
        address="123 Main St",
        zip_code="60601",  # Chicago
        preferences={
            "Plumbing": 0.8,
            "HVAC": 0.4,
            "Electrical": 0.6
        },
        history=[3]  # Previously booked service IDs
    )
    
    # Track some user interactions
    recommender.track_interaction(user_id, 1, 'view')
    recommender.track_interaction(user_id, 2, 'click')
    recommender.track_interaction(user_id, 4, 'contact')
    
    # Get recommendations
    recommendations = recommender.get_user_recommendations(
        user_id=user_id,
        n=3,
        price_sensitivity=0.3,
        location_based=True
    )
    
    print("\nRecommendations for", user_id)
    for gig in recommendations:
        print(f"{gig['id']} - {gig['desc']} (${gig['price']}) - Score: {gig['recommendation_score']:.2f}")
        print(recommender.explain_recommendation(user_id, gig['id']))
        print()
    
    # Get emergency services
    print("\nEmergency Services Available:")
    emergency_services = recommender.get_emergency_services(user_id=user_id)
    for service in emergency_services:
        print(f"{service['id']} - {service['desc']} (${service['price']}) - {service['username']}")
        print(f"Service Area: {service['serviceArea']}")
        print()
    
    # Get seasonal recommendations
    print("\nSeasonal Recommendations (Summer):")
    seasonal_recs = recommender.get_seasonal_recommendations('summer', user_id=user_id)
    for service in seasonal_recs:
        print(f"{service['id']} - {service['desc']} (${service['price']}) - {service['username']}")
        print()
    
    # Save the model for future use
    recommender.save_model()