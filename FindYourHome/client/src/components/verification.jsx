import React, { useState } from "react";
import styles from '../Stylings/verificationStyle.module.css';


const Verification = () => {
    const [codes, setCodes] = useState(Array(6).fill('')); // Create an array of 6 empty strings

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

    return (
        <div className={styles.emailVerification}>
            <h1>Verify Your Email Address</h1>
            <h5>Please Enter the Verification code that you received below:</h5>
            <div className={styles.codeInputs}> 
                {codes.map((code, index) => (
                    <input key={index} type="text" maxLength="1" value={code} ref={refs[index]}onChange={e => handleInputChange(index, e)} 
                        onKeyDown={e => handleKeyDown(index, e)} className={styles.singleInputBox}/>
                ))} 
            </div>
            <button type="button" className={styles.verifyButton}>Verify</button>
            <div className={styles.otherButtons}>
                <button type="button">Resend Verification</button>
                <button type="button">Verify Later</button>
            </div>
        </div>
    );
}

export default Verification;