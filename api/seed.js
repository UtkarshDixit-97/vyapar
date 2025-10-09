require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")


// Models
const User = require("./models/User");
const Seller = require("./models/Seller");
const Product = require("./models/Product");
const Review = require("./models/Review");

async function seedDB() {
  await mongoose.connect(process.env.DB_URL , {useNewUrlParser : true , useUnifiedTopology : true})
  .then(() => console.log('Mongo connection established to Vyapar App'))
  .catch((err) => console.log(err))
  try {
    console.log("MongoDB connected");


    await Promise.all([
      User.deleteMany(),
      Seller.deleteMany(),
      Product.deleteMany(),
      Review.deleteMany()
    ]);


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123",salt)

    const users = await User.insertMany([
      {
        username: "alice",
        email: "alice@test.com",
        password: hashedPassword,
        address: "Street 1",
        city: "Mumbai",
        state: "MH",
        phoneNumber: 9999999991
      },
      {
        username: "bob",
        email: "bob@test.com",
        password: hashedPassword,
        address: "Street 2",
        city: "Delhi",
        state: "DL",
        phoneNumber: 9999999992
      }
    ]);


    const seller = await Seller.create({
      sellerName: "TechStore",
      email: "seller@test.com",
      password: hashedPassword,
      address: "Seller Street",
      city: "Bangalore",
      state: "KA",
      phoneNumber: 8888888888
    });


    const categories = ["electronics", "clothing", "books"];
    const products = [];
    const catrgoryList = [
        "others",
        "sports",
        "tech",
        "food",
        "outdoor",
        "cloths",
      ];
    for (const category of categories) {
      for (let i = 1; i <= 3; i++) {
        products.push({
          title: `${category} product ${i}`,
          desc: `High quality ${category} item ${i}`,
          price: 100 * i,
          main_image: "product_default.webp",
          category: catrgoryList[i],
          other_images: ['product1.webp', 'product2.jpg', 'product3.png'],
          sellerId: seller._id.toString(),
          stock: 10
        });
      }
    }

    const savedProducts = await Product.insertMany(products);


    const reviews = [];

    for (const product of savedProducts) {
      users.forEach((user, index) => {
        reviews.push({
          username: user.username,
          product_id: product._id.toString(),
          user_id: user._id.toString(),
          sellerId: seller._id.toString(),
          title: `Review ${index + 1}`,
          desc: `This is a review for ${product.title}`,
          image: "product_default.webp"
        });
      });

      // 3rd review (repeat first user)
      reviews.push({
        username: users[0].username,
        product_id: product._id.toString(),
        user_id: users[0]._id.toString(),
        sellerId: seller._id.toString(),
        title: "Extra Review",
        desc: "Worth the price!",
        image: "product_default.webp"
      });
    }

    await Review.insertMany(reviews);

    console.log("Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();
