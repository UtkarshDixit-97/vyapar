import { React, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./userpage.css";
import Review from "../../components/review/Review";
import { logoutCall } from "../../apiCalls";

export default function UserPage() {
  const { user, dispatch } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const [pageUser, setPageUser] = useState({});
  const userId = useParams().userId;
  const [reviews, setReviews] = useState([]);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const navigate = useNavigate();

  const [deleteRequest, setDeleteRequest] = useState(false);

  // console.log(userId,user )
  useEffect(() => {
    const fetchPageUser = async () => {
      try {
        const res = await axios.get("/user/profile?userId=" + userId);
        setPageUser(res.data);
      } catch (err) {
        navigate("*");
      }
      // console.log("/user?username="+username)
      // console.log(res.data)
      // console.log(pageUser)
    };
    const fetchPageUserReviews = async () => {
      const rev = await axios.get("/review/user/" + userId);
      setReviews(rev.data);
      await setFetchingReviews(false);
    };

    fetchPageUser();

    fetchPageUserReviews();
  }, []);
  // console.log(user)

  const handleEditPageRequest = (e) => {
    e.preventDefault();
    navigate("/edit/" + user._id);
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    let a = window.confirm("You sure , you want to delete account");
    if (a) {
      setDeleteRequest(true);
      await axios.delete("/cart/" + user.cart_id);
      await axios.delete("/user/" + userId);
      // alert("Done!");
      // localStorage.removeItem('user');
      logoutCall({}, dispatch);
      navigate("/");
    }
  };

  // Account edit buttons
  const EditDetails = () => {
    return (
      <>
        <button
          className="btn btn-warning mb-2"
          onClick={handleEditPageRequest}
        >
          Edit Account
        </button>
        <button
          className="btn btn-danger"
          disabled={deleteRequest}
          onClick={deleteAccount}
        >
          {deleteRequest ? `Deleting...` : "Delete Account"}
        </button>
      </>
    );
  };

  return (
    <div className="container  align-content-center">
      <div className="row mx-auto p-3 justify-content-center">
        <div className="col-xl-4 col-md-8 col-sm-8">
          <img
            src={
              pageUser.profileImage
                ? `${PF}${pageUser.profileImage}`
                : `${PF}default_images/default_buyer.jpg`
            }
            alt=""
            className="img-fluid img-user"
          />
        </div>
        <div className="col-xl-7 col-md-12 col-sm-8 ">
          <div
            className="flex text-center text-white border border-warning border-5 fs-3 bg-success
bg-opacity-75"
          >
            {pageUser.username}
          </div>
          <div className="container bg-light bg-opacity-75 border border-4 border-warning justify-content-around">
            <div className="row d-flex justify-content-around">
              <div className="col-sm-2 fs-3">
                <label className="btn">City</label>
                {pageUser.city}
              </div>
              <div className="col-sm-2 fs-3">
                <label className="btn">State</label>
                {pageUser.state}
              </div>
            </div>
            <hr />
            {user._id === userId && (
              <div className=" flex-end fs-3 d-flex">
                <label className="btn">Address</label>
                {pageUser.address}
              </div>
            )}
          </div>
          <div className="row justify-content-center fs-3 border border-4 border-secondary text-center bg-success bg-opacity-75 mt-3 text-white">
            This User has bought{" "}
            {pageUser.userBought && pageUser.userBought.length} items.
          </div>
        </div>
        <div className="col-xl-1 col-md-3 col-sm-8 ">
          {user && user._id === userId && (
            <>
              <EditDetails />
              <div className="container justify-content-between pt-5">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/orders")}
                >
                  All Order
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <span className="divider row"> </span>
      <section className="container">
        {fetchingReviews ? (
          <div className="container text-white fs-1 text-center bg-warning">
            Loading...
          </div>
        ) : (
          <div className="container text-white fs-2 text-center bg-warning mb-3">
            Recent Reviews
          </div>
        )}
        <div className="container ">
          {reviews.length > 0 &&
            reviews.map((review) => <Review key={review.id} review={review} />)}
        </div>
      </section>
    </div>
  );
}

// user !== null && user._id === pageUser._id &&
