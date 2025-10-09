import { React, useState, useRef, useContext } from "react";
import "./register.css";
import { PermMedia, Cancel } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { loginCall, sellerLogin } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Register() {
  const [sellerProfile, setSellerProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const [registering, setRegistering] = useState(false);
  // const [sellerRegLoading,setSellerRegLoading] = useState();

  const navigate = useNavigate();

  const username = useRef();
  const userEmail = useRef();
  const userPassword = useRef();
  const userAddress = useRef();
  const userCity = useRef();
  const userState = useRef();
  const userPhone = useRef();

  const sellername = useRef();
  const sellerEmail = useRef();
  const sellerPassword = useRef();
  const sellerAddress = useRef();
  const sellerCity = useRef();
  const sellerState = useRef();
  const sellerPhone = useRef();

  const registerSeller = async (e) => {
    e.preventDefault();
    await setRegistering(true);
    const seller = {
      sellerName: sellername.current.value,
      email: sellerEmail.current.value,
      password: sellerPassword.current.value,
      address: sellerAddress.current.value,
      city: sellerCity.current.value,
      state: sellerState.current.value,
      phoneNumber: sellerPhone.current.value,
    };
    // uploading IMage
    if (sellerProfile) {
      const sellerProfileFileName = Date.now() + sellerProfile.name;
      const data = new FormData();
      await data.append("name", sellerProfileFileName);
      await data.append("file", sellerProfile);
      seller.profileImage = sellerProfileFileName;
      try {
        await axios.post("/upload/single", data);
      } catch (e) {
        // setRegistering(false)
        console.log(e);
        setRegistering(false);
      }
    }
    // console.log(seller.profileImage)
    try {
      const res = await axios.post("/seller/register", seller);
      await sellerLogin(
        {
          email: sellerEmail.current.value,
          password: sellerPassword.current.value,
        },
        dispatch,
      );
      await setRegistering(false);
      window.location.reload();
    } catch (e) {
      console.log(e);
      setRegistering(false);

      prompt("Register Failed for seller");
    }
  };

  const userRegister = async (e) => {
    e.preventDefault();
    await setRegistering(true);
    const user = {
      username: username.current.value,
      email: userEmail.current.value,
      password: userPassword.current.value,
      address: userAddress.current.value,
      city: userCity.current.value,
      state: userState.current.value,
      phoneNumber: userPhone.current.value,
    };
    // uploading IMage
    if (userProfile) {
      const userProfileFileName = (await Date.now()) + userProfile.name;
      const data = await new FormData();
      await data.append("name", userProfileFileName);
      await data.append("file", userProfile);
      user.profileImage = userProfileFileName;
      try {
        await axios.post("/upload/single", data);
      } catch (e) {
        setRegistering(false);
        console.log(e);
      }
    }
    try {
      const res = await axios.post("/user/register", user);
      const cartData = await {
        username: res.data.username,
        user_id: res.data._id,
      };
      const saveCart = await axios.post("/cart/create", cartData);
      const addingCartToUser = await axios.put("/user/" + res.data._id, {
        cart_id: saveCart.data._id,
      });
      await loginCall(
        {
          email: userEmail.current.value,
          password: userPassword.current.value,
        },
        dispatch,
      );
      await setRegistering(false);
      await window.location.reload();
    } catch (e) {
      console.log(e);
      alert("Register Failed");
      setRegistering(false);
    }
    // console.log("sdg")
  };

  const handleLoginButtonClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  // console.log(userProfile)
  return (
    <>
      {/*user Registration*/}

      <section className="h-100">
        <div className="container h-100 p-2">
          <div className="d-flex justify-content-between h-100">
            <div className="col-xxl-6 col-xl-5 col-lg-5 col-md-7 col-sm-9 justify-content-start">
              <div className="card-fluid bg-success shadow-lg">
                <div className="card-body p-5">
                  <h1 className="fs-4 card-title fw-bold mb-4 text-white">
                    Register
                  </h1>
                  <form className="needs-validation" onSubmit={userRegister}>
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
                        onChange={(e) => setUserProfile(e.target.files[0])}
                      />
                    </label>
                    {userProfile && (
                      <div className="shareImgContainer">
                        <img
                          className="shareImg img-fluid"
                          src={URL.createObjectURL(userProfile)}
                          alt=""
                        />
                        <Cancel
                          className="shareCancelImg"
                          onClick={() => setUserProfile(null)}
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="mb-2 text-white">Name</label>
                      <input
                        id="name"
                        type="text"
                        ref={username}
                        className="form-control"
                        name="name"
                        placeholder="Please Type Full Name"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 text-white">
                        E-Mail Address ( Required )
                      </label>
                      <input
                        id="email"
                        type="email"
                        ref={userEmail}
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="mb-2 text-white">Password</label>
                      <input
                        id="password"
                        type="password"
                        ref={userPassword}
                        className="form-control"
                        name="password"
                        placeholder=" Type Password"
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
                        ref={userPhone}
                        placeholder="Please Enter Only Dights"
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
                      <div className="mb-2 w-100">
                        <label className="text-light" type="password">
                          Address
                        </label>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Address"
                        required
                        ref={userAddress}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="mb-2 w-100">
                        <label className="text-light">City (Required)</label>
                      </div>
                      <input
                        className="form-control"
                        ref={userCity}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="mb-2 w-100">
                        <label className="text-light">State (Required)</label>
                      </div>
                      <input
                        className="form-control"
                        ref={userState}
                        placeholder="State"
                        required
                      />
                    </div>
                    <p className="form-text text-white mb-3">
                      By registering you agree with our terms and condition.
                    </p>

                    <div className="align-items-center d-flex">
                      <button
                        type="submit"
                        className="btn btn-primary ms-auto"
                        disabled={registering}
                      >
                        {registering ? "Loading" : "Register"}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="card-footer py-3 border-0">
                  <div className="text-center text-white">
                    Already have an account?{" "}
                    <a
                      className="text-white btn-success btn btn-outline-warning"
                      onClick={handleLoginButtonClick}
                    >
                      Login
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/*seperator*/}
            <div className="col-xl-1 col-xxl-1 justify-content-center align-bottom vl  "></div>
            <div className="col-xl-4 col-sm-12 col-md-3 col-lg-4 d-flex-end card-fluid justify-content-center align-items-middle ml-5 register ">
              <div className=" bg-dark align-middle justify-content-center ms-auto border border-white rounded-2  align-items-center">
                <img
                  src="/register_seller_pic.webp"
                  className="img-fluid"
                  alt="..."
                />
                <div className="card-body row text-center">
                  <h5 className="text-white text-center ">
                    Join us And Sell Togethor
                  </h5>
                  <button
                    className="btn btn-info  align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*registering Sellers*/}
      <div id="exampleModal" className="modal fade" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content bg-success">
            <div className="modal-header">
              <h5 className="modal-title text-light">Register as Seller</h5>
              <button
                type="button"
                className="btn-close btn-outline-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form className="needs-validation p-3" onSubmit={registerSeller}>
              <label
                htmlFor="selerfile"
                className="shareOption shareOptionText  d-flex justify-content-center"
                onChange={(e) => setSellerProfile(e.target.files[0])}
              >
                <PermMedia htmlColor="white" className="" />
                <span className=" text-center text-light ">
                  Profile Photo of Seller
                </span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="selerfile"
                  acceptable=".png,.jpeg,.jpg,.gif"
                />
              </label>
              {sellerProfile && (
                <div className="shareImgContainer text-center">
                  <img
                    className=" img-fluid"
                    src={URL.createObjectURL(sellerProfile)}
                    alt=""
                  />
                  <Cancel
                    className="shareCancelImg "
                    onClick={() => setSellerProfile(null)}
                  />
                </div>
              )}
              <div className="mb-3">
                <label className="mb-2 text-light">Full Name</label>
                <input
                  id="email"
                  className="form-control"
                  ref={sellername}
                  required
                  autoFocus
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
                  ref={sellerEmail}
                  className="form-control"
                  name="email"
                  required
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light" type="password">
                    Password (Required)
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  ref={sellerPassword}
                  className="form-control"
                  name="password"
                  required
                />
              </div>

              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light">Address (Required)</label>
                </div>
                <input className="form-control" ref={sellerAddress} required />
              </div>
              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light">City (Required)</label>
                </div>
                <input className="form-control" ref={sellerCity} required />
              </div>
              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light">State (Required)</label>
                </div>
                <input className="form-control" ref={sellerState} required />
              </div>

              <div className="d-flex align-items-center justify-content-center">
                <button
                  type="sumbit"
                  className=" p-2 px-5  text-white  loginbtn "
                >
                  {registering ? "Loading" : "Register As Seller"}
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
