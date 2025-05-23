import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.scss";

const ProjectCard = ({ item }) => {
  return (
    <Link to="/" className="link">
      <div className="project-card">
        <img src={item.img} alt="" />
        <div className="info">
          <img src={item.pp} alt="" />
          <div className="texts">
            <h2>{item.cat}</h2>
            <span>{item.username}</span>
            {item.completedDate && <span className="completed">Completed: {item.completedDate}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;