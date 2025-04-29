import React from "react";
import "./Home.scss";

import {
  TrustedBy,
  Featured,
  Slide,
  CatCard,
  Features,
  ProjectCard,
} from "../../components";
import { cards, projects } from "../../data";
import RecommendationWidget from "../../components/RecommendationWidget/RecommendationWidget";

const Home = () => {
  return (
    <div className="home">
      <Featured />
      <TrustedBy />
      <div className="category-section">
        <h2>Popular Home Services</h2>
        <Slide slidesToShow={5} arrowsScroll={5}>
          {cards.map((card) => (
            <CatCard item={card} key={card.id} />
          ))}
        </Slide>
      </div>
      
      <div className="recommendation-section">
        <h2>Recommended for You</h2>
        <RecommendationWidget userId="user123" />
      </div>
      
      <Features />
      
      <div className="projects-section">
        <h2>Recent Completed Projects</h2>
        <p>See what our service providers have accomplished for other homeowners</p>
        <Slide slidesToShow={4} arrowsScroll={4}>
          {projects.map((project) => (
            <ProjectCard item={project} key={project.id} />
          ))}
        </Slide>
      </div>
      
      <div className="emergency-services">
        <div className="emergency-container">
          <h2>Need Emergency Service?</h2>
          <p>We have service providers available 24/7 for urgent needs</p>
          <button className="emergency-button">Find Emergency Help</button>
        </div>
      </div>
    </div>
  );
};

export default Home;