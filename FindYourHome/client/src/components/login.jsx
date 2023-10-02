import React, { useState, useEffect, useRef } from 'react';
import '../Stylings/loginStyle.css';

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
        // Set the background color when the component mounts
        document.body.style.backgroundColor = 'lightblue'; // Replace 'desiredColor' with your color.

        // Reset the background color when the component unmounts
        return () => {
            document.body.style.backgroundColor = null;
        };
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

    }, []);

    return (
        <div className='user-authentication'>
            <h1>Home is Where Your Journey Begins.</h1>
            <form onSubmit={submission}>
                
                {/*Email/Username Submission box*/} 
                <label htmlFor="email" placeholder="youremail@example.com">Email: </label>
                <input value={email} onChange = {(e) => setEmail(e.target.value)} type="text" id="email" />

                {/*Password Submission box*/} 
                <div  className='password-entry-wrapper'>
                    <label htmlFor="password">Password: </label>
                    <input value={password} onChange = {(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} id="password"/>
                    <button onClick={togglePasswordVisibility} 
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        role="switch"
                        aria-checked={showPassword}
                        className="toggle-password"
                        data-show={!showPassword ? "true" : "false"}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>

                </div>

                <button type="submit">Log In</button>
            </form>
            <button id="create">Don't have an Account?  Click here to Create one.</button>
        </div>
    )
}

export default Login;