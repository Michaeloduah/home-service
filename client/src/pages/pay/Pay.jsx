import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import request from "../../utils/request.utils";
import { CheckoutForm } from "../../components"
import "./Pay.scss";

const stripePromise = loadStripe(
  "pk_test_51NcUlDSHkqS5kKgXufhxh2TJshPnbxpbDK7iKHQWdOpCttqvmgOTkO0POTo4inzOoQMWeL1WuyA5rZAtq6glMxaM00c4X13qDn"
);

const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [paymentType, setPaymentType] = useState("full"); // "full" or "deposit"

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const res = await request.get(`/gigs/${id}`);
        setServiceDetails(res.data.data);
      } catch (err) {
        setError("Failed to load service details");
      }
    };

    fetchServiceDetails();
  }, [id]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!serviceDetails) return;
      
      try {
        // Calculate amount based on payment type
        const amount = paymentType === "deposit" 
          ? Math.floor(serviceDetails.price * 0.25 * 100) // 25% deposit
          : serviceDetails.price * 100;
        
        const res = await request.post('/create-payment-intent', {
          gigId: id,
          amount: amount,
          currency: 'usd',
          paymentType: paymentType
        });
        
        if (!res.data.clientSecret) {
          throw new Error("No client secret received");
        }
        
        setClientSecret(res.data.clientSecret);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (serviceDetails) {
      createPaymentIntent();
    }
  }, [id, serviceDetails, paymentType]);

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    setLoading(true); // Reload payment intent with new amount
  };

  if (loading) return <div className="loading">Loading payment details...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="pay">
      {serviceDetails && (
        <div className="service-summary">
          <h2>Service Summary</h2>
          <div className="service-info">
            <img src={serviceDetails.cover} alt={serviceDetails.title} className="service-image" />
            <div className="service-details">
              <h3>{serviceDetails.title}</h3>
              <p className="service-desc">{serviceDetails.shortDesc}</p>
              <div className="provider-info">
                <span>Provider: {serviceDetails.userId.username}</span>
              </div>
            </div>
          </div>
          
          <div className="payment-options">
            <h3>Payment Options</h3>
            <div className="payment-types">
              <button 
                className={`payment-type-btn ${paymentType === "full" ? "active" : ""}`}
                onClick={() => handlePaymentTypeChange("full")}
              >
                Pay in Full (${serviceDetails.price})
              </button>
              <button 
                className={`payment-type-btn ${paymentType === "deposit" ? "active" : ""}`}
                onClick={() => handlePaymentTypeChange("deposit")}
              >
                Pay Deposit (${Math.floor(serviceDetails.price * 0.25)})
              </button>
            </div>
            <p className="payment-note">
              {paymentType === "deposit" 
                ? "25% deposit now, remainder due upon service completion." 
                : "Full payment processed now."}
            </p>
          </div>
        </div>
      )}

      <div className="payment-form">
        <h2>Payment Details</h2>
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

      <div className="booking-note">
        <p>After payment, you'll be able to schedule your service appointment time.</p>
      </div>
    </div>
  );
};

export default Pay;