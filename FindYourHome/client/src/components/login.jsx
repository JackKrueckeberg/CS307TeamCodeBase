import React, { useState, useEffect } from 'react';
import '../Stylings/loginStyle.css';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submission = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        // Set the background color when the component mounts
        document.body.style.backgroundColor = 'lightblue'; // Replace 'desiredColor' with your color.

        // Reset the background color when the component unmounts
        return () => {
            document.body.style.backgroundColor = null;
        };
    }, []);

    return (
        <div className='user-authentication'>
            <h1>Home is Where Your Journey Begins.</h1>
            <form onSubmit={submission}>
                
                {/*Email/Username Submission box*/} 
                <label htmlFor="email/username" placeholder="youremail@example.com">Email / Username: </label>
                <input value={email} onChange = {(e) => setEmail(e.target.value)} type="text" id="email/username" />

                {/*Password Submission box*/} 
                <label htmlFor="password">Password: </label>
                <input value={password} onChange = {(e) => setPassword(e.target.value)} type="password" id="password"/>
                
                <button type="submit">Log In</button>
            </form>
            <button id="create">Don't have an Account?  Click here to Create one.</button>
        </div>
    )
}
