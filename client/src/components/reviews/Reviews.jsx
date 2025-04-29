import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Review } from "../";
import request from "../../utils/request.utils";
import "./Reviews.scss";

const Reviews = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      request.get(`/gigs/${id}/reviews`).then((res) => res.data.data),
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      request.post(`/gigs/${id}/reviews`, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
  });

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ desc, star });
    e.target[0].value = "";
    e.target[1].selectedIndex = 0;
  };

  // Calculate average rating
  const averageRating = data && data.length > 0 
    ? (data.reduce((sum, review) => sum + review.star, 0) / data.length).toFixed(1) 
    : 0;

  return (
    <div className="reviews">
      {data && data.length > 0 ? (
        <>
          <div className="rating-summary">
            <h3>Service Rating</h3>
            <div className="rating-average">
              <span className="rating-number">{averageRating}</span>
              <div className="stars">
                {Array(Math.round(averageRating))
                  .fill()
                  .map((_, id) => (
                    <img src="/img/star.png" alt="" key={id} />
                  ))}
              </div>
              <span className="rating-count">({data.length} reviews)</span>
            </div>
          </div>
          {data.map((review) => <Review key={review._id} review={review} />)}
        </>
      ) : (
        <h3 style={{marginBottom:"40px"}}>No reviews yet</h3>
      )}
      <div className="add">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Share your experience with this service..." rows="3"></textarea>
          <div className="form-bottom">
            <select>
              <option value="5">5 stars - Excellent</option>
              <option value="4">4 stars - Good</option>
              <option value="3">3 stars - Average</option>
              <option value="2">2 stars - Poor</option>
              <option value="1">1 star - Terrible</option>
            </select>
            <button>Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reviews;