import {useEffect,React,useState,useContext,useRef} from 'react'
import './review.css'
import axios from 'axios'

import {AuthContext} from '../../context/AuthContext'

export default function Review({review,index}) {
	const {user} = useContext(AuthContext);
	const newTitle = useRef();
	const newDesc = useRef();
	const [editLoading, setEditLoading] = useState(false);
	const [deleteloading, setDeleteLoading] = useState(false)

	const PF = import.meta.env.VITE_PUBLIC_FOLDER
	const [productName, setProductName] = useState('')
	const [sellerName, setSellerName] = useState('')
	useEffect(() => {
		const fetchProductName = async () =>{
			const res = await axios.get('/product/'+review.product_id)
			await setProductName(res.data.product_name);
			// console.log("productname"+res.product_name+"setting"+productName)
			// console.log(res.data)
		}
		const fetchSellerName = async () => {
			const sel = await axios.get('/seller/profile?userId='+review.seller_id)
			await setSellerName(sel.data.sellerName);	
		}
		fetchProductName();
		fetchSellerName();
	}, [])

	const deleteReview = async(e) =>{
		e.preventDefault();
		let a =	window.confirm("are ya Sure");
		setDeleteLoading(false);
		if (a){
			try{
				await axios.delete('/review/delete/'+review._id);
				window.location.reload();
			}catch(err){
				alert(err);
				setDeleteLoading(false)
			}
		}else{	
			setDeleteLoading(false)
		}
	}
	const EditDetails = () => {
		return(
			<>
				<button className='btn btn-warning mb-2'  data-bs-toggle="modal" data-bs-target="#editReview">Edit</button>
			 	<button className='btn btn-danger' onClick={deleteReview} disabled={deleteloading}>{deleteloading ? "Deleting" : "Delete"}</button>
			</>
			)
	}

	const editTheReview = async(e) => {
		e.preventDefault();
		setEditLoading(true);
		try{
			await axios.put('/review/update/'+review._id,{title:newTitle.current.value,desc:newDesc.current.value});
			alert("Done !")
			setEditLoading(false);
		}catch(err){
			alert(err)
			setEditLoading(false)
		}
	}


	return (
		<div className='row main-card-review  justify-content-center '>
				<div className="col-xl-4 c0l-md-4 col-sm-4 ">
					<img src={`${PF}${review.image}`} alt="" className='img-fluid img-review' data-bs-toggle="modal" data-bs-target={`#reviewImage${index}`} />
				</div>
				<div className='col-xl-6 col-md-6 col-sm-6 text-center '>
					<div className="row overflow-auto bg-dark text-white p-2 m-2 fs-4 ">
						<b>{review.title}</b>
					</div>
					<div className="row desc overflow-auto bg-dark text-white p-2 m-2 fs-4 ">
						<b className='fs-5'>{review.desc}</b>
					</div>
					<div className="d-flex flex  align-bottom justify-content-between">
						<div className=" text-white">
							<b className='text-dark btn btn-secondary border border-danger bg-secondary bg-opacity-25'>For {productName}</b>
						</div>
						<div className="d-flex text-white ">
							<b className='text-dark btn btn-secondary border border-danger  bg-secondary bg-opacity-25'>Sold By :{sellerName}</b>
						</div>
					</div>
				</div>	
				<div className='col-xl-1 col-md-1 col-sm-1 text-center '>
					<div className="row mt-3">
						{(user && user._id === review.user_id) &&
							<EditDetails />
						}
						
						
					</div>
				</div>
{/*Model for edit*/}
<div className="modal fade " id="editReview" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog ">
    <div className="modal-content bg-success">
      <div className="modal-header">
        <h5 className="modal-title text-white" id="staticBackdropLabel">Modal title</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
<form className="needs-validation p-3"  onSubmit={editTheReview} >
    <div className="mb-3">
        <label className="mb-2 text-light" >New Title </label>
            <input className="form-control" required autoFocus ref={newTitle} defaultValue={review.title} />
        </div>
        <div className="mb-3">
          	<label className="mb-2 text-light" type="email">Description (Required)</label>
            	<textarea className="form-control" ref={newDesc} required autoFocus defaultValue={review.desc}></textarea>
			</div>
            <div className="d-flex align-items-center justify-content-center">
              <button type="sumbit" className=" p-2 px-5  text-white  loginbtn " disabled={editLoading} >
                {editLoading ? "Editing..." : "Submit New Edit"}
              </button>
            </div>     
            <hr/>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
</form>
      </div>
    </div>
  </div>
</div>
	 <div class="modal modal-fullscreen  fade mt-5 " id={`reviewImage${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			      	<button type="button" class="btn-close btn-danger text-white btn-modal-product" data-bs-dismiss="modal" aria-label="Close"></button>	
			  <div class="modal-dialog main-image-moadl my-5 mt-5 p-1 row bg-success text-center bg-opacity-75 border border-3 border-warning ">
			       <img src={`${PF}${review.image}`} className="main-image img-fluid mx-auto my-auto" alt="" />
				
			  </div>
			  
			</div>
		</div>
	)
}



// user !== null && user._id === review.user_id




