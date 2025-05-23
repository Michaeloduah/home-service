import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import moment from "moment";

import "./Messages.scss";
import request from "../../utils/request.utils";

const Messages = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id }) => request.patch(`/conversation/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => request.get("/conversation").then((res) => res.data.data),
  });
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const handleRead = (id) => {
    mutation.mutate({ id });
  };

  return (
    <div className="messages">
      <div className="container">
        <div className="title">
          <h1>Messages</h1>
        </div>
        <table>
          <tbody>
            <tr>
              <th>{currentUser.isSeller ? "Customer" : "Service Provider"}</th>
              <th>Last Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
            {!isLoading && data && data.length > 0 ? (
              data.map((conversation) => (
                <tr
                  className={
                    (currentUser.isSeller && !conversation.readBySeller) ||
                    (!currentUser.isSeller && !conversation.readByBuyer)
                      ? `active`
                      : ``
                  }
                  key={conversation.id}
                >
                  <td>
                    {currentUser.isSeller
                      ? conversation.buyerId.username
                      : conversation.sellerId.username}
                  </td>

                  <td>
                    <Link to={`/message/${conversation.id}`} className="link">
                      {conversation.lastMessage && conversation.lastMessage.substring(0, 100)}...
                    </Link>
                  </td>
                  <td>{moment(conversation.updatedAt).fromNow()}</td>
                  <td>
                    {(currentUser.isSeller && !conversation.readBySeller) ||
                    (!currentUser.isSeller && !conversation.readByBuyer) ? (
                      <button onClick={() => handleRead(conversation.id)}>
                        Mark as read
                      </button>
                    ) : (
                      <Link to={`/message/${conversation.id}`} className="link">
                        <button>View</button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-msg">
                  <div>No messages yet</div>
                  <p className="empty-message">
                    {currentUser.isSeller 
                      ? "When customers contact you about your services, messages will appear here."
                      : "Contact service providers to discuss your home service needs."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Messages;