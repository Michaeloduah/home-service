import React from "react";
import { Link, useParams } from "react-router-dom";
import { Slider } from "infinite-react-carousel";

import "./Gig.scss";

import { Reviews } from "../../components";
import request from "../../utils/request.utils";
import { useQuery } from "@tanstack/react-query";

const Gig = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["gig"],
    queryFn: () => request.get(`/gigs/${id}`).then((res) => res.data.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="gig">
      {!isLoading && data && (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              <Link to="/gigs" className="link">
                Fiverr
              </Link>
              &gt; {data.cat} &gt;
            </span>
            <h1>{data.title}</h1>
            <div className="user">
              <img
                className="pp"
                src={data.userId.img || "/img/noavatar.png"}
                alt=""
              />
              <span>{data.userId.username}</span>
              {!isNaN(data.toalStars / data.starNumber) ? (
                <div className="stars">
                  {Array(Math.round(data.toalStars / data.starNumber))
                    .fill()
                    .map((item, i) => (
                      <img src="/img/star.png" alt="" key={i} />
                    ))}
                  <span>{Math.round(data.toalStars / data.starNumber)}</span>
                </div>
              ) : (
                <div className="stars">
                  <img src="/img/star.png" alt="" />
                  {Math.round(data.toalStars / data.starNumber) || 0}
                </div>
              )}
            </div>
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              <img src={data.cover} />
              {data.images.map((i, id) => (
                <img src={i} alt="" key={id} />
              ))}
            </Slider>
            <h2>About This Gig</h2>
            <p>{data.description}</p>
            <div className="seller">
              <h2>About The Seller</h2>
              <div className="user">
                <img
                  src={data.userId.img ? data.userId.img : "/img/noavatar.png"}
                  alt=""
                />
                <div className="info">
                  <span>{data.userId.username}</span>
                  {!isNaN(data.toalStars / data.starNumber) ? (
                    <div className="stars">
                      {Array(Math.round(data.toalStars / data.starNumber))
                        .fill()
                        .map((item, i) => (
                          <img src="/img/star.png" alt="" key={i} />
                        ))}
                      <span>
                        {Math.round(data.toalStars / data.starNumber)}
                      </span>
                    </div>
                  ) : (
                    <div className="stars">
                      <img src="/img/star.png" alt="" />
                      {Math.round(data.toalStars / data.starNumber) || 0}
                    </div>
                  )}
                  <button>Contact Me</button>
                </div>
              </div>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{data.userId.country}</span>
                  </div>
                  <div className="item">
                    <span className="title">Member since</span>
                    <span className="desc">
                      {new Date(data.userId.createdAt).toLocaleString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="item">
                    <span className="title">Avg. response time</span>
                    <span className="desc">4 hours</span>
                  </div>
                  <div className="item">
                    <span className="title">Last delivery</span>
                    <span className="desc">1 day</span>
                  </div>
                  <div className="item">
                    <span className="title">Languages</span>
                    <span className="desc">English</span>
                  </div>
                </div>
                <hr />
                <p>{data.userId.description || "No description provided"}</p>
              </div>
            </div>
            <Reviews data={data} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>${data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>2 Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {data.features.map((feature, key) => (
                <div className="item" key={key}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Link className="link" to={`/pay/${data._id}`}>
              <button>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gig;
