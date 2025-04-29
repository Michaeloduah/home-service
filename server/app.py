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
        {"id": 1, "title": "Plumbing", "desc": "Fix leaks and installations"},
        {"id": 2, "title": "Electrical", "desc": "Professional electrical work"},
        {"id": 3, "title": "Cleaning", "desc": "Make your home shine"},
        {"id": 4, "title": "HVAC", "desc": "Heating and cooling solutions"},
        {"id": 5, "title": "Landscaping", "desc": "Beautiful outdoor spaces"},
        {"id": 6, "title": "Handyman", "desc": "General home repairs"}
    ],
    "gigs": [
        {"id": 1, "desc": "Professional plumbing service for leaks and repairs", "price": 85, "star": 5, "username": "Mike's Plumbing", "category_name": "Plumbing", "hasUrgent": True, "serviceArea": "Chicago, 20 mile radius"},
        {"id": 2, "desc": "Licensed electrician for all residential work", "price": 95, "star": 5, "username": "ElectriCare", "category_name": "Electrical", "hasUrgent": False, "serviceArea": "Chicago, 15 mile radius"},
        {"id": 3, "desc": "Deep house cleaning - kitchen, bathrooms, floors", "price": 120, "star": 4, "username": "CleanTeam Pro", "category_name": "Cleaning", "hasUrgent": True, "serviceArea": "Chicago, 25 mile radius"},
        {"id": 4, "desc": "AC installation and repair - all brands serviced", "price": 110, "star": 4, "username": "Cool Air Systems", "category_name": "HVAC", "hasUrgent": True, "serviceArea": "Chicago, 30 mile radius"}
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
    
    # Add mock explanations to gigs
    recommendations = []
    for gig in mock_data["gigs"]:
        gig_copy = gig.copy()
        gig_copy["explanation"] = "This service is available in your area."
        recommendations.append(gig_copy)
    
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
        "address": data.get('address', ""),
        "city": data.get('city', ""),
        "state": data.get('state', ""),
        "zip": data.get('zip', ""),
        "preferences": data.get('preferences', {}),
        "history": data.get('history', [])
    }
    
    return jsonify({
        "status": "success",
        "profile": user_profiles[user_id]
    })

@app.route('/api/track_interaction', methods=['POST'])
def track_interaction():
    """Track a user interaction with a service"""
    data = request.get_json()
    print(f"Interaction tracking request: {data}")
    
    if not data or 'user_id' not in data or 'gig_id' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    return jsonify({
        "status": "success",
        "message": f"Interaction recorded for user {data['user_id']} with service {data['gig_id']}"
    })

@app.route('/api/service_providers', methods=['GET'])
def get_service_providers():
    """Get list of service providers based on category and location"""
    category = request.args.get('category', '')
    zip_code = request.args.get('zip', '')
    
    filtered_providers = mock_data["gigs"]
    
    if category:
        filtered_providers = [p for p in filtered_providers if p["category_name"].lower() == category.lower()]
    
    return jsonify({
        "status": "success",
        "providers": filtered_providers
    })

@app.route('/api/emergency_services', methods=['GET'])
def get_emergency_services():
    """Get services available for same-day emergency work"""
    
    emergency_providers = [p for p in mock_data["gigs"] if p.get("hasUrgent", False)]
    
    return jsonify({
        "status": "success",
        "emergency_providers": emergency_providers
    })

@app.route('/api/book_service', methods=['POST'])
def book_service():
    """Book a service appointment"""
    data = request.get_json()
    
    if not data or 'user_id' not in data or 'gig_id' not in data or 'date' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    return jsonify({
        "status": "success",
        "booking_id": "BK" + str(hash(data['user_id'] + data['gig_id'] + data['date']))[:8],
        "message": "Service booked successfully"
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
    print(f" - Service providers: http://localhost:{port}/api/service_providers")
    print(f" - Emergency services: http://localhost:{port}/api/emergency_services")
    print(f" - Book service: http://localhost:{port}/api/book_service")
    print(f" - List routes: http://localhost:{port}/api/routes")
    
    app.run(debug=True, host='127.0.0.1', port=port)