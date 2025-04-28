import React, { useReducer, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { INIT_STATE, gigReducer } from "../../reducer/gigReducer";
import upload from "../../utils/upload.utils.js";
import "./Add.scss";
import request from "../../utils/request.utils";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [state, dispatch] = useReducer(gigReducer, INIT_STATE);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (gig) => request.post("/gigs", gig),
    onSuccess: () => {
      queryClient.invalidateQueries("myGigs");
      navigate("/mygigs");
    },
  });

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    const featureInput = e.target.elements.feature;
    if (featureInput.value.trim()) {
      dispatch({
        type: "ADD_FEATURE",
        payload: featureInput.value,
      });
      featureInput.value = "";
    }
  };

  const handleUploads = async () => {
    if (!singleFile) return;
    
    setUploading(true);
    try {
      const cover = await upload(singleFile);
      const images = files.length > 0 
        ? await Promise.all([...files].map(async (file) => await upload(file)))
        : [];
      
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!state.title || !state.cover || !state.price) {
      alert("Please fill all required fields (Title, Cover Image, and Price)");
      return;
    }
  
    // Prepare data
    const gigData = {
      ...state,
      price: Number(state.price),
      deliveryTime: Number(state.deliveryTime),
      revisionNumber: Number(state.revisionNumber),
    };
  
    // Submit data
    mutation.mutate(gigData);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        
        <div className="sections">
          <div className="left">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={state.title}
              onChange={handleChange}
              placeholder="e.g. Professional Web Design"
              required
            />

            <label>Category</label>
            <select 
              name="cat" 
              value={state.cat}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
              <option value="video">Video Editing</option>
            </select>

            <div className="images">
              <div className="image-inputs">
                <label>
                  Cover Image (Required)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSingleFile(e.target.files[0])}
                    required
                  />
                </label>
                <label>
                  Additional Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </label>
              </div>
              <button 
                type="button" 
                onClick={handleUploads}
                disabled={!singleFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
            </div>

            <label>Description</label>
            <textarea
              name="description"
              value={state.description}
              onChange={handleChange}
              placeholder="Detailed description of your service"
              rows="10"
              required
            />

            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={!state.cover || mutation.isLoading}
            >
              {mutation.isLoading ? "Creating..." : "Create Gig"}
            </button>
          </div>

          <div className="right">
            <label>Service Title</label>
            <input
              type="text"
              name="shortTitle"
              value={state.shortTitle}
              onChange={handleChange}
              placeholder="e.g. One-page website"
              required
            />

            <label>Short Description</label>
            <textarea
              name="shortDesc"
              value={state.shortDesc}
              onChange={handleChange}
              placeholder="Brief summary of your service"
              rows="5"
              required
            />

            <label>Delivery Time (days)</label>
            <input
              type="number"
              name="deliveryTime"
              min="1"
              value={state.deliveryTime}
              onChange={handleChange}
              required
            />

            <label>Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              min="0"
              value={state.revisionNumber}
              onChange={handleChange}
              required
            />

            <label>Features</label>
            <form onSubmit={handleFeature} className="add-feature">
              <input
                type="text"
                name="feature"
                placeholder="e.g. Responsive design"
              />
              <button type="submit">Add</button>
            </form>
            
            <div className="features-list">
              {state.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => dispatch({ 
                      type: "REMOVE_FEATURE", 
                      payload: feature 
                    })}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              min="5"
              value={state.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;