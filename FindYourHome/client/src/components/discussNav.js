import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../Stylings/dNavStyle.module.css";
 
export default function DiscussNav() {
    return (
        <div className={styles.navSearch}>
            <nav>
                <ul>
                    <li><NavLink to="/view-city">Home</NavLink></li>
                    <li><NavLink to="/profile">Profile Page</NavLink></li>
                </ul>
            </nav>
        </div>
    );
}