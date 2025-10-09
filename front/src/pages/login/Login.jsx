import './login.css'

import { useRef, useContext, useState } from 'react'

import { loginCall, logoutCall, sellerLogin } from '../../apiCalls'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'


export default function Login() {
  const [isLogging, setIsLogging] = useState(false);
  const email = useRef();
  const password = useRef();
  const sellerEmail = useRef();
  const sellerPassword = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext)
  const navigate = useNavigate();
  const loginUser = async (e) => {
    setIsLogging(true)
    e.preventDefault();
    try {
      await loginCall({ email: email.current.value, password: password.current.value }, dispatch)
      // navigate('/');

      window.location.reload()
    } catch (e) {
      setIsLogging(false)

    }
  };

  const clicked = () => {
    console.log('hj')
  }

  const loginSeller = (e) => {
    e.preventDefault();
    setIsLogging(true);

    sellerLogin(
      {
        email: sellerEmail.current.value,
        password: sellerPassword.current.value,
      },
      dispatch
    )
    .then((data) => {
      setIsLogging(false);
      window.location.reload();
      // navigate('/');
    })
    .catch((e) => {

      setIsLogging(false);

    });
  };

  return (
    <>
      <div className='mt-5'>
        <section className="h-100">
          <div className="container h-100">
            <div className="row justify-content-sm-center h-100">
              <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9 ">
                <div className="card-fluid shadow-lg bg-success">
                  <div className="card-body p-5">
                    <h1 className="fs-4 card-title fw-bold mb-4 text-light">Login</h1>
                    <form className="needs-validation" onSubmit={loginUser} >
                      <div className="mb-3">
                        <label className="mb-2 text-light" type="email">E-Mail Address</label>
                        <input id="email" type="email" className="form-control" ref={email} name="email" required autoFocus />
                        <div className="invalid-feedback">
                          Email is invalid
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="mb-2 w-100">
                          <label className="text-light" type="password">Password</label>

                        </div>
                        <input id="password" type="password" className="form-control" ref={password} name="password" required />
                        <div className="invalid-feedback">
                          Password is required
                        </div>
                      </div>
                      <a onClick={loginUser}>
                        <div className="d-flex align-items-center justify-content-center loginbtn">
                          <button type="submit" className="btn  text-white ">
                            {isLogging ? 'Loading . . .' : 'Login'}
                          </button>
                        </div>
                      </a>
                      <hr />
                      <a data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <div className="d-flex align-items-center justify-content-center loginbtn">
                          <button className="btn  text-white ">
                            Login As Seller
                          </button>
                        </div>
                      </a>
                    </form>
                  </div>
                  <div className="card-footer py-3 border-0">
                    <div className="text-center text-light" >
                      Don't have an account? <b className="text-light onHover" onClick={() => navigate('/register')} ><u>Create One</u></b>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
      <div id="exampleModal" className="modal fade" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content bg-success">
            <div className="modal-header">
              <h5 className="modal-title text-light">Login as Seller</h5>
              <button type="button" className="btn-close btn-outline-danger" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form className="needs-validation p-3" onSubmit={loginSeller}>
              <div className="mb-3">
                <label className="mb-2 text-light" type="email">E-Mail Address</label>
                <input id="email" type="email" className="form-control" name="email" ref={sellerEmail} required autoFocus />

              </div>

              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-light" type="password">Password</label>

                </div>
                <input id="password" type="password" className="form-control" name="password" ref={sellerPassword} required />
                <div className="invalid-feedback">
                  Password is required
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-center">
                <button className=" p-2 px-5  text-white  loginbtn ">
                  {isLogging ? 'Loading . . .' : 'Login'}
                </button>
              </div>

              <hr />
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </>
  )
}
