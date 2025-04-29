import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import request from "../../utils/request.utils";
import { useEffect } from "react";

const Gigs = () => {
  const [sort, setSort] = useState("createdAt");

  const { search } = useLocation();
  const minRef = useRef();
  const maxRef = useRef();

  // Extract category from search params
  const params = new URLSearchParams(search);
  const category = params.get('cat') || '';
  
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () => {
      const minQuery = minRef.current?.value
        ? `&min=${minRef.current.value}`
        : "";
      const maxQuery = maxRef.current?.value
        ? `&max=${maxRef.current.value}`
        : "";
      return request
        .get(`/gigs?${search.slice(1)}${minQuery}${maxQuery}&sort=${sort}`)
        .then((res) => res.data.data);
    },
  });

  useEffect(() => {
    refetch();
  }, [sort]);

  if (isLoading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  if (isError) return <h3 style={{ textAlign: "center" }}>Error</h3>;

  const handleFilter = () => {
    refetch();
  };

  const sortChangeHandler = (e) => setSort(e.target.value);

  // Define titles and descriptions based on category
  const getCategoryTitle = () => {
    switch(category) {
      case 'plumbing': return 'Plumbing Services';
      case 'electrical': return 'Electrical Services';
      case 'cleaning': return 'Cleaning Services';
      case 'hvac': return 'HVAC Services';
      case 'landscaping': return 'Landscaping Services';
      case 'handyman': return 'Handyman Services';
      case 'painting': return 'Painting Services';
      case 'moving': return 'Moving Services';
      default: return 'Home Services';
    }
  };

  const getCategoryDescription = () => {
    switch(category) {
      case 'plumbing': return 'Find reliable plumbers for all your plumbing needs, from repairs to installations';
      case 'electrical': return 'Hire qualified electricians for safe and professional electrical work';
      case 'cleaning': return 'Book professional cleaners for your home or office';
      case 'hvac': return 'Expert heating, ventilation, and air conditioning services';
      case 'landscaping': return 'Transform your outdoor space with professional landscaping services';
      case 'handyman': return 'Get help with various home maintenance and repair tasks';
      case 'painting': return 'Professional painters for interior and exterior painting projects';
      case 'moving': return 'Reliable moving services to help you relocate with ease';
      default: return 'Find trusted professionals for all your home service needs';
    }
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">HOMESERVE &gt; {category.toUpperCase() || 'ALL SERVICES'} &gt; </span>
        <h1>{getCategoryTitle()}</h1>
        <p>{getCategoryDescription()}</p>
        <div className="menu">
          <div className="left">
            <span>Price Range</span>
            <input type="number" ref={minRef} placeholder="min" />
            <input type="number" ref={maxRef} placeholder="max" />
            <button onClick={handleFilter}>Apply</button>
          </div>
          <div className="right">
            <span>Sort By</span>
            <select onChange={sortChangeHandler}>
              <option value="createdAt">Newest</option>
              <option value="sale">Most Popular</option>
              <option value="price">Price</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        <div className="cards">
          {data && data.length > 0 ? (
            data.map((gig) => <GigCard item={gig} key={gig._id} />)
          ) : (
            <h3 style={{ textAlign: "center" }}>No services available in this area</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gigs;