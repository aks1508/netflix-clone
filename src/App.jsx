import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import Pricing from "./pages/Pricing/Pricing";
import Payment from "./pages/Payment/Payment";
import { onAuthStateChanged } from "firebase/auth";
import { auth, listenForUserSubscriptionChanges } from "./firebase";
import { ToastContainer } from "react-toastify";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     setIsAuthenticated(!!user);
  //     setIsSubscriptionLoading(true);
  //     if (user) {
  //       const subscription = await getUserSubscription(user.uid);
  //       setUserSubscription(subscription);
  //     } else {
  //       setUserSubscription(null);
  //     }
  //     setIsSubscriptionLoading(false);
  //     console.log(user ? "Logged In" : "Logged Out");
  //   });
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    let unsubscribeFromAuth;
    let unsubscribeFromSubscription = () => {};

    unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsSubscriptionLoading(true);
      unsubscribeFromSubscription();
      if (user) {
        console.log(
          "App.jsx:User logged in, setting up real time subscription listener for uid:",
          user.uid
        );
        unsubscribeFromSubscription = listenForUserSubscriptionChanges(
          user.uid,
          (subscriptionData) => {
            setUserSubscription(subscriptionData);
            setIsSubscriptionLoading(false);
            console.log(
              "App.jsxL Real time subscription update recieved:",
              subscriptionData
            );
          }
        );
      } else {
        setUserSubscription(null);
        setIsSubscriptionLoading(false);
        console.log("App.jsx: User logged out,subscription cleared");
      }
      console.log(
        "App.jsx: Auth state changed. User:",
        user ? user.uid : "null"
      );
    });
    return () => {
      unsubscribeFromAuth();
      unsubscribeFromSubscription();
    };
  }, []);

  useEffect(() => {
    console.log("\n--- App.jsx: Navigation Effect Triggered ---");
    console.log("  isAuthenticated:", isAuthenticated);
    console.log("  userSubscription status:", userSubscription?.status);
    console.log("  isSubscriptionLoading:", isSubscriptionLoading);
    console.log("  currentPath:", location.pathname);

    if (isAuthenticated === null || isSubscriptionLoading) {
      console.log("  Still loading auth or subscription. Returning.");
      return; // Still determining auth state
    }

    const currentPath = location.pathname;
    const isLoginPage = currentPath === "/login";
    const isPricingPage = currentPath === "/pricing";
    const isPaymentPage = currentPath === "/payment";

    if (!isAuthenticated) {
      if (!isLoginPage) {
        console.log("  Not authenticated, redirecting to /login.");
        navigate("/login");
      }
      return;
    }
    if (userSubscription?.status === "active") {
      console.log("  User has an active subscription.");
      if (isLoginPage || isPricingPage || isPaymentPage) {
        console.log("  Redirecting to / (Home) due to active subscription.");
        navigate("/");
      }
      return;
    }

    if (userSubscription?.status !== "active") {
      console.log("  User is authenticated but NO active subscription.");
      if (currentPath === "/" || currentPath.startsWith("/player/")) {
        console.log(
          "  Redirecting to /pricing (no active subscription, on protected page)."
        );
        navigate("/pricing");
      } else if (isLoginPage) {
        console.log(
          "Redirecting to /pricing (on login page, no active subscription)."
        );
        navigate("/pricing");
      } else {
        console.log(
          "  Allowing access to current page (pricing/payment) as no active subscription."
        );
      }
      return;
    }
  }, [
    isAuthenticated,
    navigate,
    location.pathname,
    userSubscription,
    isSubscriptionLoading,
  ]);

  return (
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              userSubscription={userSubscription}
              isSubscriptionLoading={isSubscriptionLoading}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
};

export default App;
