import "./home.css";
import { useState, React, useEffect } from "react";
import {
  Fastfood,
  SportsVolleyball,
  Devices,
  Loyalty,
  Deck,
  AddCircle,
} from "@mui/icons-material";
import HomeRecentCard from "../../components/homeRecentCard/HomeRecentCard";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [recent5, setRecent5] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent5 = async () => {
      const res = await axios.get("/product/recent5");
      setRecent5(res.data);
    };
    fetchRecent5();
  }, []);

  const navigateFromCardToProductPage = (id) => {
    navigate("/product/" + id);
  };

  return (
    <>
      <div className="home-container ">
        <section className=" text-light p-5 text-center ">
          <div className=" container ">
            <div className="d-sm-flex moto">
              <h1 className="moto-text">
                (っ◔◡◔)っ ♥ Business Ideal to your needs. ♥
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-dark text-light p-2 text-center align-items-center justify-content-end ">
          <div className=" row align-items-center justify-content-center">
            <div className="col-xl-3 col-sm-4 headset  text-center ms-1">
              <i className="bi bi-headset "></i>
              <h4>No Support!</h4>
              <p>We Offer no support!None at all</p>
            </div>
            <div className="col-xl-3 col-sm-4  text-center">
              <i className="bi bi-handbag-fill"></i>
              <h4>Everything Free</h4>
              <p>You heard that !</p>
            </div>
            <div className="col-xl-3 col-sm-4  text-center ">
              <i className="bi bi-speedometer"></i>
              <h4>Instant Delievery</h4>
              <p>Almost like I was too lazy to hire deleiver agents !</p>
            </div>
          </div>
        </section>
        {/*My Categories*/}
{/*        <section className="categories text-light mx-auto pb-2 text-center align-items-end ">
          <h4 className="categoriesTitle">Categories</h4>
          <div className=" container-fluid row justify-content-between ms-1">
            <div
              className="card-flex row col-lg-2 bg-dark col-md-2 col-sm-2 col-xs-2 justify-content-center  home-category-hover "
              onClick={() => navigate("/category?categoryName=sports")}
            >
              <SportsVolleyball
                className="img-fluid "
                style={{ fill: "limegreen", fontSize: 100 }}
              />
              <button className="btn  btn-custom btn-success mb-2">
                Sports
              </button>
            </div>
            <div
              className="card-flex row col-lg-2 bg-dark col-md-2 col-sm-2 col-xs-2 justify-content-center  home-category-hover "
              onClick={() => navigate("/category?categoryName=food")}
            >
              <Fastfood
                className="img-fluid"
                style={{ fill: "yellow", fontSize: 100 }}
              />
              <button className="btn  btn-custom btn-warning mb-2">Food</button>
            </div>
            <div
              className="card-flex row col-lg-2 bg-dark col-md-2 col-sm-2 col-xs-2 justify-content-center home-category-hover"
              onClick={() => navigate("/category?categoryName=tech")}
            >
              <Devices
                className="img-fluid"
                style={{ fill: "blue", fontSize: 100 }}
              />
              <button className="btn  btn-custom btn-primary mb-2">Tech</button>
            </div>
            <div
              className="card-flex row col-lg-2 col-md-2 bg-dark col-sm-2 col-xs-2 justify-content-center home-category-hover "
              onClick={() => navigate("/category?categoryName=cloths")}
            >
              <Loyalty
                className="img-fluid"
                style={{ fill: "Khaki", fontSize: 100 }}
              />
              <button className="btn btn-custom btn-secondary mb-2">
                Cloths
              </button>
            </div>
            <div
              className="card-flex row col-lg-2 col-md-2 bg-dark col-sm-2 col-xs-2 justify-content-center home-category-hover "
              onClick={() => navigate("/category?categoryName=outdooor")}
            >
              <Deck
                className="img-fluid"
                style={{ fill: "orange", fontSize: 100 }}
              />
              <button className="btn  btn-custom btn-danger mb-2">
                Outdoor
              </button>
            </div>
            <div
              className="card-flex row col-lg-2 col-md-2 bg-dark col-sm-2 col-xs-2 justify-content-center home-category-hover"
              onClick={() => navigate("/category?categoryName=others")}
            >
              <AddCircle
                className="img-fluid"
                style={{ fill: "white", fontSize: 100 }}
              />
              <button className="btn  btn-custom btn-light mb-2">Others</button>
            </div>
          </div>
        </section>*/}
        <section className="categories text-light mx-auto pb-4 text-center">
  <h4 className="categoriesTitle mb-4">Categories</h4>
  <div className="container-fluid row justify-content-between ms-1" style={{padding: "50px"}}>

    <div
      className="card-flex col-lg-2 col-md-4 col-sm-6 bg-dark justify-content-center home-category-hover mb-3"
      onClick={() => navigate("/category?categoryName=sports")}
    >
      <SportsVolleyball className="img-fluid mb-2" style={{ fill: "limegreen", fontSize: 100 }} />
      <button className="btn btn-custom btn-success">Sports</button>
    </div>

    <div
      className="card-flex col-lg-2 col-md-4 col-sm-6 bg-dark justify-content-center home-category-hover mb-3"
      onClick={() => navigate("/category?categoryName=food")}
    >
      <Fastfood className="img-fluid mb-2" style={{ fill: "yellow", fontSize: 100 }} />
      <button className="btn btn-custom btn-warning">Food</button>
    </div>

    <div
      className="card-flex col-lg-2 col-md-4 col-sm-6 bg-dark justify-content-center home-category-hover mb-3"
      onClick={() => navigate("/category?categoryName=tech")}
    >
      <Devices className="img-fluid mb-2" style={{ fill: "blue", fontSize: 100 }} />
      <button className="btn btn-custom btn-primary">Tech</button>
    </div>

    <div
      className="card-flex col-lg-2 col-md-4 col-sm-6 bg-dark justify-content-center home-category-hover mb-3"
      onClick={() => navigate("/category?categoryName=cloths")}
    >
      <Loyalty className="img-fluid mb-2" style={{ fill: "khaki", fontSize: 100 }} />
      <button className="btn btn-custom btn-secondary">Cloths</button>
    </div>

    <div
      className="card-flex col-lg-2 col-md-4 col-sm-6 bg-dark justify-content-center home-category-hover mb-3"
      onClick={() => navigate("/category?categoryName=outdoor")}
    >
      <Deck className="img-fluid mb-2" style={{ fill: "orange", fontSize: 100 }} />
      <button className="btn btn-custom btn-danger">Outdoor</button>
    </div>

    <div
      className="card-flex col-lg-2 col-md-4 col-sm-6 bg-dark justify-content-center home-category-hover mb-3"
      onClick={() => navigate("/category?categoryName=others")}
    >
      <AddCircle className="img-fluid mb-2" style={{ fill: "white", fontSize: 100 }} />
      <button className="btn btn-custom btn-light">Others</button>
    </div>

  </div>
</section>

        {/*Recently Added*/}
        <section className="row">
          <div className="container justify-content-center text-center">
            <h4 className="categoriesTitle">Recently Added</h4>
          </div>
        </section>
        <div className="card-group  bg-warngin  justify-content-center">
          {recent5.map((product) => (
            <HomeRecentCard
              key={product._id}
              product={product}
              passIdToHome={navigateFromCardToProductPage}
            />
          ))}

          {/*           <HomeRecentCard />
            <HomeRecentCard />
            <HomeRecentCard />
            <HomeRecentCard />
            */}
        </div>

        {/*footer*/}
      </div>
      {/* home-container*/}
    </>
  );
}
