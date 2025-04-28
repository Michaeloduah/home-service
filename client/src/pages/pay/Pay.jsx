import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import request from "../../utils/request.utils";
import {CheckoutForm} from "../../components"
import "./Pay.scss";

const stripePromise = loadStripe(
  "pk_test_51NcUlDSHkqS5kKgXufhxh2TJshPnbxpbDK7iKHQWdOpCttqvmgOTkO0POTo4inzOoQMWeL1WuyA5rZAtq6glMxaM00c4X13qDn"
);

const Pay = () => {
  const { id } = useParams();
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    const makeReq = async () => {
      try {
        const res = await request.post(`/gigs/${id}/order/stripe`);
        setClientSecret(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    makeReq();
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;
