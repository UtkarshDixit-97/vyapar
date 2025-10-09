import "./topbar.css"
import {React,useContext,useRef,useEffect,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import {logoutCall} from '../../apiCalls'
import axios from 'axios';
import { Storefront,AddShoppingCart} from '@mui/icons-material';






export default function Topbar() {

  const searchquery = useRef();
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const {dispatch} = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const [cart,setCart] = useState({
    product_list:[]
  });
// getting cart item details
useEffect(() => {
  const fetchCart = async () =>{
    const res = await axios.get('/cart/'+user.cart_id)
    setCart(res.data)
  }
  if (user && user.isSeller === false){
    fetchCart();
  }
}, [user])
  
  // console.log(user)


  const profilePicToProfilePage = (e) => {
    e.preventDefault();
    if (user.isSeller){
      navigate('/seller/'+user._id)
    }else{
      navigate('/profile/'+user._id)      
    }
  }

  const handlelogout = () => {

    localStorage.removeItem('user');
    logoutCall({},dispatch)
    navigate('/')
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    navigate(`/search?query=${searchquery.current.value}`)
  }

  const navigateToCart = async() => {
    navigate('/cart/'+user.cart_id)
  }

  const fromTopBarToMarket = (e) => {
    e.preventDefault();
    navigate("/market");
    
  }

  const aboutPageNav = (e) => {
    e.preventDefault();
    navigate("/about");
  }

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/login');
  }

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/register');
  }

  const Profile = (props) => {
  return(
    <>
      <a href="#"  className="nav-item ms-auto badge ">
        <img src={user.profileImage ? `${PF}${user.profileImage}` : ( user.isSeller === true ? `${PF}default_images/default_seller.jpg` :`${PF}default_images/default_buyer.jpg` ) } alt="username" onClick={profilePicToProfilePage} className="userIcon "/>
      </a>

      <button type="button" className="btn btn-danger w-auto h-25" onClick={handlelogout}>Logout</button>
    </>
    )
  }
  const LoginOrRegister = () => {
  return(
    <>
      <li className="nav-item ms-auto">
        <button type="button" className="btn btn-info" onClick={handleLogin}  >Login</button>
      </li>
        <span></span>
      <li className="nav-item ms-auto">
        <button type="button" className="btn btn-dark" onClick={handleSignup} >Signup</button>
      </li>
    </>
    )
  }


    return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-success">
  			<div className="container">
    			<a className="navbar-brand col-sm-2" onClick={() => navigate('/')}>
					Vyapar | व्यापार
    			</a>
    			<form className="d-flex search ol-sm-4" onSubmit={submitHandler} >
        			<input className="form-control me-2 mr-auto" type="search" ref={searchquery} placeholder="Search" aria-label="Search" />
        				<button className="btn btn-warning" type="submit">Search</button>
      			</form>
      		<button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>
    			<div className="collapse navbar-collapse ms-auto col-sm-6" id="navbarSupportedContent">
					  <ul className="navbar-nav ms-auto mr-auto">
                
    				    <li className="nav-item ms-auto">
    				      <a className=" nav-link topbarRightItem" onClick={aboutPageNav} >About</a>
    				    </li>
                <li className="nav-item ms-auto ">
                  <a className=" nav-link topbarRightItem" onClick={fromTopBarToMarket} ><Storefront style={{fontSize: '32px'}}/></a>
                </li>

                {(user && user.isSeller === true) ? 
      				    <li className="nav-item  ms-auto text-right">
      				      <a className="nav-link topbarRightItem"  role="button" data-bs-toggle="" aria-expanded="false" onClick={()=>navigate(`${user._id}/all`)}>
      				        Your Store
      				      </a>
      				    </li>
                  :
                  <span></span>

                }


                {(user && user.isSeller ===false) ? 
                  <li className="nav-item bg-outline-warning ms-auto text-right ">
                    <a className="nav-link "   role="button"  onClick={navigateToCart}>
                      <AddShoppingCart   style={{fontSize: '32px',color:'white'}}/>
                      <span className='rightbarOnline'><p className='cartvalue'>
                      {cart && `${cart.product_list.length}` }

                      </p></span>
                    </a>
                  </li> 
                  :
                  <span></span>
                  
                  }
                
               

               
                <span className="space"></span>
                {/*<LoginOrRegister />*/}
                {user ? 
                  <Profile />
                  :
                  <LoginOrRegister/>

                }

				  </ul>
				</div>

  			</div>
		</nav>

    )
}
