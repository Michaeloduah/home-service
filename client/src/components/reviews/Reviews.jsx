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

  return (
    <div className="reviews">
      {data && data.length > 0 ? (
        data.map((review) => <Review key={review._id} review={review} />)
      ) : (
        <h3 style={{marginBottom:"40px"}}>No reviews</h3>
      )}
      <div className="add">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Write review..." />
          <select>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
