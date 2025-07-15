import React from "react";
import "./Home.css";
import Navbar from "../../components/NavBar/Navbar";
import hero_banner from "../../assets/squid_game.mp4";
import hero_title from "../../assets/sg_image.png";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const Home = ({ userSubscription, isSubscriptionLoading }) => {
  return (
    <div className="home">
      <Navbar
        userSubscription={userSubscription}
        isSubscriptionLoading={isSubscriptionLoading}
      />
      <div className="hero">
        <video
          className="banner-img"
          src={hero_banner}
          autoPlay
          muted
          loop
        ></video>
        <div className="hero-caption">
          <img src={hero_title} alt="" />
          <p>
            Winning six Emmys, this world-renowned survival thriller follows
            desperate players competing in deadly children's games for
            life-changing sums of money.
          </p>
          <div className="hero-btns">
            <button className="btn">
              <img src={play_icon} alt="" />
              Play
            </button>
            <button className="btn dark-btn">
              <img src={info_icon} alt="" />
              More Info
            </button>
          </div>
          <TitleCards title="Popular on Netflix" />
        </div>
      </div>
      <div className="more-cards">
        <TitleCards title="Blockbuster Movies" category={"top_rated"} />
        <TitleCards title="Only on Netflix" category={"popular"} />
        <TitleCards title="Upcoming" category={"upcoming"} />
        <TitleCards title="Topics for you" category={"now_playing"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
