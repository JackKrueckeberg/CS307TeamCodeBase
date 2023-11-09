import React, { useState, useRef, useEffect } from "react";
import styles from '../Stylings/twoFactorStyle.module.css';
import { useNavigate  } from 'react-router-dom';

const TwoFactor = () => {
    const [codes, setCodes] = useState(Array(6).fill(''));
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

    const handleTwoFactorAuth = async () => {
        
    }

    return (
        <div className={styles.twoFactorAuth}>
            <h1>Two-Factor Authentication</h1>
            <p>Please enter the authentication code sent to your device:</p>
            <div className={styles.codeInputs}> 
                {codes.map((code, index) => (
                    <input key={index} 
                           type="text" 
                           maxLength="1" 
                           value={code} 
                           ref={refs[index]}
                           onChange={e => handleInputChange(index, e)} 
                           onKeyDown={e => handleKeyDown(index, e)} 
                           className={styles.singleInputBox} />
                ))}
            </div>
            <button type="button" className={styles.verifyButton} onClick={handleTwoFactorAuth}>Verify Code</button>
            {message && (
                <div className={`${styles.message} ${messageType === 'error' ? styles.errorMessage : styles.successMessage}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default TwoFactor;
