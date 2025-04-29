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

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      request
        .get(`/gigs?userId=${currentUser._id}`)
        .then((res) => res.data.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      mutation.mutate(id);
    }
  };

  return (
    <div className="my-gigs">
      <div className="container">
        <div className="title">
          <h1>My Services</h1>
          <Link to="/add">
            <button>Add New Service</button>
          </Link>
        </div>
        <table>
          <tbody>
            <tr>
              <th>Image</th>
              <th>Service Title</th>
              <th>Price</th>
              <th>Bookings</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
            {data && data.length ? (
              data.map((gig) => (
                <tr key={gig._id}>
                  <td>
                    <img className="image" src={gig.cover} alt="" />
                  </td>
                  <td>{gig.title}</td>
                  <td>
                    ${gig.price}
                    {gig.hourlyRate && <span className="hourly-note">+${gig.hourlyRate}/hr</span>}
                  </td>
                  <td>{gig.sales || 0}</td>
                  <td>
                    <span className={`status ${gig.isActive ? 'active' : 'inactive'}`}>
                      {gig.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <Link to={`/edit/${gig._id}`}>
                      <img className="edit" src="./img/edit.png" alt="Edit" title="Edit Service" />
                    </Link>
                    <img
                      className="delete"
                      src="./img/delete.png"
                      alt="Delete"
                      title="Delete Service"
                      onClick={() => handleDelete(gig._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-services">
                  <div>You haven't created any services yet</div>
                  <p>Add services to start receiving bookings from customers in your area</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyGigs;