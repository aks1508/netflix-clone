import React, { useEffect, useState } from "react";
import "./Payment.css";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, updateSubscriptionStatus } from "../../firebase";
import { toast } from "react-toastify";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan);
    } else {
      toast.error("No plan selected. Please select a plan");
      navigate("/pricing");
    }
  }, [location.state, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!cardNumber || !cvv || !expiry) {
      setMessage("Please fill in all card details");
      setLoading(false);
      return;
    }

    if (!selectedPlan) {
      setMessage("No plan selected for payment");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:4000/payment-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardNumber,
          expiry,
          cvv,
          planName: selectedPlan.name,
          planPrice: selectedPlan.price,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setMessage(data.message);

        if (auth.currentUser) {
          await updateSubscriptionStatus(
            auth.currentUser.uid,
            "active",
            selectedPlan
          );
        } else {
          console.log("No authenticated user found to update subscription");
          toast.warn(
            "Payment Succesful, but could not update subscrition(user not logged in)"
          );
        }
      } else {
        toast.error(data.message);
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Payment API error:", error);
      toast.error("An error occured during payment");
      setMessage("Error occured");
    } finally {
      setLoading(false);
    }
  };
  if (!selectedPlan) {
    return <div className="payment-container">Loading Plan details...</div>;
  }

  return (
    <div className="payment-container">
      <h2 className="payment-title">Complete your purchase</h2>
      <div className="plan-summary">
        <h3>Selected Plan: {selectedPlan.name}</h3>
        <p>Price: {selectedPlan.price}</p>
        <p>Resolution: {selectedPlan.resolution}</p>
      </div>

      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="cardNumber"> Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="**** **** **** ****"
            maxLength="19"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiry"> Expiry</label>
            <input
              type="text"
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength="5"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv"> CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="***"
              maxLength="4"
              required
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="pay-button">
          {loading ? "processing..." : `Pay ${selectedPlan.price}`}{" "}
        </button>
        {message && <p className="payment-message"> {message}</p>}
      </form>
    </div>
  );
};

export default Payment;
