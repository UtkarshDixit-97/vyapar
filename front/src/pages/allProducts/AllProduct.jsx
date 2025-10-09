import { React, useState, useEffect } from "react";
import qs from "query-string";
import axios from "axios";
import SearchCard from "../../components/searchCard/SearchCard";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function AllProduct() {
  const [productList, setProductList] = useState([]);
  const [seller, setSeller] = useState({});
  const [deleteRequest, setDeleteRequest] = useState(false);
  const sellerId = useParams().sellerId;
  useEffect(() => {
    const fetchProductsOfSellerAndSellerToo = async () => {
      const res = await axios.get("/product/seller/" + sellerId);
      setProductList(res.data);
      const sellerSearch = await axios.get(
        "/seller/profile?userId=" + sellerId,
      );
      setSeller(sellerSearch.data);
    };
    fetchProductsOfSellerAndSellerToo();
  }, []);

  const deleteItemFromSeller = async (result) => {
    // e.preventDefault();

    let a = window.confirm("This WIll Delete The Product from You MarketPlace");
    if (a) {
      setDeleteRequest(true);
      // Trying to Delete Main Image
      try {
        await axios.post("/upload/delete", { filename: result.main_image });
      } catch (err) {
        setDeleteRequest(false);
        return;
        alert("failed to delete main image");
      }
      // trying to delete other images if they exist
      if (result.other_images.length > 0) {
        const DeleteOtherImages = async () => {
          const massDelete = result.other_images.map((other_image) => {
            try {
              axios.post("/upload/delete", { filename: other_image });
            } catch (err) {
              // setRegistering(false)
              console.log(err);
              setDeleteRequest(false);
              alert("one of the other Images of product failed to Delete ");
              return;
            }
          });
          const massDeletePromise = await Promise.all(massDelete);
        };

        DeleteOtherImages();
      }

      try {
        await axios.delete("/product/" + result._id);
        setDeleteRequest(false);
        await alert("Deleted");
      } catch (err) {
        setDeleteRequest(false);
        alert(err);
      }
    }
  };
  return (
    <div className="container justify-content-center border bg-primary border-danger border-5">
      <div className="row my-2 bg-success text-white text-center">
        <h3>All the products posted by {seller.sellerName}</h3>
      </div>
      <div className="row my-2 bg-dark text-white">
        {productList.map((result) => (
          <>
            <SearchCard key={result._id} result={result} />
            <div className="col-xl-1 col-md-1 col-sm-1 mx-3 my-auto">
              <button
                className="btn btn-danger"
                onClick={() => deleteItemFromSeller(result)}
                disabled={deleteRequest}
              >
                {deleteRequest ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
