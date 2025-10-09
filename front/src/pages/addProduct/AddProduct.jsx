import "./addproduct.css";
import { React, useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { PermMedia, Cancel } from "@material-ui/icons";

export default function AddProduct() {
  // const {user} = useContext(AuthContext);
  const PF = import.meta.env.VITE_PUBLIC_FOLDER
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const productName = useRef();
  const productDesc = useRef();
  const price = useRef();
  const [category, setCategory] = useState("");

  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCategory("others");
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    console.log(category);
    setLoading(true);
    const product = {
      product_name: productName.current.value,
      desc: productDesc.current.value,
      price: price.current.value,
      sellerId: user._id,
      other_images: [],
      category: category,
    };
    if (mainImage) {
      const productMainImageName = Date.now() + mainImage.name;
      const data = new FormData();
      await data.append("name", productMainImageName);
      await data.append("file", mainImage);
      product.main_image = productMainImageName;
      try {
        await axios.post("/upload/single", data);
      } catch (err) {
        // setRegistering(false)
        console.log(err);
        setLoading(false);
        alert("main image Upload failed");
        return;
      }
    }
    const uploadOtherImages = async () => {
      const massUpload = otherImages.map((other_image) => {
        const otherImageName = Date.now() + other_image.name;
        const other = new FormData();
        other.append("name", otherImageName);
        other.append("file", other_image);
        product.other_images.push(otherImageName);
        try {
          axios.post("/upload/single", other);
        } catch (err) {
          // setRegistering(false)
          console.log(err);
          setLoading(false);
          alert("one of the other Images of product failed to Upload ");
          return;
        }
      });
      const massUploadPromise = await Promise.all(massUpload);
    };
    // UPLOADING OTHER IMAGES ASYNCHRONOUSLY LIKE POST METHOD OF VYAVHAR APP
    uploadOtherImages();
    // Try and Catch Bloack for now finally pushing the product after image uploading
    try {
      const res = await axios.post("/product", product);
      navigate("/product/" + res.data._id);
      setLoading(true);
    } catch (err) {
      console.log(err);
      alert("product upload failed");
      setLoading(true);
    }
  };

  // console.log(otherImages)
  const changeCatgory = (e) => {
    // e.preventDefault();
    setCategory(e.target.value);
    // console.log(e.target.value)
    // console.log(category);
  };

  const handleOtherImages = async (e) => {
    e.preventDefault();
    // console.log()
    if (e.target.files.length > 5) {
      setOtherImages([]);
      window.alert("You can only select 5 Images");
    } else {
      setOtherImages(Array.from(e.target.files));
    }
    // console.log(otherImages)
  };

  return (
    <div className="container ms-auto border border-3 border-white bg-success bg-opacity-75 justify-content-center my-3">
      <form
        class="row g-3 justify-content-center"
        onSubmit={submitProduct}
        className="my-2 container"
      >
        {/*first row*/}
        <div className="row my-4 py-1 bg-dark bg-opacity-75 justify-content-center text-white border border-4">
          <label
            htmlFor="file"
            className="shareOption shareOptionText  d-flex justify-content-center"
          >
            <PermMedia htmlColor="white" className="shareIcon" />
            <span className="shareOptionText text-center text-light ">
              Main Image
            </span>
            <input
              style={{ display: "none" }}
              required
              type="file"
              id="file"
              acceptable=".png,.jpeg,.jpg,.webp"
              onChange={(e) => setMainImage(e.target.files[0])}
            />
          </label>
          {mainImage && (
            <div className="col-xl-10 col-md-8 col-sm-6 justify-content-center text-center">
              <img
                className="shareImg img-fluid"
                src={URL.createObjectURL(mainImage)}
                alt=""
              />
              <Cancel
                htmlColor="red"
                className="profile-image-cancel shareOptionText text-center text-light "
                onClick={() => setMainImage(null)}
              />
            </div>
          )}
        </div>

        {/*Othe images*/}
        <div className="row my-3 justify-content-center text-white border border-4">
          <label
            htmlFor="file"
            className=" my-2  d-flex justify-content-center mx-1 "
          >
            <span className="text-center text-light px-5">Other Images</span>
            <input
              multiple
              type="file"
              className="px-5"
              id="file"
              acceptable=".png,.jpeg,.jpg,.webp"
              onChange={handleOtherImages}
            />
          </label>
          {otherImages.length > 0 && (
            <>
              {otherImages.map((other_image) => (
                <div className="col-xl-3 col-md-3 col-sm-4 justify-content-center text-center">
                  <img
                    className="other-image-sing img-fluid"
                    src={URL.createObjectURL(other_image)}
                    alt=""
                  />
                  <Cancel
                    htmlColor="red"
                    className="profile-image-cancel shareOptionText text-center text-light "
                  />
                </div>
              ))}
            </>
          )}
        </div>

        {/*Third row*/}

        <div className="row justify-content-center ">
          <div class="col-md-3  bg-success p-3 text-white border border-end-0 border-start-0">
            <label class="form-label">Item Name</label>
            <input
              class="form-control border border-3 border-warning "
              ref={productName}
              required
              id="inputEmail4"
            />
          </div>
          <div class="col-md-3 bg-success p-3 text-white border border-end-0 border-start-0">
            <label class="form-label ">Price INR</label>
            <input
              className="form-control border border-3 border-warning "
              type="number"
              ref={price}
              placeholder="Please Enter Only Dights"
              required
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                  alert("Only accepts Numbers");
                }
              }}
            />
          </div>
          <div class="col-md-3 bg-success p-3 text-white border border-end-0 border-start-0">
            <label for="inputState" class="form-label">
              Category
            </label>
            <select
              id="inputState"
              class="form-select border border-3 border-warning "
              onChange={changeCatgory}
            >
              <option value="others">others</option>
              <option value="sports">sports</option>
              <option value="food">food</option>
              <option value="tech">tech</option>
              <option value="outdoors">outdoors</option>
              <option value="cloths">cloths</option>
            </select>
          </div>
        </div>
        <div class="row my-2 text-center text-white justify-content-center">
          <label class="form-label">Description</label>
          <textarea
            class="border border-3 border-warning  col-xl-7"
            id="inputAddress2"
            ref={productDesc}
            placeholder="Type Description of product"
          />
        </div>

        <div class="row col-xl-4 text-center mx-auto">
          <button
            type="submit"
            class="btn-primary btn-large my-3  text-center "
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
