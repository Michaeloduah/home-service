import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecommendationWidget.scss';

const API_URL = 'http://localhost:5001/api';

const RecommendationWidget = ({ userId = "user123" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState(150); // Default max price
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState(['all']);

  // Define fetchRecommendations outside of useEffect so we can reuse it
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, ensure we have a user profile
      await axios.post(`${API_URL}/user_profile`, {
        user_id: userId,
        name: `User ${userId}`,
        preferences: {
          "AI Artists": 0.8,
          "Logo Design": 0.6,
          "Social Media": 0.5
        }
      });

      // Then fetch recommendations
      const response = await axios.get(
        `${API_URL}/recommendations/${userId}`
      );

      console.log("API Response:", response.data);

      if (response.data.status === 'success') {
        setRecommendations(response.data.recommendations);
        
        // Extract unique categories for filter
        const uniqueCats = ['all'];
        response.data.recommendations.forEach(item => {
          if (item.category_name && !uniqueCats.includes(item.category_name)) {
            uniqueCats.push(item.category_name);
          }
        });
        setCategories(uniqueCats);
      } else {
        setError('Failed to fetch recommendations');
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations when component mounts or userId changes
  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  // Filter recommendations based on price and category
  const filteredRecommendations = recommendations.filter(item => {
    const matchesPrice = item.price <= priceFilter;
    const matchesCategory = categoryFilter === 'all' || 
                           (item.category_name && item.category_name === categoryFilter);
    return matchesPrice && matchesCategory;
  });

  // Track click interactions
  const handleGigClick = async (gigId) => {
    try {
      await axios.post(`${API_URL}/track_interaction`, {
        user_id: userId,
        gig_id: gigId,
        interaction_type: 'click',
        value: 1
      });
      console.log(`Tracked click on gig ${gigId}`);
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  };

  return (
    <div className="recommendation-widget">
      <h2>Recommended for You</h2>
      
      {loading ? (
        <div className="loading">Loading recommendations...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
          <div className="filters">
            <div className="filter-group">
              <label>Max Price:</label>
              <input
                type="range"
                min="20"
                max="200"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
              />
              <span>${priceFilter}</span>
            </div>
            
            <div className="filter-group">
              <label>Category:</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredRecommendations.length === 0 ? (
            <div className="no-results">
              No recommendations match your filters. Try adjusting them.
            </div>
          ) : (
            <div className="recommendations-grid">
              {filteredRecommendations.map(rec => (
                <div className="gig-card" key={rec.id} onClick={() => handleGigClick(rec.id)}>
                  {rec.img && (
                    <div 
                      className="gig-image" 
                      style={{backgroundImage: `url(${rec.img})`}}
                    />
                  )}
                  <div className="gig-content">
                    <h3>{rec.username}</h3>
                    <p className="gig-desc">{rec.desc}</p>
                    <div className="gig-meta">
                      <div className="gig-rating">
                        <span className="stars">
                          {'★'.repeat(Math.floor(rec.star))}
                          {'☆'.repeat(5 - Math.floor(rec.star))}
                        </span>
                        <span className="rating-value">{rec.star}</span>
                      </div>
                      <div className="gig-price">${rec.price}</div>
                    </div>
                    <div className="recommendation-reason">
                      <span>Why recommended:</span> {rec.explanation || "This matches your interests."}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button 
            className="refresh-button"
            onClick={fetchRecommendations}
          >
            Refresh Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationWidget;