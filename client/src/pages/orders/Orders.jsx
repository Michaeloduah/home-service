import React from "react";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import request from "../../utils/request.utils";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>Orders</h1>
        </div>
        <table>
          <tbody>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
              <th>Contact</th>
            </tr>
            {data &&
              data.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img className="image" src={order.gig.cover} alt="" />
                  </td>
                  <td>{order.gig.title}</td>
                  <td>
                    {order.price}
                    <sup>99</sup>
                  </td>
                  <td>
                    {currentUser.isSeller
                      ? order.buyer.username
                      : order.seller.username}
                  </td>
                  <td>
                    <img
                      className="msg"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
