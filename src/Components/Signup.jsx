import React, { useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css'
import { set } from 'react-hook-form';

const Signup = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [Repassword, setRePassword] = useState('');
    const [verifiedEmail, SetverifiedEmail] = useState(false);
    const [name, SetName] = useState('');
    const [email, SetEmail] = useState('');
    const navigate = useNavigate();
    const [sendOtp, setSendOtp] = useState("");
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading,setLoading]=useState(false);
    async function handleSubmit(e) {
        setLoading(true);
        e.preventDefault();
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Change: Generate OTP here
        setSendOtp(generatedOtp); // Change: Set OTP state

        try {
            await axios.post(`${API_URL}/email/send`, {
                to: email,
                subject: "Your One-Time Password (OTP) for Account Verification",
                body: `Dear ${name},

                Thank you for your recent action to access your account. To proceed with the verification process, please use the following One-Time Password (OTP):

                ${generatedOtp} // Change: Use generated OTP

                This OTP is valid for [time duration] and can only be used once. If you did not request this OTP, please ignore this email, and contact our support team immediately.

                Thank you for your cooperation.

                Best regards,

                Paste App`
            });
            SetverifiedEmail(true);
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        }
        setTimeout(() => {
            
            setLoading(false);
        }, 5000);
    }

    async function handleEmailVerify(e) {
        setLoading(true);
        e.preventDefault();

        if (sendOtp === otp.join("")) { // Change: Compare concatenated OTP array
            try {
                if (password === Repassword) {
                    const response = await axios.post(`${API_URL}/public/signup`, { userName: userName, password: password, name: name, email: email });
                    if (response.status === 201) { // i.e created
                        toast.success('Signup Successful 🥳');
                        navigate('/');
                    }
                } else {
                    toast.error('Passwords do not match');
                }
            } catch (e) {
                if (e.response && e.response.status === 400) {
                    toast.error('Signup failed: Username already exists');
                } else {
                    toast.error('Signup failed: An unexpected error occurred');
                }
            }
        } else {
            console.error(otp.join("") + " " + sendOtp)
            toast.error("Incorrect OTP");
        }
        setLoading(false);
    }

    function otpInput(element, index) {
        if (/[^0-9]/.test(element.value)) return;  // Only allow numeric digits
        const newOtp = otp.slice();

        newOtp[index] = element.value;

        // Move focus to the next input box if the current one is filled
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }

        setOtp(newOtp);
    }

    function handleKeyDown(element, index, e) {
        if (e.key === 'Backspace' && !element.value) {
            if (element.previousSibling) {
                element.previousSibling.focus();
            }
        }
    }

    return (
        verifiedEmail ? (
            <div id="otp-veri-container">
                <div id="otp-veri">
                    <h2>OTP VERIFICATION</h2>
                    <p>Enter 6-digit OTP sent to your email <span>{email}</span></p>
                    <div className='otp-input'>
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
                    <div id="btn">
                        <div id="verify-otp-btn">
                            <button id="resend" onClick={handleSubmit}>ReSend OTP</button>
                            <button id="verify" onClick={handleEmailVerify}>Verify</button>
                        </div>
                        <button id="changeEmail"onClick={() => SetverifiedEmail(false) } disabled={loading}>{loading? "Loading": "Change Email id"}</button>
                    </div>
                </div>
            </div>
        ) : (
            <div id="signup-Container">
                <div id="signup">
                    <h1>Signup</h1>
                    <form onSubmit={handleSubmit} id="form">
                        {/* name */}
                        <input type="text" placeholder="Name" value={name} onChange={(e) => SetName(e.target.value)} required />
                        {/* email */}
                        <input type="email" placeholder="Email" value={email} onChange={(e) => SetEmail(e.target.value)} required />
                        {/* userName */}
                        <input type='text' placeholder='Username' value={userName} onChange={(e) => setUsername(e.target.value)} required />

                        {/* password */}
                        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <input type='password' placeholder='Re-Enter Password' value={Repassword} onChange={(e) => setRePassword(e.target.value)} required />
                        <button id='submit' type='Submit' disabled={loading}>{loading? "Loading": "Signup"}</button>
                    </form>

                    <p>Already have an account? <Link id="link" to='/'>Login</Link></p>
                </div>
            </div>
        )
    );
}

export default Signup;