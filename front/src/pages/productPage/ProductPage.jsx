import { React, useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Review from "../../components/review/Review";
import "./productpage.css";

import { PermMedia, Cancel, AddShoppingCart } from "@material-ui/icons";

export default function ProductPage() {
  // const {user} = useContext(AuthContext);
  const user = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const productId = useParams().productId;
  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState({});
  const [reviewImage, setReviewImage] = useState(null);
  const [timesBought, setTimesBought] = useState(0)
  const reviewTitle = useRef();
  const reviewDesc = useRef();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const quantity = useRef();
  const [presentInCart, setPresentInCart] = useState(false);
  const [cart, setCart] = useState({});

  const [userPage, setUserPage] = useState({});

  useEffect(() => {
    const fectProductDetails = async () => {
      try {
        const res = await axios.get("/product/" + productId);
        await setProduct(res.data);
        await setTimesBought(res.data.times_bought)
      } catch (err) {
        console.log(err);
        navigate("*");
      }
    };
    const fetchReviews = async () => {
      const revv = await axios.get("/review/product/" + productId);
      await setReviews(revv.data);
    };

    const fetchCart = async () => {
      await console.log("executing");
      const red = await axios.get("/cart/" + user.cart_id);
      await setCart(red.data);
      if (red.data.product_list.includes(productId)) {
        setPresentInCart(true);
      }
      // console.log(red.data.product_list)
    };

    fectProductDetails();

    fetchReviews();
    if (user && user.isSeller === false) {
      fetchCart();
    }
  }, []);

  useEffect(() => {
    if (product) {
      try {
        const fetchSellerDetails = async () => {
          const rev = await axios.get(
            "/seller/profile?userId=" + product.sellerId,
          );
          await setSeller(rev.data);
        };
        // console.log(seller)
        fetchSellerDetails();
      } catch (err) {
        console.log("gdsfuhdsgfdgsafsdfadfadsfsad");
      }
    }
  }, [product]);

  // console.log(seller)
  // console.log(presentInCart)
  // console.log(cart.product_list)
  // console.log(cart)

  const placeOrder = async (e) => {
    e.preventDefault();
    if (user && user.isSeller === true) {
      alert("Please Login as a User to Buy . . .");
      return;
    }
    if (!quantity.current.value || quantity.current.value === "0") {
      alert("please enter Item Quanity");
      return;
    }

    const orderDetails = {
      username: user.username,
      product_name: product.product_name,
      product_id: product._id,
      seller_id: product.sellerId,
      user_id: user._id,
      price: product.price * quantity.current.value,
      phone: user.phoneNumber,
      address: user.address,
      city: user.city,
      state: user.state,
      quantity: quantity.current.value,
      seller_name: seller.sellerName,
    };

    // console.log()
    try {
      // console.log(orderDetails)
      const res = await axios.post("/order", orderDetails)
      setTimesBought(timesBought + Number(quantity.current.value))

      alert(res.data);

      // console.log(user)
      // await axios.post('/order')
    } catch (err) {
      alert(err);
    }
  };

  const addToCart = async (e) => {
    e.preventDefault();
    if (user && user.isSeller === false) {
      try {
        await axios.put("/cart/add", {
          cart_id: user.cart_id,
          product_id: product._id,
        });
        await setPresentInCart(!presentInCart);
        await alert("Done");
      } catch (err) {
        alert(err);
      }
    } else {
      alert("Please Login as user to Add to cart");
    }
  };

  // console.log(user.username);
  const CreateDynamicModal = ({ imagename, index }) => {
    return (
      <div
        class="modal modal-fullscreen fade"
        id={index}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog  bg-success bg-opacity-75 border border-3 border-warning ">
          <div class="modal-content bg-warning">
            <div class="modal-header">
              <button
                type="button"
                class="btn-close btn btn-danger text-whites"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-content">
              <div class="modal-body">
                <img src={`${PF}${imagename}`} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("/user/profile/?userId=" + user._id);
      await setUserPage(res.data);
    } catch (err) {
      alert("Error");
      return;
    }
    if (userPage.userBought.includes(productId)) {
      const reviewToBeAdded = {
        username: userPage.username,
        product_id: productId,
        user_id: userPage._id,
        title: reviewTitle.current.value,
        desc: reviewDesc.current.value,
        seller_id: product.sellerId,
      };
      try {
        if (reviewImage) {
          try {
            const fileName = Date.now() + reviewImage.name;
            const data = new FormData();
            data.append("name", fileName);
            data.append("file", reviewImage);
            reviewToBeAdded.image = fileName;
            // console.log(newPost);
            try {
              await axios.post("/upload/single", data);
            } catch (e) {
              alert("the Image Upload Failed");
              return;
            }
          } catch (err) {
            // alert(err)
            alert("Couldn't Post Image");
          }
        }
        try {
          console.log(reviewToBeAdded);
          await axios.post("/review", reviewToBeAdded);
          await window.location.reload();
        } catch (err) {
          alert("The Review Details couldn't be Posted");
        }
      } catch (err) {
        alert(err);
      }
    } else {
      alert("You Need to Place The Order First to Review It");
    }
  };

  return (
    <>
      <div className="container-fluid my-1 bg-warning bg-opacity-50">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-md-6 col-sm-12 justify-content-center productImage">
            <img
              src={`${PF}${product.main_image}`}
              data-bs-toggle="modal"
              data-bs-target="#main-image"
              alt=""
              className="img-fluid  border border-warning border-3"
            />
            <div className="row col-xl-12 col-md-12 col-sm-12 bg-secondary mt-2 justify-content-center bg-opacity-50">
              {/*using index to Map images is way better*/}
              {product &&
                product.other_images &&
                product.other_images.map((image, index) => (
                  <>
                    <img
                      src={`${PF}${image}`}
                      class="img-fluid product-extra-images"
                      alt="..."
                      data-bs-toggle="modal"
                      data-bs-target={`#io${index}`}
                    />

                    <CreateDynamicModal
                      imagename={image}
                      index={`io${index}`}
                    />
                  </>
                  // <h1>{image}</h1>
                ))}
            </div>
            {/*     // <h1>{presentInCart?"present":"NOt"}</h1>*/}
          </div>
          <div className="col-xl-5 col-md-5 col-sm-12 text-white fs-3 justify-content-center text-center bg-dark border border-white border-4 rounded bg-opacity-75">
            <div className="row fs-1">
              <b>{product.product_name}</b>
            </div>
            <hr />
            <div className="row fs-5 bg-warning text-success mx-auto">
              <b>Description</b> : {product.desc}
            </div>
            <div className="row fs-5 bg-warning bg-white text-dark">
              <p>
                <b>Price</b> : {product.price} ₹ ,INR
              </p>
            </div>
            <div className="d-flex fs-5 bg-warning bg-white text-dark">
              <div className="col-xl-6 col-md-6 col-sm-12">
                Category : {product.category}
              </div>
              <span>|</span>
              <div className="col-xl-6 col-md-6 col-sm-12">
                Sold : {timesBought || product.times_bought}
              </div>
            </div>
            <div className="row justify-content-end fs-5">
              <div
                className="d-flex product-to-seller"
                onClick={() => navigate(`/seller/${seller._id}`)}
              >
                <small>
                  Sold By :{" "}
                  <b className="text-warning">
                    <u>{seller.sellerName}</u>
                  </b>
                </small>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-3 col-sm-12 row mx-auto text-white fs-3 justify-content-center mb-1  bg-primary mt-3 border border-white border-4 rounded bg-opacity-75">
            <input
              className="form-control my-2"
              type="number"
              ref={quantity}
              placeholder="Please Enter Quanity"
              required
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                  alert("Only accepts Numbers");
                }
              }}
            />

            <button
              className="btn btn-success border my-2 text-white fs-2  align-end border-2 border-warning"
              onClick={placeOrder}
            >
              Buy Now
            </button>
            <button
              className="btn btn-dark border my-2 text-white ms-auto border-2 border-white"
              onClick={addToCart}
            >
              {presentInCart ? `Remove from Cart` : `Add To Cart`}
              <AddShoppingCart style={{ fontSize: "32px", color: "white" }} />
            </button>
          </div>
        </div>
      </div>
      {/*you own review*/}
      {user.isSeller ? (
        <div className="container justify-content-center mt-3 p-2 bg-dark">
          <div className="col-xl-11 col-md-11 col-sm-11 mx-auto justify-content-center bg-danger py-3 border border-white">
            <div className="d-flex text-center text-white fs-4">
              You Can Not Comment As A Seller . You can only Comment after you
              have bought the item. . . .
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="container justify-content-center mt-3 bg-dark">
            <div className=" col-xl-11 col-md-11 col-sm-11 justify-content-center bg-dark py-1">
              <div className="row justify-content-center my-3 bg-dark">
                <div className="col-xl-2 col-md-3 col-sm-12 text-center bg-dark">
                  <label className="bg-warning mt-1 ">Title</label>
                </div>
                <input
                  placeholder={
                    "How was your experience with product " +
                    user.username +
                    "?"
                  }
                  className="review-title col-xl-10 col-md-9 col-sm-12 mt-1"
                  ref={reviewTitle}
                />
              </div>
              <div className="row justify-content-center my-3 bg-dark">
                <div className="col-xl-2 col-md-3 col-sm-12 text-center">
                  <label className="bg-warning mt-1">Description</label>
                </div>
                <textarea
                  placeholder={"Describe the details " + user.username + "?"}
                  className="review-desc col-xl-10 col-md-9 col-sm-12 mt-1"
                  ref={reviewDesc}
                ></textarea>
              </div>
              <hr className="shareHr" />
              <form className="shareBottom text-center" onSubmit={submitReview}>
                {reviewImage && (
                  <div className="shareImgContainer">
                    <img
                      className="shareImg img-fluid"
                      src={URL.createObjectURL(reviewImage)}
                      alt=""
                    />
                    <Cancel
                      className="shareCancelImg"
                      style={{ fontSize: "32px", color: "white" }}
                      onClick={() => setReviewImage(null)}
                    />
                  </div>
                )}
                <label
                  htmlFor="file"
                  className="text-center border border-3 border-primary image-change"
                >
                  <PermMedia htmlColor="white" className="text-center" />
                  <span className="text-white">Photo </span>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    acceptable=".png,.jpeg,.jpg"
                    onChange={(e) => setReviewImage(e.target.files[0])}
                  />
                </label>
                <button
                  type="submit"
                  className="m-2 p-2 btn btn-outline-success text-warning"
                  onClick={submitReview}
                >
                  Share
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/*Rveview Window*/}
      <div className="container my-2 bg-warning border border-whiter justify-content-center p-2 border-5">
        <div className="row col-xl-10 mx-auto">
          {reviews.map((review, index) => (
            <Review id={review._id} review={review} index={index} />
          ))}
        </div>
      </div>
      <div
        class="modal modal-fullscreen  fade mt-5 "
        id="main-image"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <button
          type="button"
          class="btn-close btn-danger text-white btn-modal-product"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        <div class="modal-dialog main-image-moadl my-5 mt-5 p-1 row bg-success text-center bg-opacity-75 border border-3 border-warning ">
          <img
            src={`${PF}${product.main_image}`}
            className="main-image img-fluid mx-auto my-auto"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

// <img className="shareProfileImg" src={user.profilePicture ? PF+user.profilePicture : PF+"no_avatar/image_proxy.jpeg"} alt="" />
