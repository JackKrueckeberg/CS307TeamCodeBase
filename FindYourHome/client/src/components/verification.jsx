import React, { useState } from "react";
import styles from '../Stylings/verificationStyle.module.css';


const Verification = () => {
    const [codes, setCodes] = useState(Array(6).fill(''));
    const [email, setEmail] = useState("");

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
                alert("Verification code sent to your email!");
            } else {
                const data = await response.json();
                alert(data.message || "Error sending verification code.");
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
                alert("Email verified successfully!");
            } else {
                alert("Invalid Verification Code");
            }
        } catch (error) {
            alert("There was an error while verifying. Please try again.");
        }
    }

    return (
        <div className={styles.emailVerification}>
            <h1>Verify Your Email Address</h1>
            <label htmlFor="email">Enter your email:</label>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="youremail@example.com"
                id="email"
                className={styles.emailInput} 
            />
            <h5>Please Enter the Verification code that you received below:</h5>
            <div className={styles.codeInputs}> 
                {codes.map((code, index) => (
                    <input key={index} type="text" maxLength="1" value={code} ref={refs[index]}onChange={e => handleInputChange(index, e)} 
                        onKeyDown={e => handleKeyDown(index, e)} className={styles.singleInputBox}/>
                ))}
                <button type="button" className={styles.sendCodeButton} onClick={handleSendVerificationCode}>Send Verification Code</button>
            </div>
            <button type="button" className={styles.verifyButton} onClick={handleVerification}>Verify</button>
            <div className={styles.otherButtons}>
                <button type="button">Resend Verification</button>
                <button type="button">Verify Later</button>
            </div>
        </div>
    );
}

export default Verification;