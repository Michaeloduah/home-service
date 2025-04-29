import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import request from "../../utils/request.utils";
import "./Message.scss";

const Message = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const mutation = useMutation({
    mutationFn: (data) =>
      request
        .post(`/conversation/${data.convesationId}/messages`, data)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      request.get(`/conversation/${id}/messages`).then((res) => res.data.data),
  });
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    mutation.mutate({ desc, conversationId: id });
    e.target[0].value = "";
  };

  if (isLoading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (isError) return <div style={{ textAlign: "center" }}>Error</div>;

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages" className="link">
            CONVERSATIONS
          </Link>
          &gt; {data && data[0] ? 
              (data[0].senderId._id === currentUser._id ? 
                data[0].receiverId.username : 
                data[0].senderId.username) : 
              "New Conversation"}
        </span>
        <div className="messages">
          {data && data.length > 0 ? (
            data.map((msg) => (
              <div
                key={msg._id}
                className={`item ${
                  msg.senderId._id == currentUser._id ? "owner" : ""
                }`}
              >
                <img
                  src={
                    msg.senderId._id == currentUser._id
                      ? currentUser.img || "/img/noavatar.png"
                      : msg.senderId.img || "/img/noavatar.png"
                  }
                  alt=""
                />
                <p>{msg.desc}</p>
                <span className="time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))
          ) : (
            <div className="no-messages">
              <p>No messages yet. Start the conversation!</p>
              <p className="tip">Discuss service details, scheduling, or ask questions about the service.</p>
            </div>
          )}
        </div>
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea
            name=""
            placeholder="Type your message here..."
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;