import React, { useState } from "react";
import "./Pricing.css";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const handleclick = (plan) => {
    navigate("/payment", { state: { selectedPlan: plan } });
  };
  const plans = [
    {
      name: "BASIC 720p",
      price: "₹199",

      resolution: "720p (HD)",
      devices: "TV, computer, mobile phone, tablet",
      simultaneous: "1",
      downloads: "1",
      featured: false,
    },
    {
      name: "STANDARD 1080p",
      price: "₹499",

      resolution: "1080p (Full HD)",
      devices: "TV, computer, mobile phone, tablet",
      simultaneous: "2",
      downloads: "2",
      featured: false,
    },
    {
      name: "PREMIUM 4K + HDR",
      price: "₹649",

      resolution: "4K (Ultra HD) + HDR",
      spatialAudio: "Included",
      devices: "TV, computer, mobile phone, tablet",
      simultaneous: "4",
      downloads: "6",
      featured: true,
    },
  ];

  return (
    <div className="pricing-container">
      <h2>Choose Your Plan</h2>
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${plan.featured ? "featured" : ""}`}
          >
            {plan.featured && (
              <div className="featured-badge">Most Popular</div>
            )}
            <h3>{plan.name}</h3>
            <div className="price">
              {plan.price}
              <span>/month</span>
            </div>

            <ul className="features">
              <li>
                <strong>Resolution:</strong> {plan.resolution}
              </li>
              {plan.spatialAudio && (
                <li>
                  <strong>Spatial audio:</strong> {plan.spatialAudio}
                </li>
              )}
              <li>
                <strong>Supported devices:</strong> {plan.devices}
              </li>
              <li>
                <strong>
                  Devices your household can watch at the same time:
                </strong>{" "}
                {plan.simultaneous}
              </li>
              <li>
                <strong>Download devices:</strong> {plan.downloads}
              </li>
            </ul>
            <button className="select-button" onClick={() => handleclick(plan)}>
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
