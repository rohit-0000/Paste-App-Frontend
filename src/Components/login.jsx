import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./login.css";

const API_URL = import.meta.env.VITE_API_URL;
const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Repassword, setRePassword] = useState("");
  const [email, SetEmail] = useState("");
  const [verify,SetVerify] = useState(false);
  const navigate = useNavigate();
  const [forgotPass, SetForgotPass] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [sendOtp, setSendOtp] = useState("");
  const [resetPass, SetResetPass] = useState(false);
  const [loading,setLoading]=useState(false);
  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    let response = null;
    try {
      response = await axios.post(`${API_URL}/public/login`, {
        userName,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data);
        toast.success("Login Successful 👍");
        navigate("/home");
        window.location.reload();
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        toast.error("Invalid credentials");
      } else {
        // console.error(e);
        console.error(`${process.env.API_URL}`)
        toast.error("An error occurred");
      }
    }
    setLoading(false);
  }

  function otpInput(element, index) {
    if (/[^0-9]/.test(element.value)) return; // Only allow numeric digits
    const newOtp = otp.slice();

    newOtp[index] = element.value;

    // Move focus to the next input box if the current one is filled
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }

    setOtp(newOtp);
  }
  function handleKeyDown(element, index, e) {
    if (e.key === "Backspace" && !element.value) {
      if (element.previousSibling) {
        element.previousSibling.focus();
      }
    }
  }
  function handleForgotPassword() {
    SetForgotPass(true);
  }
  async function handleGetOtp(e) {
    e.preventDefault();
    setLoading(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Change: Generate OTP here
    setSendOtp(generatedOtp); // Change: Set OTP state
    let response = null;
    try {
      response = await axios.post(`${API_URL}/email/forgot-send`, {
        userName,
        to: email,
        subject: "Your One-Time Password (OTP) for Account Verification",
        body: `

                Thank you for your recent action to access your account. To proceed with the verification process, please use the following One-Time Password (OTP):

                ${generatedOtp} // Change: Use generated OTP

                This OTP is valid for [time duration] and can only be used once. If you did not request this OTP, please ignore this email, and contact our support team immediately.

                Thank you for your cooperation.

                Best regards,

                Paste App`,
      });
      if (response.status === 200){
         toast.success("Email sent Succesfully");
         SetVerify(true);
      }
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("UserName and email not Match");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    }
    setLoading(false);
  }

  async function handleEmailVerify(e) {
    if(verify===false) {
      toast.error("Fill the credential first");
      return;
    }
    if (sendOtp === otp.join("")) {
      SetResetPass(true);
      SetForgotPass(false);
    } else {
      toast.error("Incorrect Password");
    }
    SetVerify(false);
  }

  async function handleChangePass() {
    setLoading(true);
    let response = null;
    if (password == Repassword) {
      try {
        response = await axios.post(
          `${API_URL}/public/change-password`,
          {
            email: email,
            password: password,
          }
        );

        if (response.status == 200) {
          SetForgotPass(false);
          SetResetPass(false);
          toast.success("Password Change");
        }
      } catch (e) {
        if (e.response && e.response.status === 404) {
          toast.error("UserNot Found");
        } else {
          console.error(e);
          toast.error("Unexpexted error  found");
        }
      }
    } else {
      toast.error("Passsword do not Match");
    }
    setLoading(false);
  }
  
  if (forgotPass) {
    return (
      <div id="forgotPass-container">
        <div id="forgotPass">
          <h1>FORGOT PASSWORD</h1>
          <form id="forgotPass-otp-container" onSubmit={handleGetOtp}>
            <div id="forgotPass-input">
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => SetEmail(e.target.value)}
                  required
                />
            </div>
              <button id="get-otp" disabled={loading}>
                {loading? "Loading":"Get OTP"}
              </button>
          </form>

          <div className="otp-input-container">
            <h2>Enter OTP</h2>
            <div className="otp-input">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => otpInput(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e.target, index, e)}
                />
              ))}
            </div>
            <button id="verify" onClick={handleEmailVerify}disabled={loading}>
              {loading? "Loading":"Verify"}
            </button>
          </div>
        </div>
      </div>
    );
  } else if (resetPass) {
    return (
      <div id="reset-container">
        <div id="reset">
          <h1>RESET PASSWORD</h1>
          <form id="resetPass">
            {/* password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Re-Enter Password"
              value={Repassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
            <button id="submit" type="Submit" onClick={handleChangePass} disabled={loading}>
              {loading? "Loading":"Change Password"}
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div id="login-Container">
        <div id="login">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} id="form">
            {/* userName */}
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button id="submit" type="submit" disabled={loading}>
              {loading? "Loading":"Login"}
            </button>
          </form>
          <p id="forgot" onClick={handleForgotPassword}>
            Forgot Password
          </p>
          <p>
            Don't have an account?{" "}
            <NavLink id="link" to="/signup">
              Register Here
            </NavLink>
          </p>
        </div>
      </div>
    );
  }
};
export default Login;
