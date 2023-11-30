import React, { useState, useEffect } from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes, useLocation } from "react-router-dom";

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
import City_Info from "./components/city-info";
import Favorites from "./components/favorites";
import CityPage from "./components/citypage";
import MessageList from "./components/messageList";
import CompareCities from "./components/compareCities";
import Feedback from "./components/feedback";
import DeleteAccount from "./components/delete-account";
import Flags from "./components/strikes/flagComment";
import DiscussionHome from "./components/discussionHome";
import Disc from "./components/disc";
import TwoFactor from "./components/twofactor";
import { NavigationProvider, useNavigationContext } from "./contexts/NavigationContext";
import { UserContext } from "./contexts/UserContext";
import { CityContext, CompareCitiesProvider } from "./contexts/CityContext";
import MessageNotification from "./components/messageNotification";
import AccountInfo from "./components/accountInfo";
import { AnimatePresence } from "framer-motion";
import Notifications from './components/notifications';
import PropertyList from "./components/properties/properties";
import RecoverAccount from "./components/recover-account";

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
  const location = useLocation();

  const NavigationHandler = () => {
    const location = useLocation();
    const { setIsNavigated } = useNavigationContext();
  
    useEffect(() => {
      setIsNavigated(true);
    }, [location, setIsNavigated]);
  
    return null; // This component does not render anything
  };
  

  return (
    <NavigationProvider>
    <NavigationHandler />
    <UserContext.Provider value={{ user, setLoggedInUser, logout }}>
      <CityContext.Provider value={{ city, setGlobalCity }}>
        <CompareCitiesProvider value={{ compareCities, setCompareCities }}>
          <AnimatePresence>
            <Routes key={location.pathname} location={location}>
              <Route path="/" element={<Login />} />
              <Route path="/view-city" element={<ViewCity />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/profile/favorite-search/preferences" element={<Preferences />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/createAccount" element={<CreateAccount />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/accountInfo" element={<AccountInfo />} />
              <Route path="/citypage" element={<CityPage />} />
              <Route path="/profile/favorite-city/citypage/:city" element={<CityPage />} />
              <Route path="/profile/message-board/citypage/:city" element={<CityPage />} />
              <Route path="/view-city/citypage/:city" element={<CityPage />} />
              <Route path="/preferences/citypage/:city" element={<CityPage />} />
              <Route path="/compare" element={<CompareCities />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/discussionHome" element={<DiscussionHome />} />
              <Route path="/TwoFactor" element={<TwoFactor />} />
              <Route path="/disc" element={<Disc />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/properties" element = {<PropertyList/>}/>
              <Route path="/recover-account" element = {<RecoverAccount/>}/>
            </Routes>
          </AnimatePresence>
        </CompareCitiesProvider>
      </CityContext.Provider>
    </UserContext.Provider>
    </NavigationProvider>
  );
};

export default App;