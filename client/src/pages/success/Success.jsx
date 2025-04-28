import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import request from "../../utils/request.utils";

const Success = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await request.patch(`/gigs/order/${payment_intent}`);
        setTimeout(() => navigate("/orders"), 5000);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  });

  return (
    <div>
      Payment Successful. Redirecting to orders page please do not close the
      page.
    </div>
  );
};

export default Success;
