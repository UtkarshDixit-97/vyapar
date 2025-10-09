const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema({
	username:{
		type:String,
		require: true,
		min: 3,
		max: 25,
	},
	product_id:{
		type:String,
		require: true
	},
	user_id:{
		type:String,
		require: true
	},
	image:{
		type:String,
		default: ''
	},
	title:{
		type:String,
		max:100,
		min:1,
		require:true
	},
	desc:{
		type:String,
		max:500
	},
	seller_id:{
		type:String,
		require:true
	}
},
{ timestamps:true }
);


module.exports = mongoose.model("Review",ReviewSchema)
