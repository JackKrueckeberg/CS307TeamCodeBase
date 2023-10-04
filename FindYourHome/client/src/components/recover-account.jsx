import React, { useState, useEffect } from 'react';

export const RecoverAccount = () => {
    const [password, setPassword] = useState('');
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


    return (
        <div className='recover-account'>
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

            <button id="login">Click here to log in with a different account</button>
        </div>
    )
}