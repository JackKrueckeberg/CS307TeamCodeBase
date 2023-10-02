import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
<<<<<<< HEAD

import Preferences from "./components/preferences";
=======
import Login from "./components/login";
>>>>>>> main
 
const App = () => {
  
 return (
   <div>
<<<<<<< HEAD

    <Preferences />

    
     <Navbar />
     <Routes>
       <Route exact path="/" element={<RecordList />} />
       <Route path="/edit/:id" element={<Edit />} />
       <Route path="/create" element={<Create />} />
     </Routes>
     
=======
      <Login />
>>>>>>> main
   </div>
 );
};
 
export default App;