import React, { useReducer, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { INIT_STATE, gigReducer } from "../../reducer/gigReducer";
import upload from "../../utils/upload.utils.js";
import request from "../../utils/request.utils";
import "./Add.scss";

const Add = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [featureInput, setFeatureInput] = useState(""); // <-- feature input state
  const [state, dispatch] = useReducer(gigReducer, INIT_STATE);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (gig) => request.post("/gigs", gig),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
    onError: (error) => {
      console.error(error);
      alert("Failed to create service. Please try again.");
    },
  });

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeatureAdd = () => {
    if (featureInput.trim() !== "") {
      dispatch({ type: "ADD_FEATURE", payload: featureInput.trim() });
      setFeatureInput("");
    }
  };

  const handleUploads = async () => {
    setUploading(true);
    try {
      const cover = singleFile ? await upload(singleFile) : "";
      const images =
        files.length > 0
          ? await Promise.all([...files].map((file) => upload(file)))
          : [];

      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (singleFile) {
      handleUploads();
    }
  }, [singleFile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["title", "cat", "cover", "description", "price"];
    const missing = requiredFields.filter((field) => !state[field]);

    if (missing.length) {
      alert(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    mutation.mutate({
      ...state,
      price: Number(state.price),
      deliveryTime: Number(state.deliveryTime),
      revisionNumber: Number(state.revisionNumber),
      hourlyRate: state.hourlyRate ? Number(state.hourlyRate) : undefined,
      serviceArea: state.serviceArea || "",
      hasUrgent: state.hasUrgent || false
    });
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Service</h1>

        <form className="sections" onSubmit={handleSubmit}>
          <div className="left">
            <label>Service Title</label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Professional Plumbing Service"
              value={state.title}
              onChange={handleChange}
              required
            />

            <label>Category</label>
            <select
              name="cat"
              value={state.cat}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleaning">Cleaning</option>
              <option value="hvac">HVAC</option>
              <option value="landscaping">Landscaping</option>
              <option value="handyman">Handyman</option>
              <option value="painting">Painting</option>
              <option value="moving">Moving</option>
            </select>

            <label>Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSingleFile(e.target.files[0])}
              required
            />

            <label>Additional Images (before/after, equipment, team)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />

            {uploading && <p>Uploading images...</p>}

            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe your service in detail, including your experience, equipment used, and what customers can expect"
              value={state.description}
              onChange={handleChange}
              rows="10"
              required
            />

            <button
              type="submit"
              disabled={mutation.isLoading || uploading}
            >
              {mutation.isLoading ? "Creating..." : "Create Service"}
            </button>
          </div>

          <div className="right">
            <label>Short Title</label>
            <input
              name="shortTitle"
              type="text"
              placeholder="e.g. Drain Cleaning"
              value={state.shortTitle}
              onChange={handleChange}
            />

            <label>Short Description</label>
            <textarea
              name="shortDesc"
              placeholder="Brief service overview"
              value={state.shortDesc}
              onChange={handleChange}
              rows="5"
            />

            <label>Service Area</label>
            <input
              name="serviceArea"
              type="text"
              placeholder="e.g. Chicago, 20 mile radius"
              value={state.serviceArea}
              onChange={handleChange}
            />

            <div className="pricing-options">
              <div>
                <label>Base Price ($)</label>
                <input
                  name="price"
                  type="number"
                  min="5"
                  value={state.price}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label>Hourly Rate ($ optional)</label>
                <input
                  name="hourlyRate"
                  type="number"
                  min="0"
                  value={state.hourlyRate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Estimated Service Time (hours)</label>
            <input
              name="deliveryTime"
              type="number"
              min="1"
              value={state.deliveryTime}
              onChange={handleChange}
              required
            />

            <div className="checkbox-option">
              <input
                type="checkbox"
                id="urgentService"
                name="hasUrgent"
                checked={state.hasUrgent}
                onChange={(e) => 
                  dispatch({
                    type: "CHANGE_INPUT",
                    payload: { name: e.target.name, value: e.target.checked },
                  })
                }
              />
              <label htmlFor="urgentService">Offer urgent/same-day service</label>
            </div>

            <label>Add Service Features</label>
            <div className="add-feature">
              <input
                type="text"
                placeholder="e.g. 90-day warranty"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleFeatureAdd}
              >
                Add
              </button>
            </div>

            <div className="features-list">
              {state.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: feature })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;