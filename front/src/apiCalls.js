import axios from "axios";




export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredential);
    res.data["isSeller"]=false

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return res.data;
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    alert("TRY AGAIN")
    return res.data;

  }
};

export const logoutCall = async ( { } , dispatch) => {
  dispatch({ type: "LOGIN_FAILURE" });
  try {
    dispatch({ type: "LOGIN_FAILURE", payload: "Logged out !" });

  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    alert("TRY AGAIN")
  }
};


export const sellerLogin = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login/seller", userCredential);
    res.data["isSeller"]=true

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return res.data;
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    alert("TRY AGAIN")
    return res.data;

  }
};


// reauthenticating after edit of user

export const loginCallAfterEdit = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login/after_edit", userCredential);
    res.data["isSeller"]=false

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return res.data;
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    alert("TRY AGAIN")
  }
};



// reauthenticating after edit of seler

export const sellerLoginAfterEdit = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });
  try {
    // alert("alerting from api calls")
    const res = await axios.post("/auth/login/seller/after_edit", userCredential);
    res.data["isSeller"]=true

    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return res.data;
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    alert("TRY AGAIN")
  }
};
