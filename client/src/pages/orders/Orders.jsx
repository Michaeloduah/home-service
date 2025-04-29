import React from "react";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import request from "../../utils/request.utils";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Orders = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => request.get("/gigs/order").then((res) => res.data.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleContact = async (order) => {
    const sellerId = order.seller._id;
    const buyerId = order.buyer._id;
    const conversationId = `${sellerId}${buyerId}`;
    try {
      const res = await request.get(`/conversation/${conversationId}`);
      navigate(`/message/${res.data.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await request.post(`/conversation`, {
          to: currentUser.isSeller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.data.id}`);
      }
    }
  };

  // Function to get status class
  const getStatusClass = (status) => {
    switch (status) {
      case "completed": return "status-completed";
      case "in_progress": return "status-in-progress";
      case "scheduled": return "status-scheduled";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>{currentUser.isSeller ? "Service Bookings" : "My Appointments"}</h1>
        </div>
        <table>
          <tbody>
            <tr>
              <th>Service</th>
              <th>Details</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>{currentUser.isSeller ? "Customer" : "Provider"}</th>
              <th>Actions</th>
            </tr>
            {data && data.length > 0 ? (
              data.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img className="image" src={order.gig.cover} alt="" />
                  </td>
                  <td>
                    <div className="order-title">{order.gig.title}</div>
                    <div className="order-address">{order.address || "Address not provided"}</div>
                  </td>
                  <td>
                    {order.scheduledDate ? moment(order.scheduledDate).format('MMM D, YYYY') : "To be scheduled"}
                    <div className="time">{order.scheduledTime || ""}</div>
                  </td>
                  <td>${order.price}</td>
                  <td>
                    <span className={`status ${getStatusClass(order.status)}`}>
                      {order.status === "in_progress" ? "In Progress" : 
                       order.status === "scheduled" ? "Scheduled" : 
                       order.status === "completed" ? "Completed" : 
                       order.status === "cancelled" ? "Cancelled" : "Pending"}
                    </span>
                  </td>
                  <td>
                    {currentUser.isSeller
                      ? order.buyer.username
                      : order.seller.username}
                  </td>
                  <td className="actions">
                    <img
                      className="msg"
                      src="./img/message.png"
                      alt="Message"
                      title="Contact"
                      onClick={() => handleContact(order)}
                    />
                    {!currentUser.isSeller && order.status !== "completed" && (
                      <button className="reschedule-btn" onClick={() => navigate(`/reschedule/${order._id}`)}>
                        Reschedule
                      </button>
                    )}
                    {currentUser.isSeller && order.status === "scheduled" && (
                      <button className="complete-btn" onClick={() => navigate(`/complete/${order._id}`)}>
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-orders">
                  <div>No {currentUser.isSeller ? "bookings" : "appointments"} yet</div>
                  {!currentUser.isSeller && (
                    <p>Browse services and book your first appointment</p>
                  )}
                  {currentUser.isSeller && (
                    <p>Bookings will appear here when customers schedule your services</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;