import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../Reducer/pasteSlice";
import bcrypt from "bcryptjs";
import toast from "react-hot-toast";

const Profile = () => {
  const user = useSelector((state) => state.paste.user);
  const [password, setPassword] = useState("");
  const [repassword, SetRePass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const dispatch = useDispatch();
  const [name1, setName] = useState("");
  useEffect(() => {
    if (user) {
      setName(user.name || ""); // Initialize state with user name
      setPassword(""); // Clear password fields
      SetRePass("");
      setOldPass("");
    }
  }, [user]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleNameSave() {
    const newuser = {
      name: name1, 
    };
    if (name1 !== "" && name1 !== user.name) {
      dispatch(updateUser(newuser)).then(() => {
        dispatch(fetchUser());
      });
      toast.success("Name Changed");
    } else {
      toast.error("Name cannot be empty or the same as the previous name");
    }
  }

  function handlePassChange() {
    bcrypt.compare(oldPass, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        toast.error("Incorrect Old Password");
        return;
      }

      if (password === repassword) {
        const newuser = {
          password: password,
        };
        dispatch(updateUser(newuser)).then(() => {
          dispatch(fetchUser());
        });
        toast.success("Password Changed Successfully");
      } else {
        toast.error("Passwords do not match");
      }
    });
  }

  return (
    <div id="profile-container">
      <div id="profile">
        <div className="profile-name">
          <p className="profile-title">Name </p>
          <div className="profile-input-box">
                <input
                value={name1} 
                onChange={handleNameChange}
                
                />
                <button onClick={handleNameSave}>Save</button>
          </div>
        </div>

        <div className="profile-name">
          <p className="profile-title">Email</p>
          <div className="profile-input-box">
            <input
                value={user.email || ""} 
                disabled
                id="dis-input"
            />
          </div>
        </div>

        <div className="profile-name">
          <p className="profile-title">Username</p>
          <div className="profile-input-box">
          <input
            value={user.userName || ""} 
            disabled
            id="dis-input"
          />
          </div>
        </div>

        <div className="profile-name">
          <p className="profile-title">Password</p>

          <div className="profile-input-box">
            <p>Enter old password</p>
            <input
              placeholder="Old Password"
              type="password"
              onChange={(e) => setOldPass(e.target.value)}
            />
            <p>Enter new password</p>
            <input
              value={password}
              placeholder="New Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="profile-input"
            />
            <p>Re-Enter new password</p>
            <input
              value={repassword}
              placeholder="Re-enter New Password"
              type="password"
              onChange={(e) => SetRePass(e.target.value)}
              className="profile-input"
            />
            <button onClick={handlePassChange}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
