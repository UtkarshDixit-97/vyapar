const mongoose = require('mongoose')
const SellerSchema = new mongoose.Schema({
	sellerName:{
		type:String,
		require: true,
		min: 3,
		max: 25,
	},
	email:{
		type:String,
		require: true,
		max: 25,
		unique: true
	},
	password:{
		type:String,
		require: true,
		min: 5,
		max: 25
	},
	profileImage:{
		type:String,
		default: ""
	},
	productSelling:{
		type:Array,
		default: []
	},
	address:{
		type:String,
		max:50,
		require:true
	},
	city:{
		type:String,
		max:20,
		require:true
	},
	state:{
		type:String,
		require:true,
		max: 20
	},
	phoneNumber:{
		type:Number,
		require:true
	},
	totalItemsSold:{
		type:Number,
		default:0
	}
},
{ timestamps:true }
);


module.exports = mongoose.model("Seller",SellerSchema)
