import React, { useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { logout } from "../../firebase";

const Navbar = ({ userSubscription, isSubscriptionLoading }) => {
  const navRef = useRef();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 95) {
        navRef.current.classList.add("nav-dark");
      } else {
        navRef.current.classList.remove("nav-dark");
      }
    });
  }, []);

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="" />
        <ul>
          <li>Home</li>
          <li>Movies</li>
          <li>TV Shows</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by language</li>
        </ul>
      </div>
      <div className="navbar-right">
        <img src={search} alt="" className="icons" />
        {!isSubscriptionLoading &&
        userSubscription?.status === "active" &&
        userSubscription?.planName ? (
          <p className="current-plan">{userSubscription.planName}</p>
        ) : (
          !isSubscriptionLoading && (
            <p className="current-plan">No Active Plan</p>
          )
        )}
        <p>Children</p>
        <img src={bell_icon} alt="" className="icons" />
        <div className="navbar-profile">
          <img src={profile_img} alt="" className="profile" />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p
              onClick={() => {
                logout();
              }}
            >
              Sign out
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
