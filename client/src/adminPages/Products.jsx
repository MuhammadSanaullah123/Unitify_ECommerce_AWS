import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//mui
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

//redux,api
import { addProduct, getProducts, deleteItem } from "../actions/product";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.product);
  const auth = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.admin);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [open, setOpen] = useState(false);
  const [option, setOption] = useState("new");
  const [updateindex, setUpdateIndex] = useState();

  const [values, setValues] = useState({
    producttype: "",
    productname: "",
    productprice: "",
    productquantity: "",
    productdesc: "",
    productimg: "",
  });
  const [productarray, setProductArray] = useState([]);
  const handleInput = (e) => {
    const Value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: Value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "400px",
    background: "#fff",
    borderRadius: "6px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  };
  const onSubmit = (e) => {
    e.stopPropagation();
    setOpen(false);
    if (option === "new") {
      setProductArray([values, ...productarray]);
    } else {
      let temp = [...productarray];
      temp[updateindex] = values;
      setProductArray(temp);
    }
    setValues({
      producttype: "",
      productname: "",
      productprice: "",
      productquantity: "",
      productdesc: "",
      productimg: "",
    });
    setOption("new");
  };
  const handleRemove = (index) => {
    let temp = productarray;
    temp.splice(index, 1);
    setProductArray([...temp]);
  };
  const handleUpdate = (index) => {
    setOption("update");
    setUpdateIndex(index);
    setOpen(true);
    let temp = productarray[index];
    setValues(temp);
    onSubmit();
  };
  const handleAddProduct = () => {
    productarray.forEach((element) => dispatch(addProduct(element)));
    setProductArray([]);
  };

  const handleDelete = (id) => {
    dispatch(deleteItem({ id }));
  };
  useEffect(() => {
    dispatch(getProducts());
  }, [getProducts]);
  /*   useEffect(() => {
    if (isAuthenticated && auth.user && auth.loading === false && admin.admin) {
      for (let i = 0; i < admin.admin.length; i++) {
        if (
          auth.user.email === admin.admin[i].email &&
          auth.user.registeration === admin.admin[i].registeration
        ) {
          navigate("/admin/products");
        } else {
          navigate(-1);
        }
      }
    }
  }, [admin]); */
  return (
    <>
      <div className="Products">
        <h1 className="productsh1">Add Products to Website</h1>
        <div className="productsd1">
          <div onClick={handleOpen} className="productsd2">
            <AddCircleOutlineIcon className="productsd2img" />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="productsmodelbox" sx={style}>
                <FormControl className="boxdropdown" fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="producttype"
                    value={values.producttype}
                    label="Product Type"
                    onChange={handleInput}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <p className="boxdropdownlabel">Product Type</p>
                    </MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Toys">Toys</MenuItem>
                    <MenuItem value="Furniture">Furniture</MenuItem>
                    <MenuItem value="CD">CD</MenuItem>
                    <MenuItem value="CarAccessories">CarAccessories</MenuItem>
                    <MenuItem value="Fashion">Fashion</MenuItem>
                  </Select>
                </FormControl>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Name"
                  name="productname"
                  value={values.productname}
                  onChange={handleInput}
                />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Price"
                  name="productprice"
                  value={values.productprice}
                  onChange={handleInput}
                />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Quantity"
                  name="productquantity"
                  value={values.productquantity}
                  onChange={handleInput}
                />
                <input
                  className="input-field"
                  type="text"
                  placeholder="Image"
                  name="productimg"
                  value={values.productimg}
                  onChange={handleInput}
                />
                <textarea
                  className="text-field"
                  type="text"
                  placeholder="Description..."
                  name="productdesc"
                  value={values.productdesc}
                  onChange={handleInput}
                />
                <button onClick={(e) => onSubmit(e)} className="submitbtn">
                  Submit
                </button>
              </Box>
            </Modal>
          </div>
          {productarray.map((item, index) => (
            <div key={index} className="productsd3">
              <img className="productsd3img" src={item.productimg} alt="" />
              <p className="productsp1">
                <b>Type: </b>
                {item.producttype}
              </p>
              <p className="productsp1">
                <b>Name: </b>
                {item.productname}
              </p>
              <p className="productsp1">
                <b>Price: </b>
                {item.productprice}
              </p>
              <p className="productsp1">
                <b>Quantity: </b>
                {item.productquantity}
              </p>
              <p className="productsp2">
                <b>Description: </b>
                {item.productdesc}
              </p>
              <div className="productsbtndiv">
                <button
                  onClick={() => handleUpdate(index)}
                  className="productsupdatebtn"
                >
                  Update
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="productsdeletebtn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleAddProduct} className="productssubmitbtn">
          Add Products
        </button>
        <h1
          style={{
            marginTop: "20px",
          }}
          className="productsh1"
        >
          Remove Products from Website
        </h1>
        <div className="productsd1">
          {!product.loading &&
            product.products.map((item, index) => (
              <div key={item._id} className="productsd3">
                <img className="productsd3img" src={item.productimg} alt="" />
                <p className="productsp1">
                  <b>Type: </b>
                  {item.producttype}
                </p>
                <p className="productsp1">
                  <b>Name: </b>
                  {item.productname}
                </p>
                <p className="productsp1">
                  <b>Price: </b>
                  {item.productprice}
                </p>
                <p className="productsp1">
                  <b>Quantity: </b>
                  {item.productquantity}
                </p>
                <p className="productsp2">
                  <b>Description: </b>
                  {item.productdesc}
                </p>
                <div className="productsbtndiv">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="productsdeletebtn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Products;
