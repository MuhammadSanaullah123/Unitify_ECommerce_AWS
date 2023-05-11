import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//component
import History from "../components/History/History";
//mui
import CircularProgress from "@mui/material/CircularProgress";
//api
import { createProfile } from "../actions/profile";
import { getCurrentProfile } from "../actions/profile";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const isloading = useSelector((state) => state.profile.loading);
  const auth = useSelector((state) => state.auth);

  const [values, setValues] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleInput = (e) => {
    const Value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: Value,
    });
  };

  const onSubmit = async (e) => {
    const edit = profile ? true : false;
    dispatch(createProfile(values, edit));
    if (!edit) {
      navigate("/home");
    }
  };
  useEffect(() => {
    dispatch(getCurrentProfile());
    if (profile != null) {
      setValues({
        name: profile.name,
        email: profile.email,
        address: profile.address,
      });
    }
  }, [isloading]);

  return isloading && profile === null ? (
    <CircularProgress className="spinner" />
  ) : (
    <div className="Profile">
      <div className="ProfileD1">
        <h1 className="profileh1">Setting up Profile</h1>
        <div className="profiled1">
          <span className="profiles1">
            <img
              className="profileavatar"
              src={isloading ? auth.user.avatar : ""}
              alt=""
            />
          </span>
          <input
            className="input-field"
            type="text"
            placeholder="Name"
            name="name"
            value={values.name}
            onChange={handleInput}
          />
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={handleInput}
          />
          <textarea
            className="text-field"
            type="text"
            placeholder="Address..."
            name="address"
            value={values.address}
            onChange={handleInput}
          />
          <button onClick={(e) => onSubmit(e)} className="profilebtn">
            Submit
          </button>
        </div>
      </div>
      <div className="profileline"></div>
      <div className="ProfileD2">
        <h1 className="profileh1">Previous Purchases</h1>
        <div className="ProfileD2d1">
          {!profile
            ? ""
            : profile.history
            ? profile.history.map((items, index) => (
                <History items={items} key={items._id} />
              ))
            : "No past purchases..."}
        </div>
      </div>
    </div>
  );
};

export default Profile;
