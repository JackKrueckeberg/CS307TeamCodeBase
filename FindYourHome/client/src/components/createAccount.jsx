import React, { useState, useEffect } from 'react';

export const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
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

    handleFormSubmit = async (event) => {
        event.preventDefault();

        const {name, username, password} = this.state;

        try {
            const response = await fetch('/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, username, password }),
            });

            if (response.ok) {
                console.log('User account created successfully');
            } else {
                console.error('An error occurred:', error);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className='account-creation'>
            <h1>Home is Where Your Journey Begins.</h1>
            <form onSubmit={submission}>
                {/* Name and email details form */}
                <label htmlFor="name">Your Name:</label>
                <input 
                    value={name} 
                    name="name" 
                    id="name" 
                    placeholder="your name" 
                />
                <label htmlFor="email">Your Email:</label>
                <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email"
                    id="email" 
                />

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

            <button id="login">Already have an Account?  Click here to log in.</button>
        </div>
    )
}