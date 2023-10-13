import React, { useState, useRef } from 'react';
import styles from '../Stylings/createAccountStyle.module.css'; 
import { Collapse } from 'bootstrap';

export default function CreateAccount() {
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    });  
    const [showPassword, setShowPassword] = useState(false);
    const timeoutRef = useRef(null);
    
    // const submission = (e) => {
    //     e.preventDefault();
    // }

    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    const isValidForm = () => {
        if (!form.username.trim() || !form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
            return false;
        }
        return true;
    };

    async function handleFormSubmit(event) {
        event.preventDefault();
    
        if (!isValidForm()) {
            alert("All fields marked with * are required.");
            return;
        }

        const newAccount = { ...form };

        await fetch("http://localhost:5050/usersData/users", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newAccount),
        }).catch (error => {
            window.alert(error);
            return;
        });

        setForm({username: "", firstName: "", lastName: "", email: "", password: ""});
    }

    return (
        <div className={styles.accountCreation}>
            <h1>Start Your Journey Here.</h1>
            <form onSubmit={handleFormSubmit} className={styles.form}>
                <label htmlFor="username" className={styles.label}>Username*</label>
                <input 
                    value={form.username} 
                    name="username" 
                    id="username" 
                    placeholder='Username' 
                    onChange={(e) => updateForm({ username: e.target.value})} 
                />
                {/* Name and email details form */}
                <label htmlFor="firstName"  className={styles.label}>Name*</label>
                <input 
                    value={form.firstName} 
                    name="firstName" 
                    id="firstName" 
                    placeholder='First Name' 
                    onChange={(e) => updateForm( {firstName: e.target.value})} 
                />
                <label htmlFor="lastName" classname={styles.label}></label>
                <input 
                    value={form.lastName} 
                    name="lastName" 
                    id="lastName"
                    placeholder='Last Name'   
                    onChange={(e) => updateForm({lastName: e.target.value})} 
                />
                <label htmlFor="email" className={styles.label}>Email*</label>
                <input 
                    value={form.email} 
                    placeholder='youremail@gmail.com'
                    onChange={(e) => updateForm({email: e.target.value})} 
                    type="email"
                    id="email" 
                />

                {/* Password accaptance form */}
                <div className={styles.passwordEntryWrapper}>
                    <label htmlFor="password"  className={styles.label}>Password*</label>
                    <input 
                        value={form.password} 
                        onChange={(e) => updateForm({password:e.target.value})} 
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required
                        type={showPassword ? "text" : "password"} 
                        id="password"
                    />
                </div>
                <button type="submit"  className={styles.button}>Register</button>
            </form>

            <button id="login">Already have an Account?  Click here to log in.</button>
        </div>
    )
}

export default CreateAccount;