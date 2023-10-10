import React, { useState, useRef } from 'react';
import styles from '../Stylings/createAccountStyle.module.css'; //assuming you named your CSS file CreateAccount.module.css


export const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const timeoutRef = useRef(null);
    
    const submission = (e) => {
        e.preventDefault();
    }

    const isValidForm = () => {
        if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
            return false;
        }
        return true;
    };

    const handleFormSubmit = async (event) => {
        //event.preventDefault();
    
        if (!isValidForm()) {
            alert("All fields marked with * are required.");
            return;
        }

        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, firstName, lastName, email, password }),
            });
    
            if (response.ok) {
                console.log('User account created successfully');
            } else {
                console.error('An error occurred:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className={styles.accountCreation}>
            <h1>Start Your Journey Here.</h1>
            <form onSubmit={handleFormSubmit}>
            <label htmlFor="username">Username*</label>
                <input 
                    value={username} 
                    name="username" 
                    id="username" 
                    placeholder='Username' 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                {/* Name and email details form */}
                <label htmlFor="firstName">Name*</label>
                <input 
                    value={firstName} 
                    name="firstName" 
                    id="firstName" 
                    placeholder='First Name' 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                <label htmlFor="lastName"></label>
                <input 
                    value={lastName} 
                    name="lastName" 
                    id="lastName"
                    placeholder='Last Name'   
                    onChange={(e) => setLastName(e.target.value)} 
                />
                <label htmlFor="email">Email*</label>
                <input 
                    value={email} 
                    placeholder='youremail@gmail.com'
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email"
                    id="email" 
                />

                {/* Password accaptance form */}
                <div className={styles.passwordEntryWrapper}>
                    <label htmlFor="password">Password*</label>
                    <input 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required
                        type={showPassword ? "text" : "password"} 
                        id="password"
                    />
                </div>
                <button type="submit">Register</button>
            </form>

            <button id="login">Already have an Account?  Click here to log in.</button>
        </div>
    )
}

export default CreateAccount;