import { React, useEffect, useState } from "react";
import HomeRecentCard from "../../components/homeRecentCard/HomeRecentCard.jsx";
import axios from "axios";
import "./market.css";
import { useNavigate } from "react-router-dom";
export default function Market() {
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const allProduct = async () => {
      const res = await axios.get("/product/market");
      await setProductList(res.data);
    };
    allProduct();
  }, []);

  // taking product Id from homerecentCrad
  const passIdToMarket = (id) => {
    navigate("/product/" + id);
  };

  return (
    <>
      <div className="row justify-content-center border border-white my-2 pt-2 text-center bg-warning">
        <h1>
          <b>All Products | व्यापारकेन्द्र</b>
        </h1>
      </div>
      <div className="container-auto bg-dark border border-1 border-white p-1 mx-1 p-2 text-center justify-content-center">
        <div className="row mt-2">
          {productList.map((product) => (
            <>
              <div className="col-xl-3 col-md-4 col-sm-6 mt-2 align-middle ">
                <HomeRecentCard
                  key={product._id}
                  product={product}
                  passIdToHome={passIdToMarket}
                />
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
