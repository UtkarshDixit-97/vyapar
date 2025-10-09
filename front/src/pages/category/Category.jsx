import { React, useState, useEffect } from "react";
import qs from "query-string";
import axios from "axios";
import SearchCard from "../../components/searchCard/SearchCard";
import "./category.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function Category() {
  const [fetching, setFetching] = useState(true);
  const { search } = useLocation();
  const { categoryName } = qs.parse(search);
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkValidCategory = () => {
      const catrgoryList = [
        "others",
        "sports",
        "tech",
        "food",
        "outdoor",
        "cloths",
      ];
      if (catrgoryList.includes(categoryName) === false) {
        window.alert("No category of that value");
        navigate("/");
      }
    };
    const fetchCategoryProducts = async () => {
      setFetching(true);
      const res = await axios.get("/product/category?category=" + categoryName);
      setProductList(res.data);
      // console.log(results)
      setFetching(false);
      console.log(productList);
    };

    checkValidCategory();
    fetchCategoryProducts();
  }, [search]);

  return (
    <div>
      <div>
        {fetching == true ? (
          <div className="container mr-3 justify-content-center align-middle">
            <div className="row text-center justify-content-center align-middle">
              <div className="col-xl-10 loading-text">Loading . . .</div>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center text-white fs-3 ">
            <div className="col-xs-5 text-center result-number">
              we got {productList.length} results in this category.
            </div>
          </div>
        )}
      </div>

      <div className="container">
        <div className="row justify-content-center text-center">
          <h3 className="border bg-white border-dark border-4 my-2">
            {categoryName}
          </h3>
        </div>
        <div className="row justify-content-center catgory-page-hover">
          {productList.map((result) => (
            <div className="col-xl-10 search-result row justify-content-start">
              <SearchCard key={result._id} result={result} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
