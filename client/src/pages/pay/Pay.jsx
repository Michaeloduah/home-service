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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await request.post('/create-payment-intent', {
          gigId: id,
          amount: 1000, // Example amount in cents
          currency: 'usd'
        });
        
        if (!res.data.clientSecret) {
          throw new Error("No client secret received");
        }
        
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [id]);

  if (loading) return <div>Loading payment details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pay">
      {clientSecret && (
        <Elements 
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#6772e5',
              }
            }
          }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;
