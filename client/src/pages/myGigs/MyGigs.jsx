import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import "./MyGigs.scss";
import request from "../../utils/request.utils";

const MyGigs = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id) =>
      request.delete(`/gigs/${id}`).then((res) => res.data.data),
    onSuccess: () => queryClient.invalidateQueries("myGigs"),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      request
        .get(`/gigs?userId=${currentUser._id}`)
        .then((res) => res.data.data),
  });
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="my-gigs">
      <div className="container">
        <div className="title">
          <h1>Gigs</h1>
          <Link to="/add">
            <button>Add new Gig</button>
          </Link>
        </div>
        <table>
          <tbody>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
            {data && data.length ? (
              data.map((gig) => (
                <tr key={gig._id}>
                  <td>
                    <img className="image" src={gig.cover} alt="" />
                  </td>
                  <td>{gig.title}</td>
                  <td>
                    {gig.price}
                    <sup>99</sup>
                  </td>
                  <td>{gig.sales}</td>
                  <td>
                    <img
                      className="delete"
                      src="./img/delete.png"
                      alt=""
                      onClick={() => handleDelete(gig._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <div>No gigs</div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyGigs;
