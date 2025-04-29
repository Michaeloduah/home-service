from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv

app = Flask(__name__)
# Enable CORS with more explicit settings
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

# Create mock data for testing
mock_data = {
    "cards": [
        {"id": 1, "title": "AI Artists", "desc": "Add talent to AI"},
        {"id": 2, "title": "Logo Design", "desc": "Build your brand"},
        {"id": 3, "title": "WordPress", "desc": "Customize your site"}
    ],
    "gigs": [
        {"id": 1, "desc": "I will create ai art character from your images and prompts", "price": 59, "star": 5, "username": "Anna Bell", "category_name": "AI Artists"},
        {"id": 2, "desc": "I will create ultra high quality character art with ai", "price": 79, "star": 5, "username": "Lannie Coleman", "category_name": "AI Artists"},
        {"id": 3, "desc": "I will create custom ai generated artwork using your photos", "price": 99, "star": 4, "username": "Don Weber", "category_name": "AI Artists"},
        {"id": 4, "desc": "I will create custom art using midjourney generator", "price": 110, "star": 4, "username": "Wilton Hunt", "category_name": "AI Artists"}
    ]
}

# Mock user profiles for testing
user_profiles = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    print("Health check endpoint accessed")
    return jsonify({"status": "ok"})

@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    """Get recommendations for a user"""
    print(f"Recommendations requested for user: {user_id}")
    
    import random
    
    # Create explanations based on user profile if it exists
    user_profile = user_profiles.get(user_id, {})
    
    # Different explanations to add variety
    explanations = [
        "This matches your interest in AI art.",
        "Based on your profile, you might enjoy this service.",
        "This creator has excellent ratings and reviews.",
        "This is popular among users with similar preferences.",
        "This service is trending in this category.",
        "This is more affordable than similar services.",
        "You've shown interest in similar services recently."
    ]
    
    # Add mock explanations to gigs with some randomization
    recommendations = []
    for gig in mock_data["gigs"]:
        gig_copy = gig.copy()
        
        # Randomize price slightly to simulate different recommendations
        price_variation = random.uniform(0.85, 1.15)  # 15% variation
        gig_copy["price"] = round(gig["price"] * price_variation)
        
        # Add random explanation
        gig_copy["explanation"] = random.choice(explanations)
        
        # Randomly add a special badge to some recommendations
        if random.random() < 0.3:  # 30% chance
            gig_copy["badge"] = random.choice(["New", "Trending", "Best Match"])
            
        recommendations.append(gig_copy)
    
    # Shuffle recommendations to simulate different results each time
    random.shuffle(recommendations)
    
    return jsonify({
        "status": "success",
        "recommendations": recommendations
    })

@app.route('/api/user_profile', methods=['POST'])
def create_user_profile():
    """Create or update a user profile"""
    data = request.get_json()
    print(f"User profile creation request: {data}")
    
    if not data or 'user_id' not in data:
        return jsonify({"error": "Missing user_id"}), 400
    
    user_id = data['user_id']
    user_profiles[user_id] = {
        "name": data.get('name', f"User {user_id}"),
        "preferences": data.get('preferences', {}),
        "history": data.get('history', [])
    }
    
    return jsonify({
        "status": "success",
        "profile": user_profiles[user_id]
    })

@app.route('/api/track_interaction', methods=['POST'])
def track_interaction():
    """Track a user interaction with a gig"""
    data = request.get_json()
    print(f"Interaction tracking request: {data}")
    
    if not data or 'user_id' not in data or 'gig_id' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    return jsonify({
        "status": "success",
        "message": f"Interaction recorded for user {data['user_id']} with gig {data['gig_id']}"
    })

# Add a test route that returns all available endpoints
@app.route('/api/routes', methods=['GET'])
def list_routes():
    """List all available routes"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "route": str(rule)
        })
    return jsonify({"routes": routes})

if __name__ == "__main__":
    # Get port from environment variable or use 5001 as default
    port = int(os.getenv('PORT', 5001))
    
    print(f"Starting server on port {port}")
    print(f"API will be available at http://localhost:{port}/api/")
    print("Available endpoints:")
    print(f" - Health check: http://localhost:{port}/api/health")
    print(f" - Recommendations: http://localhost:{port}/api/recommendations/<user_id>")
    print(f" - List routes: http://localhost:{port}/api/routes")
    
    app.run(debug=True, host='127.0.0.1', port=port)