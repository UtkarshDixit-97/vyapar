import { React, useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { PermMedia, Cancel } from "@material-ui/icons";
import { loginCallAfterEdit, sellerLoginAfterEdit } from "../../apiCalls";

export default function EditProfile() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const [pageUser, setPageUser] = useState({});
  const userId = useParams().userId;
  const navigate = useNavigate();
  const [deleteImageLoading, setDeleteImageLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // useRef form field
  const username = useRef(pageUser.username);
  const userEmail = useRef(pageUser.email);
  const userPhone = useRef(pageUser.phoneNumber);
  const userCity = useRef(pageUser.city);
  const userState = useRef(pageUser.state);
  const userAddress = useRef(pageUser.address);

  const userPageId = useParams().userId;

  const deleteImage = async (e) => {
    e.preventDefault();
    setDeleteImageLoading(true);
    try {
      const confirmation = await window.confirm(
        "Are Ya sure, this will delete you profile Image",
      );
      if (confirmation) {
        await axios.post("/upload/delete/", {
          filename: pageUser.profileImage,
        });
        await axios.put("/user/" + user._id, { profileImage: "" });
        setDeleteImageLoading(false);
        window.location.reload();
      } else {
        setDeleteImageLoading(false);
      }
    } catch (e) {
      setDeleteImageLoading(false);
      alert(e);
    }
  };

  const uploadNewImage = async (e) => {
    e.preventDefault();
    setDeleteImageLoading(true);
    try {
      const confirmation = await window.confirm(
        "Are Ya sure, this will delete your Current Profile and set a new one",
      );
      if (confirmation) {
        const filename = (await Date.now()) + e.target.files[0].name;
        const data = new FormData();
        data.append("name", filename);
        data.append("file", e.target.files[0]);
        // await axios.post('/upload/delete/',{filename:pageUser.profileImage});
        await axios.post("/upload/single", data);
        await axios.put("/user/" + user._id, { profileImage: filename });
        setDeleteImageLoading(false);
        window.location.reload();
      }
    } catch (err) {
      setDeleteImageLoading(false);
      alert(err);
    }
  };

  // console.log(localStorage)
  const userEdit = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      const confirmation = await window.confirm(
        "Are Ya sure,Pres OK to confirm ",
      );
      if (confirmation) {
        const res = await axios.put("/user/" + user._id, {
          username: username.current.value,
          email: userEmail.current.value,
          phoneNumber: userPhone.current.value,
          city: userCity.current.value,
          state: userState.current.value,
          address: userAddress.current.value,
        });
        await setEditing(true);
        try {
          await loginCallAfterEdit(
            { email: res.data.email, password: user.password },
            dispatch,
          );
        } catch (e) {
          setEditing(false);
          alert("TRY AGAIN");
        }
        alert("All The information has been updated ");
      } else {
        await setEditing(false);
      }
    } catch (err) {
      setEditing(false);
      alert(err);
    }
  };

  useEffect(() => {
    if (userId !== user._id) {
      navigate("*");
    }
    const fetchPageUser = async () => {
      const res = await axios.get("/user/profile?userId=" + userId);
      await setPageUser(res.data);
    };
    fetchPageUser();
  }, []);

  return (
    <section className="h-100">
      <div className="container h-100 p-2">
        <div className="d-flex justify-content-between h-100">
          <div className="col-xxl-6 col-xl-5 col-lg-5 col-md-7 col-sm-9 justify-content-start">
            <div className="card-fluid bg-success shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4 text-white">
                  Edit the Personal Info
                </h1>
                <form className="needs-validation" onSubmit={userEdit}>
                  {pageUser.profileImage ? (
                    <span></span>
                  ) : (
                    <>
                      <label
                        htmlFor="file"
                        className="shareOption shareOptionText  d-flex justify-content-center"
                      >
                        <PermMedia htmlColor="white" className="shareIcon" />
                        <span className="shareOptionText text-center text-light ">
                          Change Profile Image
                        </span>
                        <input
                          style={{ display: "none" }}
                          type="file"
                          id="file"
                          acceptable=".png,.jpeg,.jpg,.gif,.webp"
                          onChange={uploadNewImage}
                        />
                      </label>
                    </>
                  )}
                  {deleteImageLoading === false && pageUser.profileImage ? (
                    <div className="shareImgContainer">
                      <img
                        className="shareImg img-fluid"
                        src={`${PF}${pageUser.profileImage}`}
                        alt=""
                      />
                      <Cancel
                        className="shareCancelImg"
                        onClick={deleteImage}
                      />
                    </div>
                  ) : pageUser.profileImage === "" ? (
                    <h5 className="text-white">
                      There Are No Images For This User
                    </h5>
                  ) : (
                    <div className="card-title">Deleting Image...</div>
                  )}

                  <div className="mb-3">
                    <label className="mb-2 text-white">Name</label>
                    <input
                      id="name"
                      type="text"
                      defaultValue={pageUser.username}
                      ref={username}
                      className="form-control"
                      name="name"
                      placeholder="Please Type Full Name"
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
                      defaultValue={pageUser.email}
                      className="form-control"
                      placeholder="Email"
                      name="email"
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
                      defaultValue={pageUser.phoneNumber}
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
                      required="true"
                      placeholder="Address"
                      defaultValue={pageUser.address}
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
                      defaultValue={pageUser.city}
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
                      defaultValue={pageUser.state}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div className="align-items-center d-flex">
                    <button type="submit" className="btn btn-primary ms-auto">
                      {editing ? "Loading" : "Edit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/*seperator*/}
        </div>
      </div>
    </section>
  );
}
