import React from 'react';

import { Link }  from "react-router-dom";

function Menu() {
  const handleLoginClick = () => {
    // Make an HTTP POST request to the server when the Login button is clicked
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: 'sql5668868',
        password: 'ZkTjqqbexB',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Handle the response from the server
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  return (
    <nav className='menu'>
      <div>
        <ul>
          <li><Link to="/Pages/HomePage">Home</Link></li> 
          <li><Link to="Pages/AboutPage">About</Link></li>
          <li><Link to="Pages/LoginPage" onClick={handleLoginClick}>Login</Link></li> 
          <li><Link to="Pages/SignupPage">Signup</Link></li>

        </ul>
      </div>
    </nav>
  );
}

export default Menu;