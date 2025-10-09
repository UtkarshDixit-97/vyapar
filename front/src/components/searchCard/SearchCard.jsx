import React from 'react'
import './searchcard.css'
import {useNavigate} from 'react-router-dom'

export default function SearchCard({result}) {
	// console.log("i am in search car")
	// console.log(result)
	const navigate = useNavigate();
	const PF =  import.meta.env.VITE_PUBLIC_FOLDER

	// Showing other images of the product 
	const ExtraImages = ({imgName}) => {
		return(
			<h1>ekjsdfb</h1>
			)
	}
	return (
		<>
		<div className='col-xl-3 col-md-10 align-items-center p-1 hover-search' onClick={()=>navigate('/product/'+result._id)}>
			<img src={`${PF}${result.main_image}`} alt="" className='search-card-image img-fluid align-items-center ' />
		</div>
		<div className='col-xl-1 col-sm-12 align-items-center p-1 hover-search'   onClick={()=>navigate('/product/'+result._id)} >
			{
				result.other_images && result.other_images.map((imgName)=>(
				<img src={`${PF}${imgName}`} alt="" className='extra-image' />

				))
			}
		</div>
		<div className="productInfo container col-xl-6 align-items-center justify-content-center hover-search"  onClick={()=>navigate('/product/'+result._id)}  >
			<div className='text-center fs-3'>
				{result.product_name}
			</div>
			<div className='text-center fs-5 desc'>
				{result.desc}
			</div>
			<div className='text-center fs-5 price'>
				{result.price} ₹ , INR
			</div>
			<div className='d-flex card-extra-details'>
				<div className=" col-xl-6 align-items-end ">
					<div className='text-center fs-5 price '>
						{result.times_bought} : <b>Sold</b>
					</div>
				</div>
				<div className="col-xl-6 float-end align-bottom">
					<div className='text-center fs-5 price  '>
						{result.category} : <b>Categody</b>
					</div>
				</div>
			</div>
			
		</div>
		</>
	)
}
