import { React, useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CartCard({ item, passIdToCartPage, cart_id }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const [deleteRequest, setDeleteRequest] = useState(false)
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    // fetch card data
    const fetchCartProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/product/" + item);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.log("ig")
      }
    }

    fetchCartProduct();
  }, [])

  const deleteCartItem = async () => {
    setDeleteRequest(true)
    await axios.put('cart/add', { cart_id: cart_id, product_id: item })
    setDeleteRequest(false)
    window.location.reload();
  }
  console.log(product);
  return (
    <>
      {(product) ?
        <>
          <div class="card my-1 mx-1 text-center" >
            {loading ?
              'Loading' :
              <img src={`${PF}${product.main_image}`} class="card-img-top" alt="..." onClick={() => passIdToCartPage(item)} />
            }
            <div class="card-body">
              <h5 class="card-title">
                {loading ?
                  'Loading' :
                  product.product_name
                }

              </h5>
              <hr />
              <button className='btn btn-danger text-white text-center py-2' disabled={deleteRequest} onClick={deleteCartItem} >
                {deleteRequest ?
                  "Deleting . . ."
                  :
                  'Remove'
                }

              </button>

            </div>
          </div>
        </>
        :
        <div class="card my-1 mx-1 text-center" >
          <h2 className='text-center text-danger'>product deleted</h2>

        </div>

      }
    </>
  )
}
