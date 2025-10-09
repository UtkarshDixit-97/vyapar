import {React,useEffect,useState} from 'react'
import './ordercard.css';
import axios from 'axios';


export default function OrderCard({order}) {
  const [product, setProduct] = useState({})
	const PF = import.meta.env.VITE_PUBLIC_FOLDER

  useEffect(() => {
    const fetchProduct = async() =>{
      try{
        const res = await axios.get('/product/'+order.product_id)
        setProduct(res.data)
      }catch(err){
        alert(err);
        return;
      }
    }  
    fetchProduct();
  }, [])

	return (
    <div class="card fs-5 bg-success border text-white border-warning border-3">
      <img src={`${PF}${product.main_image}`} class="card-img-top img-fluid" alt="..."/>
      <div class="card-body">
        <h5 class="card-title">{order.product_name}</h5>
        <p class="card-text">Buyer : {order.username}</p>
        <p class="card-text">Price : {order.price}</p>
        <p class="card-text">Quantity : {order.quantity}</p>
        <p class="card-text">Order Delievered : {order.order_delievered?<b>Yes</b>:<b>No</b>}</p>
        <p class="card-text">Phone : {order.phone}</p>
        <p class="card-text">City : {order.city}</p>
        <p class="card-text">State : {order.state}</p>
        <p class="card-text">Address : {order.adress}</p>
      </div>
       <div class="card-footer">
        <small class="text-warning">Sold By</small>
        <p>{order.seller_name}</p>
      </div>
    </div>
	)
}
