import React, { useState, useRef } from 'react';
import styles from '../Stylings/createAccountStyle.module.css';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { getSelectUtilityClasses } from '@mui/material';
// import login from "./components/login";


export const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { user, setLoggedInUser } = useUser();
    const timeoutRef = useRef(null);
    
    const submission = (e) => {
        e.preventDefault();
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validatePassword = (password) => {
        const isValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
        setPasswordValid(isValid);
        return isValid;
    };

    const handlePasswordChange = (e) => {
        setPassword(e);
        validatePassword(e);
    };

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setEmailValid(isValid);
        return isValid;
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const emailInputStyle = emailValid ? styles.input : styles.inputInvalid;

    const passwordInputStyle = passwordValid ? styles.input : styles.inputInvalid;

    const signup = async () => {
        // e.preventDefault();
        console.log("in signup post");

        try {
            const response = await fetch("http://localhost:5050/users/createUser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, firstName, lastName, email, password }),
            }
            );
            
    
            if (response.status == 200) {
                console.log('User account created successfully');
            } else {
                console.error('An error occurred:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <div className={styles.accountCreation}>
            <h1 className={styles.text}>Start Your Journey Here.</h1>
            <form className={styles.form}>
                <label className={styles.label} htmlFor="username">Username:</label>
                    <input 
                        className={styles.input}
                        value={username} 
                        name="username" 
                        id="username" 
                        placeholder='Username' 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    {/* Name and email details form */}
                    <label className={styles.label} htmlFor="firstName">Name:</label>
                    <input 
                        className={styles.input}
                        value={firstName} 
                        name="firstName" 
                        id="firstName" 
                        placeholder='First Name' 
                        onChange={(e) => setFirstName(e.target.value)} 
                    />
                    {/* <label className={styles.label} htmlFor="lastName"></label> */}
                    <input 
                        className={styles.input}
                        value={lastName} 
                        name="lastName" 
                        id="lastName"
                        placeholder='Last Name'   
                        onChange={(e) => setLastName(e.target.value)} 
                    />
                    <label className={styles.label} htmlFor="email">Email:</label>
                    <input 
                        className={emailInputStyle}
                        value={email} 
                        placeholder='youremail@example.com'
                        onChange={/*(e) => setEmail(e.target.value)*/handleEmailChange} 
                        type="email"
                        id="email" 
                    />
                    {!emailValid && <div className={styles.emailError}>Please enter a valid email address.</div>}
                    {/* Password accaptance form */}
                    <div className={styles.passwordEntryWrapper}>
                        <label className={styles.label} htmlFor="password">Password:</label>
                        <div className={styles.passwordInputContainer}>
                            <input 
                                className={passwordInputStyle}
                                value={password} 
                                placeholder='password'
                                onChange={(e) => handlePasswordChange(e.target.value)} 
                                type={showPassword ? "text" : "password"} 
                                id="password"
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className={styles.showPasswordButton}>
                                {showPassword ? "hide" : "show"}
                            </button>
                        </div>
                        {!passwordValid && <div className={styles.passwordError}>Password must be at least 8 characters long and contain a number, an uppercase and a lowercase letter.</div>}
                    </div>
                <button className={styles.button} onClick={() => signup().then(navigate("/verification"))}>Create Account</button>
            </form>
            <button className={styles.button} onClick={() => navigate("/")}id="login">Return to Log In.</button>
        </div>
    )
}

export default CreateAccount;