import React, { useState, useEffect, useRef } from 'react';
import styles from '../Stylings/loginStyle.module.css';
import { Collapse } from 'bootstrap';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRecoverForm, setShowRecoverFrom] = useState(false);
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const timeoutRef = useRef(null);


    const submission = async (e) => {
        e.preventDefault();

        const userCredentials = {
            email: email,
            password: password
        };
    
        try {
            // Send a POST request to the server
            const response = await fetch("http://localhost:5050/loginRoute/login", { 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCredentials)
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                console.log(data.message);
                setIncorrectAttempts(0);
            } else {
                console.error(data.error);
                setIncorrectAttempts(prev => prev + 1);
            }
    
        } catch (error) {
            console.error("There was an error logging in:", error);
        }
    };

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

    function openRecoveryForm() {
        document.getElementById("recoveryForm").style.display = "block";
    }
      
    function closeRecoveryForm() {
        document.getElementById("recoveryForm").style.display = "none";
    }

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

                {incorrectAttempts > 0 && (
                    <p className={styles.incorrect}>
                        Incorrect email or password
                    </p>
                )}

                <button type="submit" className={styles.button}>Log In</button>
            </form>

        
            <button type="button" className={styles.account}>Don't have an Account? Click here to Create one.</button>

            {/* QUINNS ACCOUNT RECOVER FORM CODE NEEDS TO BE REWORKED IN AND MADE AN ACTUAL POP-UP
      
                <button class="open-recover-form" onclick="openRecoveryForm()">Open Recovery Form</button>

                            <div class="form-popup" id="recoveryForm">
                                <form action="/action_page.php" class="form-container">
                                    <h1>Enter Email to Recover</h1>

                                    <label for="email"><b>Email</b></label>
                                    <input type="email" placeholder="Enter Email" name="email" required/>

                                    <button type="submit" class="btn">Recover</button>
                                    <button type="button" class="btn cancel" onclick="closeForm()">Close</button>
                                </form>
                            </div>
            */}

        </div>
    )
}

export default Login;