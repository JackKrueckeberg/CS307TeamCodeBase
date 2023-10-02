import React, { useState, useEffect, useRef } from 'react';
import styles from '../Stylings/loginStyle.module.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const timeoutRef = useRef(null);


    const submission = (e) => {
        e.preventDefault();
    }

    const togglePasswordVisibility = () => {
        // If password is currently being shown, we hide it
        if (showPassword) {
            setShowPassword(false);
            // Clear any existing timeouts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        } 
        // If password is currently hidden, we show it and set a timeout to hide it again
        else {
            setShowPassword(true);
            timeoutRef.current = setTimeout(() => {
                setShowPassword(false);
            }, 20000); // Hide after 20 seconds
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

    }, []);

    return (
        <div className={styles.userAuthentication}>
            <h1>Home is Where Your Journey Begins.</h1>
            <form onSubmit={submission} className={styles.form}>
                
                {/*Email/Username Submission box*/}
                <label htmlFor="email" placeholder="youremail@example.com" className={styles.label}>Email: </label>
                <input value={email} onChange = {(e) => setEmail(e.target.value)} type="text" id="email" className={styles.input} />

                {/*Password Submission box*/}
                <div className={styles.passwordEntryWrapper}>
                    <label htmlFor="password" className={styles.label}>Password: </label>
                    <input value={password} onChange = {(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} id="password" className={styles.input}/>
                    <button onClick={togglePasswordVisibility} 
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        role="switch"
                        aria-checked={showPassword}
                        className={`${styles.button} ${styles.togglePassword}`}
                        data-show={!showPassword ? "true" : "false"}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>

                </div>

                <button type="submit" className={styles.button}>Log In</button>
            </form>
            <button type="button" className={styles.account}>Forgot my Password</button>
            <button type="button" className={styles.account}>Don't have an Account? Click here to Create one.</button>

        </div>
    )
}

export default Login;