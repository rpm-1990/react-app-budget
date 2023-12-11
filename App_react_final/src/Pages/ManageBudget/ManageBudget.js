import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory from React Router
function ManageBudget() {
  const navigate = useNavigate(); // Initialize useHistory
  const [budgetData, setBudgetData] = useState({
    username: '',
    description: '',
    amount: ''
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send budget data to the server for insertion
      const response = await axios.post('http://localhost:3000/add-budget', budgetData);

      // Handle success response
      console.log('Budget added successfully!', response.data);

      // Clear form fields after successful addition
      setBudgetData({
        username: '',
        description: '',
        amount: ''
      });

      // Redirect to the dashboard page after successful entry
      navigate('/Pages/DashboardPage');

    } catch (error) {
      // Handle error
      console.error('Error adding budget:', error);
      // Set an error state or display an error message to the user
    }
  };

  const handleInputChange = (event) => {
    // Update state based on user input
    const { name, value } = event.target;
    setBudgetData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <h2>Budget Entry Page</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={budgetData.username} onChange={handleInputChange} />
        </label>
        <label>
          Description:
          <input type="text" name="description" value={budgetData.description} onChange={handleInputChange} />
        </label>
        <label>
          Amount:
          <input type="number" name="amount" value={budgetData.amount} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ManageBudget;