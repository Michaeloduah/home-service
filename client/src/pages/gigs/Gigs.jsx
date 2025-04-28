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

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">FIVERR &gt; GRAPHICS & DESIGN &gt; </span>
        <h1>AI Artists</h1>
        <p>
          Explore te boundaries of art and technology with Fiverr&apos;s AI
          artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input type="number" ref={minRef} placeholder="min" />
            <input type="number" ref={maxRef} placeholder="max" />
            <button onClick={handleFilter}>Apply</button>
          </div>
          <div className="right">
            <span>Sort By</span>
            <select onChange={sortChangeHandler}>
              <option value="createdAt">Newest</option>
              <option value="sale">Best Selling</option>
            </select>
          </div>
        </div>
        <div className="cards">
          {data && data.length > 0 ? (
            data.map((gig) => <GigCard item={gig} key={gig._id} />)
          ) : (
            <h3 style={{ textAlign: "center" }}>No gigs</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gigs;
