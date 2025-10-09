import { React, useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./sellerpage.css";
import Review from "../../components/review/Review";
import HomeRecentCard from "../../components/homeRecentCard/HomeRecentCard";
import { PermMedia, Cancel } from "@material-ui/icons";
import { sellerLoginAfterEdit } from "../../apiCalls";
import { logoutCall } from "../../apiCalls";

export default function SellerPage() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  // const {user} = useContext(AuthContext);

  const [sellerDeleteRequest, setSellerDeleteRequest] = useState(false);
  // If the user decides to delete his data
  const [productListOfSeller, setProductListOfSeller] = useState([]);

  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const [pageSeller, setPageSeller] = useState({});
  const sellerId = useParams().sellerId;
  const [reviews, setReviews] = useState([]);
  const [foundSeller, setFoundSeller] = useState(true);
  const [recent3, setRecent3] = useState([]);
  const [sellerProfile, setSellerProfile] = useState();
  const [newSellerProfile, setNewSellerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sellerName = useRef(pageSeller.sellerName);
  const sellerEmail = useRef(pageSeller.email);
  const sellerPhone = useRef(pageSeller.phoneNumber);
  const sellerCity = useRef(pageSeller.city);
  const sellerState = useRef(pageSeller.state);
  const sellerAddress = useRef(pageSeller.address);

  const [currentPassword, setCurrentPassword] = useState("");

  // console.log(user)
  // console.log(JSON.parse(localStorage.getItem("user")).password)

  useEffect(() => {
    let isMounted = true;
    axios
      .get("/seller/profile?userId=" + sellerId)
      .then((response) => {
        if (isMounted) {
          setPageSeller(response.data);
          setSellerProfile(response.data.profileImage);
        }
        // console.log(pageSeller)
      })
      .catch((error) => {
        setFoundSeller(false);
        console.log(error);
        navigate("*");
        // console.error({ error });
      });
    // get most recent reviews of seller
    axios
      .get("/review/seller/" + sellerId)
      .then((response) => {
        if (isMounted) {
          setReviews(response.data);
        }
        // console.log(reviews)
      })
      .catch((error) => {
        console.log(error);

        setFoundSeller(false);
        // console.error({ error });
      });
    // get 3 most recent products added
    axios
      .get("/seller/mostrecent3?userId=" + sellerId)
      .then((response) => {
        if (isMounted) {
          setRecent3(response.data);
        }
        // console.log(reviews)
      })
      .catch((error) => {
        setFoundSeller(false);
        // console.error({ error });
      });
    return () => {
      isMounted = false;
    };
  }, [sellerId]);
  // console.log(reviews)
  // confirm delete account method
  const deleteAccount = (e) => {
    e.preventDefault();
    const ans = 0;
    let a = window.confirm("are ya Sure");
    console.log(a);
  };

  // Edit the account details
  const editSeller = async (e) => {
    e.preventDefault();
    if (sellerProfile && newSellerProfile) {
      alert("Profile can't have Blank Image for Seller");
      return;
    }
    const password = user.password;
    setLoading(true);
    if (sellerProfile) {
      try {
        const confirmation = await window.confirm(
          "Are Ya sure,Pres OK to confirm ",
        );
        if (confirmation) {
          const res = await axios.put("/seller/" + user._id, {
            sellerName: sellerName.current.value,
            email: sellerEmail.current.value,
            phoneNumber: sellerPhone.current.value,
            city: sellerCity.current.value,
            state: sellerState.current.value,
            address: sellerAddress.current.value,
          });
          try {
            // await alert('All The information has been updated ')

            // console.log("In the sllerloginblock")
            await sellerLoginAfterEdit(
              {
                email: res.data.email,
                password: JSON.parse(localStorage.getItem("user")).password,
              },
              dispatch,
            );
            window.location.reload();
            alert("Everything Updated Successfully");
            setLoading(false);
          } catch (e) {
            setLoading(false);
            alert("Info Updated but relogin failld");
          }
        } else {
          await setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        alert(err);
      }
    } else {
      // Deleting Old IMage

      try {
        await axios.post("/upload/delete", {
          filename: pageSeller.profileImage,
        });
      } catch (err) {
        // console.log(err);
        alert(err);
        setLoading(false);
        return;
      }
      const newSellerInfo = {
        sellerName: sellerName.current.value,
        email: sellerEmail.current.value,
        phoneNumber: sellerPhone.current.value,
        city: sellerCity.current.value,
        state: sellerState.current.value,
        address: sellerAddress.current.value,
      };
      // uplaoding new image
      try {
        const fileName = Date.now() + newSellerProfile.name;
        const data = new FormData();
        data.append("name", fileName);
        data.append("file", newSellerProfile);
        newSellerInfo.profileImage = fileName;
        await axios.post("/upload/single", data);
        // Updating the seller finally
        try {
          const res = await axios.put("/seller/" + user._id, newSellerInfo);
          await sellerLoginAfterEdit(
            {
              email: res.data.email,
              password: JSON.parse(localStorage.getItem("user")).password,
            },
            dispatch,
          );
          await alert("Everything updated Smoothly");
          window.location.reload();
        } catch (err) {
          setLoading(false);
          await alert(err);
        }

        setLoading(false);
      } catch (err) {
        // console.log(err);
        setLoading(false);
        alert(err);
        return;
      }
    }
  };

  const navigateToPorductFromSeller = async (id) => {
    // id.preventDefault();
    navigate("/product/" + id);
  };

  // delete current profile pic
  const deleteCurrentProfilePicture = (e) => {
    e.preventDefault();
    const deleteProfileConfirmation = window.confirm(
      "Are ya sure? This action will delete the profile picture from our db",
    );
    if (deleteProfileConfirmation === true) {
      setSellerProfile(null);
    }
  };

  // delete current profile Picture
  const deleteSellerProfileMethod = (e) => {
    e.preventDefault();
    const deleteProfileConfirmation = window.confirm(
      "Are ya sure? This will set delete the image you want to set and then you will a Seller without image, that looks bad",
    );
    if (deleteProfileConfirmation === true) {
      setNewSellerProfile(null);
    }
  };
  const [new1, setNew1] = useState();
  // console.log(productListOfSeller)
  const deleteSeller = async () => {
    // e.preventDefault();
    let a = window.confirm(
      "Are ya Sure About That? This will delete Your Profile From Vyapar | व्यापार app , Your products will be deleted, But not reviews made to you or your Products",
    );
    if (a) {
      setSellerDeleteRequest(true);
      // fetch all the products of the seller
      const res = await axios.get("/product/seller/" + sellerId);

      // trying to delete all images first
      // First delete main images
      const DeleteMainImages = async () => {
        const massDelete = res.data.map((product) => {
          try {
            console.log("deleting image of product " + product.main_image);
            axios.post("/upload/delete", { filename: product.main_image });
            console.log("deleted image of product " + product.main_image);
          } catch (err) {
            // setRegistering(false)
            console.log(err);
            setSellerDeleteRequest(false);
            alert("one of the Main Images failed to delete");
            return;
          }
        });
        const massDeletePromise = await Promise.all(massDelete);
      };
      DeleteMainImages();
      // Then Now we try to delete All images of products
      const DeleteOtherImagesOfProducts = async () => {
        // this deletes all the other images
        const massDeleteOtherImages = res.data.map(({ other_images }) => {
          // this deletees images individually or product
          // const IndividualOtherImagesDeleteOfProduct =
          other_images.map((other_image) => {
            try {
              axios.post("/upload/delete", { filename: other_image });
            } catch (err) {
              setSellerDeleteRequest(false);
              alert(
                "One of the other images failed to be deleted, Delete Request Aborted",
              );
              return;
            }
          });
          // const IndividualOtherImagesDeleteOfProductPromise = await Promise.all(IndividualOtherImagesDeleteOfProduct)
        });
        const massDeleteOtherImagesPromise = await Promise.all(
          massDeleteOtherImages,
        );
      };
      await DeleteOtherImagesOfProducts();
      // Now lets Delete the product List {}
      const DeleteProductsOfSeller = async () => {
        const massProductDelete = res.data.map((product) => {
          try {
            axios.delete("/product/" + product._id);
          } catch (err) {
            setSellerDeleteRequest(false);
            alert("one of the product failed to be deleted");
            return;
          }
        });
        const massProductDeletePromise = await Promise.all(massProductDelete);
      };
      await DeleteProductsOfSeller();
      // trying to delete the Seller Finally
      try {
        await axios.delete("/seller/" + sellerId);
        setSellerDeleteRequest(false);
        alert("everything Deleted");
        localStorage.removeItem("user");
        logoutCall({}, dispatch);
        navigate("/");
      } catch (err) {
        setSellerDeleteRequest(false);
        alert("all products of seller deletd  but seller failed to be purged ");
      }
    } else {
      return;
    }
  };

  // Account edit buttons
  const EditDetails = () => {
    return (
      <>
        <button
          className="btn btn-warning mt-2"
          data-bs-toggle="modal"
          data-bs-target="#EditSeller"
        >
          Edit Account
        </button>
        <button className="btn btn-dark mt-2" onClick={() => navigate("/add")}>
          Add Product +
        </button>
        <button
          className="btn btn-primary mt-2 mx-auto"
          onClick={() => navigate("/orders")}
        >
          Orders
        </button>

        <br />
        <button
          className="btn btn-danger mt-2"
          onClick={deleteSeller}
          disabled={sellerDeleteRequest}
        >
          {sellerDeleteRequest ? "Deleting" : "Delete Account"}
        </button>
      </>
    );
  };

  const ShowSeller = ({ pageSeller }) => {
    return (
      <>
        <div className="d-flex bg-warning bg-opacity-75 text-center m-2 p-2 justify-content-center">
          <div className="row justify-content-center">
            <div className="col-xl-3 col-md-4 col-sm-12">
              <img
                src={
                  pageSeller.profileImage
                    ? `${PF}${pageSeller.profileImage}`
                    : `${PF}/default_images/default_seller.jpg`
                }
                alt="Seller Image"
                className="img-fluid sellerImage"
              />
            </div>
            <div className="container col-xl-7 col-md-6 col-sm-12 justify-content-center align-item-center">
              <div className="  text-center  border text-white fs-3 pageSeller-title bg-dark bg-opacity-75 ">
                <b className="overflow-scroll">{pageSeller.sellerName}</b>
              </div>
              <div className="row">
                <div className="col-xl-4 col-md-4 col-sm-4">
                  <div className=" text-center justify-content-between border text-white bg-dark bg-opacity-75 fs-3">
                    <b className="overflow-auto">{pageSeller.city}</b>
                  </div>
                </div>
                <div className="col-xl-4 col-md-4 col-sm-4">
                  <div className=" text-center justify-content-between border text-white bg-dark bg-opacity-75 fs-3">
                    <b>{pageSeller.state}</b>
                  </div>
                </div>
                <div className="col-xl-4 col-md-4 col-sm-4">
                  <div className=" text-center justify-content-between border text-white fs-3 bg-success bg-opacity-75">
                    <b>{pageSeller.totalItemsSold}</b>: Items Sold
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-center bg-dark">
                <div className="row justify-content-center text-Primary fs-5  bg-secondary bg-opacity-25 text-center mb-1">
                  <b className="Recent-headline">Most Recent Products Added</b>
                </div>
                {recent3.map((recent) => (
                  <div className="justify-content-center col-xl-4 col-md-4 col-sm-4 ">
                    <HomeRecentCard
                      product={recent}
                      passIdToHome={navigateToPorductFromSeller}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xl-1 col md-1 col-sm-12 justify-content-center text-center ">
              {user && user._id === pageSeller._id && <EditDetails />}
            </div>
          </div>
        </div>
        <div className="row text-center bg-primary border-primary bg-opacity-50">
          <div className="row fs-3 text-white bg-secondary bg-opacity-25 text-center justify-content-center">
            Most Recent Reviews
          </div>
          <div className="row justify-content-center">
            {reviews.map((review) => (
              <div className="col-xl-5 border border-dark border-5 col-md-5 col-sm-5 mx-auto mx-5 my-1">
                <Review key={review._id} review={review} />
              </div>
            ))}
          </div>
        </div>
      </>

    );
  };

  return (
    <>
      {foundSeller == true ? (
        <ShowSeller pageSeller={pageSeller} />
      ) : (
        <div className="container-fluid bg-danger border m-2 p-2 fs-4 text-center text-white mx-auto">
          We did not found any seller
        </div>
      )}

      {/*editing the Seller*/}
      <div id="EditSeller" className="modal fade" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content bg-success">
            <div className="modal-header">
              <h5 className="modal-title text-light">
                Edit Your account details
              </h5>
              <button
                type="button"
                className="btn-close btn-outline-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form className="needs-validation p-3" onSubmit={editSeller}>
              {sellerProfile ? (
                <br />
              ) : (
                <label
                  htmlFor="file"
                  className="shareOption shareOptionText  d-flex justify-content-center"
                >
                  <PermMedia htmlColor="white" className="shareIcon" />
                  <span className="shareOptionText text-center text-light ">
                    Profile Photo
                  </span>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    acceptable=".png,.jpeg,.jpg"
                    onChange={(e) => setNewSellerProfile(e.target.files[0])}
                  />
                </label>
              )}

              {newSellerProfile && (
                <div className="shareImgContainer">
                  <img
                    className="shareImg img-fluid"
                    src={URL.createObjectURL(newSellerProfile)}
                    alt=""
                  />
                  <Cancel
                    className="shareCancelImg"
                    onClick={() => setNewSellerProfile(null)}
                  />
                </div>
              )}
              {sellerProfile && (
                <div className="shareImgContainer">
                  <img
                    className="shareImg img-fluid"
                    src={`${PF}${sellerProfile}`}
                    alt=""
                  />
                  <Cancel
                    className="shareCancelImg"
                    onClick={() => setSellerProfile(null)}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="mb-2 text-light">Full Name</label>
                <input
                  id="email"
                  className="form-control"
                  ref={sellerName}
                  defaultValue={pageSeller.sellerName}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 text-light">
                  Phone Number (Required){" "}
                </label>
                <input
                  className="form-control"
                  type="number"
                  ref={sellerPhone}
                  defaultValue={pageSeller.phoneNumber}
                  required
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                      alert("Only accepts Numbers");
                    }
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="mb-2 text-light" type="email">
                  E-Mail Address (Required)
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  name="email"
                  ref={sellerEmail}
                  required
                  defaultValue={pageSeller.email}
                />
              </div>

              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light" type="password">
                    Address (Required)
                  </label>
                </div>
                <input
                  className="form-control"
                  defaultValue={pageSeller.address}
                  ref={sellerAddress}
                />
              </div>
              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light">City (Required)</label>
                </div>
                <input
                  className="form-control"
                  required
                  defaultValue={pageSeller.city}
                  ref={sellerCity}
                />
              </div>
              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light">State (Required)</label>
                </div>
                <input
                  className="form-control"
                  required
                  defaultValue={pageSeller.state}
                  ref={sellerState}
                />
              </div>

              <div className="d-flex align-items-center justify-content-center">
                <button
                  type="sumbit"
                  className=" p-2 px-5  text-white  loginbtn "
                  disabled={loading}
                >
                  {loading ? `Wait` : `Submit New Details`}
                </button>
              </div>

              <hr />
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// // user !== null && user._id === pageSeller._id &&
