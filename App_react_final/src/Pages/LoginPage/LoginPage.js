import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory

function LoginPage() {
  const navigate = useNavigate(); // Initialize useHistory

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://192.81.209.103:3000/login', loginData);

      // Handle successful login (redirect, store tokens, etc.)
      console.log('Login successful!', response.data);

      // Redirect to DashboardPage after successful login
      navigate(`/Pages/DashboardPage?username=${loginData.username}`); // Redirect to DashboardPage route with username as a parameter
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle login error (display error message, redirect to login again, etc.)
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
 