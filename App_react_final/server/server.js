const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
//require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;
//const JWT_SECRET = process.env.JWT_SECRET; // Access the secret key from environment variables

// Generate JWT Secret Key using crypto module
function generateJWTSecretKey() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  const JWT_SECRET = generateJWTSecretKey(); // Generate the JWT Secret Key
  

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create MySQL database connection
const db = mysql.createConnection({
  host            : 'sql5.freemysqlhosting.net',
  user            : 'sql5668868',
  password        : 'ZkTjqqbexB',
  database        : 'sql5668868'
});
/*var pool  = mysql.createPool({
  connectionLimit : 10,
  host: 'sql5.freemysqlhosting.net',
  user: 'sql5668868',
  password: 'ZkTjqqbexB',
  database: 'sql5668868'
});*/

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    // Handle the error here or retry the connection
    // For example, retry connecting after a delay
    setTimeout(() => {
      db.connect();
    }, 5000); // Retry after 5 seconds
  } else {
    console.log('Connected to the MySQL database');
  }
});


// Endpoint to retrieve budget data for the logged-in user from the 'Budget' table
app.get('/budget', (req, res) => {
    const { username } = req.query; // Get the username from the request query parameter
  
    const sql = 'SELECT description, amount FROM Budget WHERE username = ?'; // Filter by username
    db.query(sql, [username], (err, result) => {
      if (err) {
        console.error('Error fetching budget data:', err);
        res.status(500).json({ message: 'Error fetching budget data' });
      } else {
        res.status(200).json({ Budget: result });
      }
    });
  });

// Endpoint to handle user registration
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  console.log(`Received user data - Username: ${username}, Email: ${email}, Password: ${password}`);

  // Insert user data into the database
  const sql = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Error registering user' });
    } else {
      console.log('User registered successfully');
      res.status(200).json({ message: 'User registered successfully' });
    }
  });
});

// Endpoint to handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check user credentials against the database
  const sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ message: 'Error logging in' });
    } else {
      if (result.length > 0) {
        console.log('Login successful');
        
        // Generate a JWT token
        const tokens = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful' });

      } else {
        console.log('Invalid credentials');
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  });
});

// Endpoint to fetch username from the MySQL database
app.get('/username', (req, res) => {
    const { username } = req.body; // Assuming you're sending the username from the frontend
  
    // Query the database to get the username based on the provided username
    const sql = 'SELECT username FROM Users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
      if (err) {
        console.error('Error fetching username:', err);
        res.status(500).json({ message: 'Error fetching username' });
      } else {
        if (result.length > 0) {
          const fetchedUsername = result[0].username; // Assuming the username is in the first row
          res.status(200).json({ username: fetchedUsername });
        } else {
          res.status(404).json({ message: 'Username not found' });
        }
      }
    });
  });

// Endpoint to handle user logout
app.post('/logout', (req, res) => {
res.status(200).json({ message: 'User logged out successfully' });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
  
    if (token === undefined) {
      return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Access denied. Invalid token.' });
      }
      req.username = decoded.username;
      next();
    });
  }
  
 // Endpoint for the dashboard page accessible only after authentication
app.get('/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Access to dashboard granted.' });
  }); 


// Endpoint to update budget data in the 'Budget' table
app.put('/update-budget', (req, res) => {
  const { budgetId, newAmount } = req.body;

  const sql = 'UPDATE Budget SET amount = ? WHERE id = ?';
  db.query(sql, [newAmount, budgetId], (err, result) => {
    if (err) {
      console.error('Error updating budget data:', err);
      res.status(500).json({ message: 'Error updating budget data' });
    } else {
      console.log('Budget data updated successfully');
      res.status(200).json({ message: 'Budget data updated successfully' });
    }
  });
});

// Endpoint to insert new or update existing budget data into the 'Budget' table
app.post('/add-budget', (req, res) => {
    const { username, description, amount } = req.body;
  
    // Check if the same {username, description} pair exists in the database
    const checkIfExistsQuery = 'SELECT * FROM Budget WHERE username = ? AND description = ?';
    db.query(checkIfExistsQuery, [username, description], (err, result) => {
      if (err) {
        console.error('Error checking existing budget data:', err);
        res.status(500).json({ message: 'Error checking existing budget data' });
      } else {
        if (result.length > 0) {
          // If the same pair exists, update the 'amount' value
          const updateQuery = 'UPDATE Budget SET amount = ? WHERE username = ? AND description = ?';
          db.query(updateQuery, [amount, username, description], (err, updateResult) => {
            if (err) {
              console.error('Error updating existing budget data:', err);
              res.status(500).json({ message: 'Error updating existing budget data' });
            } else {
              console.log('Budget data updated successfully');
              res.status(200).json({ message: 'Budget data updated successfully' });
            }
          });
        } else {
          // If the pair does not exist, insert new budget data
          const insertQuery = 'INSERT INTO Budget (username, description, amount) VALUES (?, ?, ?)';
          db.query(insertQuery, [username, description, amount], (err, insertResult) => {
            if (err) {
              console.error('Error adding new budget data:', err);
              res.status(500).json({ message: 'Error adding new budget data' });
            } else {
              console.log('New budget data added successfully');
              res.status(200).json({ message: 'New budget data added successfully' });
            }
          });
        }
      }
    });
  });

// Endpoint to delete specific budget data from the 'Budget' table
app.delete('/delete-budget/:id', (req, res) => {
  const budgetId = req.params.id;

  const sql = 'DELETE FROM Budget WHERE id = ?';
  db.query(sql, [budgetId], (err, result) => {
    if (err) {
      console.error('Error deleting budget data:', err);
      res.status(500).json({ message: 'Error deleting budget data' });
    } else {
      console.log('Budget data deleted successfully');
      res.status(200).json({ message: 'Budget data deleted successfully' });
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});