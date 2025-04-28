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

const Home = () => {
  return (
    <div className="home">
      <Featured />
      <TrustedBy />
      <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard item={card} key={card.id} />
        ))}
      </Slide>
      <Features />
      <Slide slidesToShow={4} arrowsScroll={4}>
        {projects.map((project) => (
          <ProjectCard item={project} key={project.id} />
        ))}
      </Slide>
    </div>
  );
};

export default Home;
