import {useContext} from 'react';
import {AuthContext} from './context/AuthContext'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";


import Login from './pages/login/Login'
import NotFound from './pages/404/NotFound'
import Home from './pages/home/Home'
import Register from './pages/register/Register'
import About from './pages/about/About'
import UserPage from './pages/userPage/UserPage'
import Cart from './pages/cart/Cart'
import SellerPage from './pages/sellerPage/SellerPage'  
import ProductPage from './pages/productPage/ProductPage'       
import Orders from './pages/orders/Orders'
import AddProduct from './pages/addProduct/AddProduct'
// importing header / nav and footer
import Topbar from './components/topbar/Topbar'
import Footer from './components/footer/Footer'
import Search from './pages/search/Search'
import Category from './pages/category/Category'
import AllProduct from  './pages/allProducts/AllProduct'
import EditProfile from './pages/editProfile/EditProfile'
import Market from './pages/market/Market'



function App() {
    const {user} = useContext(AuthContext)
    // console.log(user)
    return (
      <>
        <Router>
          <Topbar />
            <Routes>
              <Route path='*' element={<NotFound />} />
              <Route path='/' element={<Home/>} exact={true} />
              <Route path='/login' element={user ? <Navigate replace to="/" />: <Login/>} />
              <Route path='/about' element={<About />} />
              <Route path='/add' element={(user && user.isSeller) ? <AddProduct /> : <NotFound/>} />
              <Route path='/market' element={<Market/>} />

              <Route path='/register' element={user ? <Navigate replace to="/" />: <Register/>} />
              <Route path='/seller/:sellerId' element={<SellerPage />} />

              <Route path='/profile/:userId' element={ <UserPage/>} exact={true}/>
              <Route path='/search' element={<Search/>} exact={true}/>
              <Route path='/orders' element={user ? <Orders/> : <NotFound/> } exact={true}/>
              <Route path='/product/:productId' element={<ProductPage/>} exact={true}/>
              <Route path='/category' element={<Category/>} />
              <Route path='/:sellerId/all' element={<AllProduct/>} exact={true}/>
              <Route path='/cart/:cartId' element={(user) ? <Cart/> : <NotFound/>} exact={true}/>
              <Route path='/edit/:userId' element={(user) ? <EditProfile/> : <NotFound/>} exact={true}/>
            </Routes>


          <Footer />
        </Router>
      </>
    );
}

export default App;
