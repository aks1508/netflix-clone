import React, { useEffect, useRef, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate } from "react-router-dom";
import {
  auth,
  listenForUserSubscriptionChanges,
  onAuthStateChanged,
} from "../../firebase";
import { toast } from "react-toastify";
import Hls from "hls.js";

const Player = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  // const [apiData, setApiData] = useState({
  //   name: "",
  //   key: "",
  //   published_at: "",
  //   type: "",
  // });

  const [userSubscription, setUserSubscription] = useState(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const HLS_STREAM_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

  // const options = {
  //   method: "GET",
  //   headers: {
  //     accept: "application/json",
  //     Authorization:
  //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTJkZmZjOTNlYWY2YmJjNDM2NGFjYjlmMWQxMjEzZCIsIm5iZiI6MTczNTk5MjA1OC43MTQsInN1YiI6IjY3NzkyMmZhNWFjMWJkODI2MTY2YjM0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KHq9m3pFmmxfKOtw7-oN0HHoDjvzTrpOnSa47sEkekU",
  //   },
  // };

  // useEffect(() => {
  //   fetch(
  //     `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
  //     options
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       const trailer = res.results.find((video) => video.type === "Trailer");
  //       if (trailer) {
  //         setApiData(trailer);
  //       }
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  useEffect(() => {
    let unsubscribeFromSubscription = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSubscriptionLoading(true);
        console.log(
          "Player.jsx: User logged in, setting up subscription listner"
        );
        unsubscribeFromSubscription = listenForUserSubscriptionChanges(
          user.uid,
          (subscriptionData) => {
            setUserSubscription(subscriptionData);
            setIsSubscriptionLoading(false);
            console.log(
              "Player.jsx: Real time subscription data recieved",
              subscriptionData
            );
          }
        );
      } else {
        setUserSubscription(null);
        setIsSubscriptionLoading(false);
        console.log("Player.jsx: User logged out,subscription cleared");
      }
    });
    return () => {
      unsubscribeAuth();
      unsubscribeFromSubscription();
    };
  }, []);

  useEffect(() => {
    if (!isSubscriptionLoading && userSubscription?.status === "active") {
      const video = videoRef.current;
      if (video) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(HLS_STREAM_URL);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
            toast.success("HLS video started playing");
          });
          hls.on(Hls.Events.ERROR, function (event, data) {
            console.error("HLS.js error:", data);
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.MEDIA_ERROR:
                  toast.error("Media error during video playback.");
                  hls.recoverMediaError();
                  break;
                case Hls.ErrorTypes.NETWORK_ERROR:
                  toast.error("Network error during video playback");
                  hls.startLoad;
                  break;
                default:
                  toast.error("Fatal HLS playback error.Please try again.");
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = HLS_STREAM_URL;
          video.addEventListener("loadedmetadata", () => {
            video.play();
            toast.success("Native HLS video started playing");
          });
        } else {
          toast.error("Your browser does not support HLS Video playback");
        }
      }
    } else if (
      !isSubscriptionLoading &&
      userSubscription?.status !== "active"
    ) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
      toast.warn("You need an active subscription to watch this content");
      navigate("/pricing");
    }
  }, [isSubscriptionLoading, userSubscription, navigate]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt=""
        onClick={() => {
          navigate("/");
        }}
      />
      {isSubscriptionLoading ? (
        <p>Loading subscription details...</p>
      ) : userSubscription?.status === "active" ? (
        <video
          ref={videoRef}
          width="90%"
          height="90%"
          title="Movie Player"
          controls
          autoPlay
          muted
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>You need an active subscription to watch this content</p>
      )}
      {/* <iframe
        src={`https://www.youtube.com/embed/${apiData.key}`}
        width="90%"
        height="90%"
        title="trailer"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <div className="player-info">
        <p>{apiData.published_at.slice(0, 10)}</p>
        <p>{apiData.name}</p>
        <p>{apiData.type}</p>
      </div> */}
    </div>
  );
};

export default Player;
