import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";
//mui
import Checkbox from "@mui/material/Checkbox";
import EmailIcon from "@mui/icons-material/Email";
//assets
import guser from "./../assets/guser.svg";
import passwordpic from "./../assets/password.svg";
import fb from "./../assets/fb.svg";
import google from "./../assets/google.svg";

const Login = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const { email, password } = values;
  const [remember, setRemember] = useState(false);
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
  const onSubmit = async (e) => {
    //e.preventDefault();
    dispatch(login(email, password));
  };
  const navigate = useNavigate();
  //Redirect if logged in
  if (isAuthenticated) {
    /* return <Navigate to="/home" />; */
    const timer = setTimeout(() => {
      navigate("/home");
    }, 100);
    return () => clearTimeout(timer);
  }
  return (
    <>
      <div className="mainloginDiv">
        <div className="bigDiv">
          <div className="circleDiv">
            <div className="circleDiv2">
              <img className="circleDiv2pic" src={guser} alt="" />
            </div>
          </div>
          <div className="smallDiv">
            <div className="input-container">
              <i className="inputimgback">
                <EmailIcon className="inputimg" />
              </i>
              <input
                className="input-field"
                type="text"
                placeholder="Email"
                name="email"
                value={values.email}
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
            <div className="check-container">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  className="form-check-input"
                  checked={remember}
                  onChange={handleRemember}
                />

                <p className="checkp">Remember me!</p>
                <div></div>
              </div>
              <Link to="/signup" className="checkp2">
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "35px" }}>
          <Link /* to="/home" */ onClick={onSubmit} className="l1">
            <button className="btn1">Login</button>
          </Link>
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

export default Login;
