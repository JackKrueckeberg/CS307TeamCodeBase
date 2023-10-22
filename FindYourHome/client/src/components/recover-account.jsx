import React, { useState, useEffect } from 'react';
import styles from '../Stylings/recoverAccountStyle.css';
import { useNavigate } from 'react-router-dom';

export const RecoverAccount = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, []);
    
    const submission = (e) => {
        e.preventDefault();
    }

    
    // const togglePasswordVisibility = () => {
    //     // If password is currently being shown, we hide it
    //     if (showPassword) {
    //         setShowPassword(false);
    //         // Clear any existing timeouts
    //         if (timeoutRef.current) {
    //             clearTimeout(timeoutRef.current);
    //         }
    //     } 
    //     // If password is currently hidden, we show it and set a timeout to hide it again
    //     else {
    //         setShowPassword(true);
    //         timeoutRef.current = setTimeout(() => {
    //             setShowPassword(false);
    //         }, 20000); // Hide after 20 seconds
    //     }
    // };

    return (
        <div className={styles.recoverAccount}>
            <h1>Home is Where Your Journey Begins.</h1>
            <form onSubmit={submission}>
                {/* descriptive header */}
                <h2>Enter a new password for your account:</h2>
                {/* Password accaptance form */}
                <div className='password-entry-wrapper'>
                    <label htmlFor="password">Password:</label>
                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required
                        type={showPassword ? "text" : "password"}
                        id="password"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} type="submit">
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </form>

            <button id="login">Reset Password and Return to Login Page</button>
        </div>
    )
}

export default RecoverAccount;