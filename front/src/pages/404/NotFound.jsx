import React from 'react'
import './notfound.css'

export default function NotFound() {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER

	return (
		<div className="contanier text-center m-2 p-2 flex">
			<h2 className='m-2 border border-5 bg-white text-danger border-danger'>Page Not found</h2>
			<h1 className='align-start lost-text2 text-white'>You Will Always Be Lost</h1>
			<div className="row p-5 mx-5 error-image img-fluid align-start ">
				<h1 className='align-start lost-text text-white'>You Will Always Be Lost</h1>
				
			</div>
		</div>
	)
}
