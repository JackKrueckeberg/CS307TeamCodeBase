import React, { useState } from "react";
import styles from '../Stylings/verificationStyle.module.css';
import { useNavigate } from 'react-router-dom';



const Verification = () => {
    const [codes, setCodes] = useState(Array(6).fill(''));
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");  // can be 'success' or 'error'
    const navigate = useNavigate();


    // References to each of the input boxes
    const refs = Array.from({ length: 6 }).map(() => React.createRef());

    const handleInputChange = (index, e) => {
        const values = [...codes];
        values[index] = e.target.value;
        setCodes(values);

        // If the current box has a value, shift focus to the next box (if it exists)
        if (e.target.value && refs[index + 1]) {
            refs[index + 1].current.focus();
        }
    }

    const handleKeyDown = (index, e) => {
        // If backspace is pressed and the current box is empty, shift focus to the previous box (if it exists)
        if (e.key === 'Backspace' && !codes[index] && refs[index - 1]) {
            refs[index - 1].current.focus();
        }
    }

    const handleVerifyLater = () => {
        navigate('/view-city');
    }

    const handleSendVerificationCode = async () => {
        try {
            const response = await fetch('http://localhost:5050/emailVerification/send-verification-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
    
            if (response.ok) {
                setMessage("Verification code sent to your email!");
                setMessageType('success');
            } else {
                const data = await response.json();
                setMessage(data.message || "Error sending verification code.");
                setMessageType('error');
            }
        } catch (error) {
            alert("There was an error while sending the verification code. Please try again.");
        }
    }
    
    const handleVerification = async () => {
        const verificationCode = codes.join(""); // Join the individual codes into a single string

        try {
            const response = await fetch('http://localhost:5050/emailVerification/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, code: verificationCode })
            });
            
            const data = await response.json();

            if (response.ok) {
                setMessage("Email verified successfully!");
                setMessageType('success');
                return Promise.resolve();
            } else {
                setMessage("Invalid Verification Code");
                setMessageType('error');
                return Promise.resolve();
            }
        } catch (error) {
            alert("There was an error while verifying. Please try again.");
            return Promise.resolve();
        }
    }

    const handleResendVerificationCode = async () => {
        if(!email.trim()) { // Check if email field is empty
            setMessage("Please enter your email address first.");
            setMessageType('error');
            return;
        }
        try {
            await handleSendVerificationCode(); // If email is present, send verification code
            setMessage("Verification code was re-sent to your email!");
            setMessageType('success');
        } catch (error) {
            //errors already handled this is for the sake of the try/catch
        }
    }

    return (
        <div className={styles.emailVerification}>
            <h1>Verify Your Email Address</h1>
            <label htmlFor="email">Please enter your email:</label>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="youremail@example.com"
                id="email"
                className={styles.emailInput} 
            />
            <button type="button" className={styles.sendCodeButton} onClick={handleSendVerificationCode}>Send Verification Code</button>
            <h5>Please Enter the Verification code that you received below:</h5>
            <div className={styles.codeInputs}> 
                {codes.map((code, index) => (
                    <input key={index} type="text" maxLength="1" value={code} ref={refs[index]}onChange={e => handleInputChange(index, e)} 
                        onKeyDown={e => handleKeyDown(index, e)} className={styles.singleInputBox}/>
                ))}
            </div>
            <button type="button" className={styles.verifyButton} onClick={handleVerification}>Verify</button>
            <div className={styles.otherButtons}>
                <button type="button" onClick={handleResendVerificationCode}>Resend Verification</button>
                <button type="button" onClick={handleVerifyLater}>Verify Later</button>
            </div>
            {message && (
                <div className={`${styles.message} ${messageType === 'error' ? styles.errorMessage : styles.successMessage}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default Verification;