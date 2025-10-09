import './homerecentcard.css'
import React from 'react'
import axios from 'axios'
// import {useNavigate,useParams} from "react-router-dom";
// import {Link,useNavigate} from 'react-router-dom'


export default function homeRecentCard({product,passIdToHome}) {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER

	return (
		<div className="card mx-1 border-danger justify-content-center card-market" onClick={()=>passIdToHome(product._id)} >
					    <img className="card-img-top img-fluid" src={`${PF}${product.main_image}`} alt="Card image cap" />
					    <div className="card-body bg-dark">
					      <h5 className="card-title text-light text-center">{product.product_name}</h5>
					      
					    </div>
					    <div className="card-footer bg-secondary justify-content-between">
					      <span className=" text-light">Price : {product.price}</span>
					      <span className=" text-light"> | </span>
					      <span className=" text-light">Sold : {product.times_bought}</span>
					    </div>
					  </div>
	)
}
