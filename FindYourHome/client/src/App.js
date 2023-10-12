import React from "react";

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

//We import any contexts used
import { UserProvider } from "./contexts/UserContext";
 
const App = () => {
  
 return (
  <UserProvider> {/* Keep this and put your stuff inside here to access current logged in user information*/}
    <Profile />
  </UserProvider>
 );
};
 
export default App;