import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

//mui
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import EmailIcon from "@mui/icons-material/Email";
//assets
import guser from "./../assets/guser.svg";
import namepic from "./../assets/name.svg";
import passwordpic from "./../assets/password.svg";
import fb from "./../assets/fb.svg";
import google from "./../assets/google.svg";
//redux,api
import { setAlert } from "../actions/alert";
import { register } from "../actions/auth";
import { createCart } from "../actions/cart";

const SignUp = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    registeration: "",
    password: "",
    conpass: "",
  });

  const { name, email, registeration, password, conpass } = values;
  const handleRemember = (event) => {
    setRemember(event.target.checked);
  };
  const handleInput = (e) => {
    const Value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: Value,
    });
  };

  const handleOpen = () => {
    if (remember === false) {
      setShow(true);
    }
    if (remember === true) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    //e.preventDefault();
    if (password !== conpass) {
      dispatch(setAlert("Password do not match", "danger", 5000));
    } else {
      dispatch(register({ name, email, password, registeration }));
      dispatch(setAlert("Redirecting..."));

      const timer = setTimeout(() => {
        dispatch(createCart());
        navigate("/home");
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "526px",
    height: "158px",
    background: "#e94b41",
    borderRadius: "6px",
    paddingLeft: "15px",
    display: "flex",
    flexDirection: "column",
  };
  return (
    <>
      <div
        style={{
          padding: "50px 0 100px 0",
        }}
        className="mainsignupDiv"
      >
        <div className="bigDivS">
          <div className="circleDiv">
            <div className="circleDiv2">
              <img className="circleDiv2pic" src={guser} alt="" />
            </div>
          </div>
          <div className="smallDivS">
            <div className="input-container">
              <i className="inputimgback">
                <img className="inputimg" src={namepic} alt="" />
              </i>
              <input
                className="input-field"
                type="text"
                placeholder="Username"
                name="name"
                value={values.name}
                onChange={handleInput}
              />
            </div>
            <div className="input-container">
              <i className="inputimgback">
                <EmailIcon className="inputimg" />
                {/* <img className="inputimg" src={EmailIcon} alt="" /> */}
              </i>
              <input
                className="input-field"
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleInput}
              />
            </div>
            <div className="input-container">
              <i className="inputimgback">
                <img className="inputimg" src={namepic} alt="" />
              </i>
              <input
                className="input-field"
                type="text"
                placeholder="Registeration Number"
                name="registeration"
                value={values.registeration}
                onChange={handleInput}
              />
            </div>
            <div className="input-container">
              <i className="inputimgback">
                <img className="inputimg" src={passwordpic} alt="" />
              </i>
              <input
                className="input-field"
                type="text"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleInput}
              />
            </div>
            <div className="input-container">
              <i className="inputimgback">
                <img className="inputimg" src={passwordpic} alt="" />
              </i>
              <input
                className="input-field"
                type="text"
                placeholder="Confirm Password"
                name="conpass"
                value={values.conpass}
                onChange={handleInput}
              />
            </div>
            <div className="check-container">
              <div style={{ display: "flex" }}>
                <Checkbox
                  // sx={{ color: "red" }}
                  className="form-check-input"
                  checked={remember}
                  onChange={handleRemember}
                />

                <span className="checkpS">
                  Agree to
                  <Link
                    to="/termconditions"
                    style={{
                      color: "#00B4FF",
                      textDecoration: "underline",
                      fontWeight: "700",
                      margin: "0px 0px 0px 5px",
                    }}
                  >
                    Terms and Condition!
                  </Link>{" "}
                </span>
              </div>
              <Link to="/login" className="checkp2">
                Login
              </Link>
            </div>
            <p
              style={{
                display: `${show && !remember ? "flex" : "none"}`,
              }}
              className="smallDivp"
            >
              Kindly check the checkbox!
            </p>
          </div>
        </div>
        <div style={{ marginTop: "35px" }}>
          <button
            /* onClick={handleOpen} */ onClick={onSubmit}
            className="btn1"
          >
            Sign up
          </button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <p className="SignBoxp">Sign up as?</p>
              <div
                style={{
                  width: "77%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignSelf: "center",
                }}
              >
                <button className="SignBoxb1">Admin</button>
                <button className="SignBoxb2">User</button>
              </div>
            </Box>
          </Modal>
        </div>
        <p className="mainDivp1">Or login with</p>
        <div className="mainimgDiv">
          <div style={{ background: "#C54238" }} className="imgDiv">
            <img className="endimg" src={google} alt="" />
          </div>

          <div style={{ background: "#2F4D93" }} className="imgDiv">
            <img className="endimg" src={fb} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
