import React, {useState} from 'react';
import './App.css';
import { clearUserSession } from './utils/auth';


import 
  {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
  } from "react-router-dom";



import AboutPage from './Pages/AboutPage/AboutPage';
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import LogoutPage from './Pages/LogoutPage/LogoutPage';
import SignupPage from './Pages/SignupPage/SignupPage';
import Menu from './components/Menu/Menu';
import HomePage from './Pages/HomePage/HomePage';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import ManageBudget from './Pages/ManageBudget/ManageBudget';

require('dotenv').config();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle user logout
  const handleLogout = () => {
    // Assuming you have a function to clear the token or user session
    clearUserSession(); // Implement this function accordingly
    setIsLoggedIn(false);
  };

  // Example usage of isLoggedIn to conditionally render content
  const renderContentBasedOnAuth = () => {
    if (isLoggedIn) {
      return (
        <div>
          <p>Welcome, user!</p>
          <button onClick={handleLogout}>Logout</button>
          {/* Other authenticated content */}
        </div>
      );
    } else {
      return (
        <div>
          <p>Please log in to access the content.</p>
          {/* Login form or link */}
        </div>
      );
    }
  };

  return (
    <Router className="App">
      <Menu/>
      <Hero/>
      <div className="main Container">
        
        <Routes>
          <Route path="Pages/AboutPage" element={<AboutPage/>}/>
          {/* Other routes */}

          <Route path="Pages/DashboardPage"
          element={<DashboardPage setIsLoggedIn={setIsLoggedIn} />}/>
          <Route path="Pages/HomePage" element={<HomePage/>} />
          <Route path="Pages/LoginPage" element={<LoginPage/>}/>
          <Route path="Pages/LogoutPage" 
          element={<LogoutPage handleLogout={handleLogout}/>}/>
          <Route path="Pages/SignupPage" element={<SignupPage/>}/>
          <Route path="/manage-budget" element={<ManageBudget/>} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}


export default App;
