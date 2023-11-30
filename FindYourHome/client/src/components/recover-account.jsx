import React, { useState, useEffect } from 'react';
import styles from '../Stylings/recoverAccountStyle.module.css';
import { useNavigate } from 'react-router-dom';

export const RecoverAccount = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles.recoverAccount}>
            <h1 className={styles.headerText}>Home is Where Your Journey Begins.</h1>
            <form>
                {/* descriptive header */}
                <h2 className={styles.label}>Enter a new password for your account:</h2>
                {/* Password accaptance form */}
                <div className={styles.passwordEntryWraper}>
                    <label className={styles.label} htmlFor="password">Password:</label>
                    <input 
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required
                        type={showPassword ? "text" : "password"}
                        id="password"
                    />
                    <button type="button" className={styles.button} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </form>

            <button className={styles.button} onClick={() => navigate('/')}>Reset Password and Return to Login Page</button>
        </div>
    )
}

export default RecoverAccount;