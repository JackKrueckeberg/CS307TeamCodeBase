import React, { useState, useEffect, useRef } from 'react';
import styles from '../Stylings/loginStyle.module.css';
import WaveBackground from '../svg/wave';
import { useUser } from '../contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';


export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRecoverForm, setShowRecoverFrom] = useState(false);
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const [rememberUser, setRememberUser] = useState(false);
    const [isForgotPasswordPopupOpen, setIsForgotPasswordPopupOpen] = useState(false)
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
    const timeoutRef = useRef(null);
    const { user, setLoggedInUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogoutMessage, setShowLogoutMessage] = useState(false);

    useEffect(() => {
        if (location.state?.loggedOut) {
            setShowLogoutMessage(true);
            setTimeout(() => {
                setShowLogoutMessage(false);
                // Reset the loggedOut state to prevent showing the message on refresh
                navigate(location.pathname, { state: { loggedOut: false }, replace: true });
            }, 2500); // Hide message after 5 seconds
        }
    }, [location, navigate]);
    

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
                setIncorrectAttempts(0);
                if (rememberUser && data.token) { 
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('currentUser', JSON.stringify(data.user)); 
                }
                if (data.user) {
                    sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                    setLoggedInUser(data.user);
                }
                navigate("/TwoFactor");                  
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
            }, 10000); // Hide after 10 seconds
        }
    };

    const validateToken = async (token) => {
        try {
            const response = await fetch("http://localhost:5050/loginRoute/validate-token", {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                if (data.user) {
                    setLoggedInUser(data.user);
                }
                navigate("/view-city");     
            } else {
                // The token is invalid. Remove it from local storage.
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                alert('Your session has expired. Please login again.');
            }
        } catch (error) {
            console.error("Error validating token:", error);
            alert('There was an error validating your session. Please try again.'); 
        }
    };        

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
    
        try {
            console.log("inside try catch");
            const response = await fetch('http://localhost:5050/emailForgotPassword/send-reset-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: forgotPasswordEmail })
            });
            console.log("after post attempt");
            const data = await response.json();
            console.log("after await")
    
            if (response.status === 200) {
                alert(data.message);
                setIsForgotPasswordPopupOpen(false);
            } else {
                alert(data.error || 'Failed to send email');
            }
        } catch (error) {
            console.error('There was an error:', error);
        }
    }
    

    useEffect(() => {
        
        const token = localStorage.getItem('authToken');
    
        if (token) { // Validate the token with the server
            validateToken(token);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={styles.userAuthentication}>
            {showLogoutMessage && (
                <div className={styles.logoutMessage}>
                    <h3>Logged Out Successfully</h3>
                </div>
            )}
            <h1 className={styles.text}>Home is Where Your Journey Begins.</h1>
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

                
                <span className={styles.buttonSectionWrapper}>
                    <button type="submit" className={styles.button}>Log In</button>
                    <input 
                        type="checkbox" 
                        id="rememberMe" 
                        name="rememberMe" 
                        checked={rememberUser} 
                        onChange={(e) => setRememberUser(e.target.checked)} 
                        className={styles.checkboxInput}
                    />
                    <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                        Remember Me
                        <span className={styles.customCheckbox}></span>
                    </label>
                </span>
            </form>
            
            <button type="button" onClick={() => navigate("/createAccount")}className={styles.account}>Don't have an Account? Click here to Create one.</button>
            <button type="button" onClick={() => setIsForgotPasswordPopupOpen(true)} className={styles.button}>Forgot Password</button>

            {isForgotPasswordPopupOpen && (
                <div className="popup">
                <h3>Forgot Password</h3>
                <form onSubmit={handleForgotPasswordSubmit}>
                    <div className="form-content">
                    <label>Email address:</label>
                    <input
                        type="email"
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        value={forgotPasswordEmail}
                    />
                    <button type="submit">Send Reset Email</button>
                    </div>
                </form>
                <button onClick={() => setIsForgotPasswordPopupOpen(false)}>Close</button>
                </div>
            )}
            <div className={styles.wave}>
                <WaveBackground />
            </div>
        </div>
    )
}

export default Login;