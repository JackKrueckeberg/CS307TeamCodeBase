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
import City_Info from './components/city-info';
import Favorites from "./components/favorites";
import CityPage from "./components/citypage";
import CompareCities from './components/compareCities';
import DeleteAccount from './components/delete-account';
import Flags from './components/strikes/flagComment';
import DiscussionHome from './components/discussionHome';
import DiscussNav from './components/discussNav';

import { UserContext } from "./contexts/UserContext";
import { CityContext, CompareCitiesProvider } from './contexts/CityContext';
 
const App = () => {
  const storedUser = sessionStorage.getItem("currentUser");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
      if (user) {
          sessionStorage.setItem("currentUser", JSON.stringify(user));
      } else {
          sessionStorage.removeItem("currentUser");
      }

      if (city) {
        sessionStorage.setItem("currentCity", JSON.stringify(city));
      } else {
        sessionStorage.removeItem("currentCity");
      }
  }, [user]);

  const setLoggedInUser = (userData) => {
      setUser(userData);
  };

  const logout = () => {
      setUser(null);
  };

    const setGlobalCity = (city) => {
        setCity(city);
    };

  const storedCity = sessionStorage.getItem("currentCity");
  const [city, setCity] = useState(storedCity ? JSON.parse(storedCity) : null);
  const [compareCities, setCompareCities] = useState([]);

    return (
        <UserContext.Provider value={{ user, setLoggedInUser, logout }}>
            <CityContext.Provider value={{city, setGlobalCity}}>
                <CompareCitiesProvider value={{ compareCities, setCompareCities }}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/view-city" element={<ViewCity />} />
                        <Route path="/preferences" element={<Preferences />} />
                        <Route path="/verification" element={<Verification />} />
                        <Route path="/createAccount" element={<CreateAccount />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/citypage" element={<CityPage />} />
                        <Route path="/compare" element={<CompareCities />} />
                        <Route path="/delete-account" element={<DeleteAccount />} />
                        <Route path="/discussionHome" element={<DiscussionHome />} />
                    </Routes>
                </CompareCitiesProvider>
            </CityContext.Provider>
        </UserContext.Provider>
    //   <Flags/>
        // <UserContext.Provider value={{ user, setLoggedInUser, logout }}>
        //     <CityContext.Provider value={{city, setGlobalCity}}>
        //         <Routes>
        //             <Route path="/" element={<Login />} />
        //             <Route path="/view-city" element={<ViewCity />} />
        //             <Route path="/preferences" element={<Preferences />} />
        //             <Route path="/verification" element={<Verification />} />
        //             <Route path="/createAccount" element={<CreateAccount />} />
        //             <Route path="/profile" element={<Profile />} />
        //             <Route path="/citypage" element={<CityPage />} />
        //             <Route path="/delete-account" element={<DeleteAccount />} />
        //         </Routes>
        //     </CityContext.Provider>
        // </UserContext.Provider>
    );
};
 
export default App;
