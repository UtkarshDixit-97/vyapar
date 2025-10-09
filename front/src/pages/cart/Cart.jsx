import { React, useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import CartCard from "../../components/cartCard/CartCard";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const cartId = useParams().cartId;
  const user = {
    username: "utkarsj",
  };
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCartItems = async () => {
      // console.log(cartId)
      const res = await axios.get("/cart/" + cartId);
      setCartItems(res.data.product_list);
      // console.log(res.data)
    };
    fetchCartItems();
  }, []);

  const cartToProductPage = async (id) => {
    // id.preventDefault();
    console.log(id);
    navigate("/product/" + id);
  };
  // console.log(cartItems)
  return (
    <div className="container my-2 p-1 justify-content-center bg-success border border-white border-5">
      <div className="row text-center text-white">
        <h3>{user.username}'s' cart</h3>
      </div>
      <div className="row my-2  border-top border-bottom border-5 border-warning">
        <div class="card-group">
          {cartItems &&
            cartItems.map((item) => (
              <CartCard
                key={item}
                item={item}
                passIdToCartPage={cartToProductPage}
                cart_id={cartId}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
