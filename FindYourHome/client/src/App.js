import React, { useState, useEffect } from 'react';

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import Login from "./components/login";
import ViewCity from "./ViewCity";
import Verification from "./components/verification";
import CreateAccount from "./components/createAccount";
import Profile from "./components/profile";
import Preferences from "./components/preferences";
import Favorites from "./components/favorites";
import DiscussionHome from "./components/discussionHome";
import { UserContext } from "./contexts/UserContext";
 
const App = () => {
  const storedUser = sessionStorage.getItem("currentUser");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
      if (user) {
          sessionStorage.setItem("currentUser", JSON.stringify(user));
      } else {
          sessionStorage.removeItem("currentUser");
      }
  }, [user]);

  const setLoggedInUser = (userData) => {
      setUser(userData);
  };

  const logout = () => {
      setUser(null);
  };

    return (
        <UserContext.Provider value={{ user, setLoggedInUser, logout }}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/view-city" element={<ViewCity />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/discussion-home" element={<DiscussionHome />} />
            </Routes>
        </UserContext.Provider>
    );
};
 
export default App;