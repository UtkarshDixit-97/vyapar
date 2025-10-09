import { React, useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import OrderCard from "../../components/orderCard/OrderCard";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user.isSeller == false) {
      const fetchUserOrders = async () => {
        const res = await axios.get("/order/user/" + user._id);
        setOrders(res.data);
      };
      fetchUserOrders();
    } else {
      const fetchSellerOrders = async () => {
        const res = await axios.get("/order?sellerId=" + user._id);
        console.log("going to print orders");
        setOrders(res.data);
        // console.log(orders)
      };
      fetchSellerOrders();
    }
  }, []);
  // console.log(user)
  return (
    <div className="container">
      <div className="row text-center justify-content-center">
        <h3 className="border bg-success bg-opacity-73 border-dark mt-2 text-white">
          All Orders
        </h3>
      </div>
      <div className=" text-center  justify-content-center">
        <div className="row">
          {orders.map((order) => (
            <>
              <div className="col-xl-3 my-2 col-md-4 col-sm-12">
                <OrderCard key={order._id} order={order} />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
