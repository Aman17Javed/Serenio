import React, { useState, useEffect } from "react";
import "./PaymentForm.css";
import api from "../api/axios";
import Loader from "./Loader"; // ✅ Spinner component

const PaymentForm = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false); // ✅ For form submission
  const [initialLoading, setInitialLoading] = useState(true); // ✅ For page load
  const [message, setMessage] = useState("");

  // ✅ Show loader on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000); // Adjust timing as needed (1s delay)

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMethod || !transactionId || !phoneNumber) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/payment", {
        method: selectedMethod,
        transactionId,
        phoneNumber,
      });

      setMessage("✅ Payment submitted successfully!");
    } catch (err) {
      console.error("Payment error:", err);
      setMessage("❌ Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loader initially
  if (initialLoading) {
    return (
      <div className="payment-card initial-loader">
        <Loader />
        <p>Loading payment form...</p>
      </div>
    );
  }

  return (
    <div className="payment-card">
      <div className="payment-header">
        <div className="icon-circle">💳</div>
        <h2>Payment</h2>
        <p>Choose your preferred payment method</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="payment-methods">
          <label className={`method ${selectedMethod === "JazzCash" ? "selected" : ""}`}>
            <input
              type="radio"
              name="method"
              value="JazzCash"
              onChange={() => setSelectedMethod("JazzCash")}
            />
            <span className="icon orange">🟧</span>
            <div>
              <strong>JazzCash</strong>
              <p>Mobile wallet payment</p>
            </div>
          </label>

          <label className={`method ${selectedMethod === "Easypaisa" ? "selected" : ""}`}>
            <input
              type="radio"
              name="method"
              value="Easypaisa"
              onChange={() => setSelectedMethod("Easypaisa")}
            />
            <span className="icon green">🟩</span>
            <div>
              <strong>Easypaisa</strong>
              <p>Digital wallet payment</p>
            </div>
          </label>

          <label className={`method ${selectedMethod === "Bank" ? "selected" : ""}`}>
            <input
              type="radio"
              name="method"
              value="Bank"
              onChange={() => setSelectedMethod("Bank")}
            />
            <span className="icon blue">🟦</span>
            <div>
              <strong>Bank Transfer</strong>
              <p>Direct bank transfer</p>
            </div>
          </label>
        </div>

        <div className="form-group">
          <label>Transaction ID</label>
          <input
            type="text"
            placeholder="Enter transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="03XX-XXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <Loader /> Processing...
            </>
          ) : (
            "✅ Confirm Payment"
          )}
        </button>
      </form>

      {message && <p className="payment-message">{message}</p>}
      <p className="secured-text">🔒 Secured by Serenio</p>
    </div>
  );
};

export default PaymentForm;
