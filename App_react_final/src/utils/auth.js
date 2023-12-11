// auth.js

// Function to clear user session
export const clearUserSession = () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('token');
      // You can also clear any other user-related data or session information here
      // For example:
      // localStorage.removeItem('userData');
    } catch (error) {
      console.error('Error clearing user session:', error);
      // Handle any errors that may occur during logout
      // For instance, display an error message or perform fallback actions
    }
  };