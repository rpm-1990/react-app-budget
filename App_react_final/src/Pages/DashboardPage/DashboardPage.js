import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';
import { clearUserSession } from '../../utils/auth';
//import { setIsLoggedIn } from '../../App';

import { Link, useNavigate,useLocation } from 'react-router-dom'; // Import Link,useNavigate from React Router

function DashboardPage({ setIsLoggedIn}) { 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const usernameParam = queryParams.get('username');
  
  const [username, setUsername] = useState(usernameParam || '');

  

  const navigate = useNavigate(); // Initialize navigate function
  const [logoutInitiated, setLogoutInitiated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupExpired, setPopupExpired] = useState(false);
  //const [username, setUsername] = useState('');

  const [authenticated, setAuthenticated] = useState(true); // Set initial state as authenticated or implement your logic
  
  // Function to fetch username from backend API
  /*const fetchUsername = async () => {
    try {
      // Make a GET request to the backend API to fetch the username
      const response = await axios.get('/username'); // Replace '/api/getUsername' with your actual backend API endpoint

      // Assuming the response contains the username data
      const fetchedUsername = response.data.username; // Replace 'username' with the actual field name

      setUsername(fetchedUsername);
    } catch (error) {
      console.error('Error fetching username:', error);
      // Handle error fetching username
    }
  };*/

  
  
  
  // Function to handle logout
  const handleLogout = async () => {
      try {
        
        // Assuming you have a function to clear the token or user session
    clearUserSession(); // Implement this function accordingly
    setIsLoggedIn(false);
        /*await axios.post('/logout');
        //setLogoutInitiated(true); // Set logout initiated to true on logout button click
          if no authentication is being used*/
        // Redirect to the 'LogoutPage'
        navigate('/Pages/LogoutPage');
      } catch (error) {
        console.error('Error logging out:', error);
      }
  };

  
  const [datasource, setDatasource] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56', '#ff0000', '#0000ff', '#4d5791', '#a52a2a', '#8a2be2', '#ffebcd'
        ],
      },
    ],
    labels: [],
  });

  const [expenseLimit, setExpenseLimit] = useState(300); // State to hold the expense limit

  let myChartRef = useRef(null);
  let d3ChartRef = useRef(null);
  let d3ChartCreated = useRef(false); // Track if D3 chart is created

  const createD3Chart = () => {
    if (!d3ChartCreated.current && datasource.labels.length > 0 && datasource.datasets[0].data.length > 0 && myChartRef.current) {
      const width = 300;
      const height = 300;
      const radius = Math.min(width, height) / 2;
  
      const chartInstance = myChartRef.current; // Access the Chart.js instance  


      // Extract dataset colors from the Chart instance
    const chartJsColors = chartInstance.data.datasets[0].backgroundColor;

      const color = d3.scaleOrdinal()
        .domain(datasource.labels.map(label => label.toString()))
        .range(chartJsColors);
  
      const svg = d3.select(d3ChartRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
  
      const pie = d3.pie().value(d => d);
  
      const data = pie(datasource.datasets[0].data);
  
      const arc = d3.arc()
        .innerRadius(radius - 70)
        .outerRadius(radius);
  
      svg.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(datasource.labels[i].toString())); // Use labels for coloring
  
      svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => d.data); // Display expenditure value as text
  
      d3ChartCreated.current = true; // Set to true after creation
    }
  };

  const createBarGraph = () => {
    const ctx = document.getElementById("barGraph").getContext("2d");
    const fixedLimit = expenseLimit; // Set your fixed limit here

    // Check if a Chart instance exists on the canvas and destroy it
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    const savingsData = datasource.datasets[0].data.map(expense => {
      const savedAmount = fixedLimit - expense;
      return savedAmount;
    });

    const backgroundColors = savingsData.map(savedAmount => {
      return savedAmount < 0 ? 'red' : savedAmount > 0 ? 'green' : '';
    });

    const labels = ['Excess Spending', 'Amount Saved', 'Budget OK'];

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datasource.labels,
        datasets: [{
          label: 'Comparison with Fixed Limit',
          data: savingsData,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            ticks: {
              callback: value => {
                if (value < 0) {
                  return `-$${Math.abs(value)}`;
                } else {
                  return `$${value}`;
                }
              }
            }
          },
          x: {
            stacked: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: context => {
                const value = context.raw;
                if (value < 0) {
                  return `Exceeded Amount: $${Math.abs(value)}`;
                } else {
                  return `Saved Amount: $${value}`;
                }
              }
            }
          },
          legend: {
            onClick: (e, legendItem, legend) => {
              if (legend.chart && legend.chart.getDatasetMeta(0)) {
                const index = legendItem.datasetIndex;
                const meta = legend.chart.getDatasetMeta(0);
                const metaIndex = meta.data.findIndex(data => data._index === index);
                if (metaIndex !== -1) {
                  const element = meta.data[metaIndex];
                  Chart.defaults.global.legend.onClick.call(legend, e, element);
                }
              }
            },
            labels: {
              generateLabels: chart => {
                if (chart.data.datasets.length) {
                  return labels.map((label, index) => {
                    let backgroundColor = '';
                    if (index === 0) {
                      backgroundColor = 'red';
                    } else if (index === 1) {
                      backgroundColor = 'green';
                    } else {
                      backgroundColor = 'white';
                    }
                    return {
                      text: label,
                      fillStyle: backgroundColor,
                      hidden: false,
                      index: index
                    };
                  });
                }
                return [];
              }
            }
          }
        }
      }
    });
  };


  const getBudgetFromDatabase = () => {
  axios.get(`http://localhost:3000/budget?username=${username}`)
    .then(response => {
      const budgetData = response.data.Budget;

      const updatedDatasource = {
        datasets: [{
          data: budgetData.map(item => item.amount),
          backgroundColor: ['#ffcd56', '#ff0000', '#0000ff', '#4d5791', '#a52a2a', '#8a2be2', '#ffebcd'],
        }],
        labels: budgetData.map(item => item.description || 'No Description'), // Use description as labels
      };

      setDatasource(updatedDatasource);
    })
    .catch(error => {
      console.error('Error fetching budget data:', error);
      // Handle error fetching budget data
    });
};


  /*const getBudgetFromDatabase = () => {
    axios.get('http://localhost:3000/budget')
      .then(response => {
        const budgetData = response.data.Budget;
  
        const updatedDatasource = {
          datasets: [{
            data: budgetData.map(item => item.amount),
            backgroundColor: ['#ffcd56', '#ff0000', '#0000ff', '#4d5791', '#a52a2a', '#8a2be2', '#ffebcd'],
          }],
          labels: budgetData.map(item => item.description || 'No Description'), // Use description as labels
        };
  
        setDatasource(updatedDatasource);
      })
      .catch(error => {
        console.error('Error fetching budget data:', error);
        // Handle error fetching budget data
      });
  };*/

  // Function to initialize the chart and D3 graph
  const initializeVisualizations = () => {
    createChart();
    createD3Chart();
    createBarGraph();
  };

  
  const createChart = () => {
    if (myChartRef.current) {
      myChartRef.current.destroy(); // Destroy existing Chart if it exists
    }
    const ctx = document.getElementById("myChart").getContext("2d");
    myChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: datasource,
      options: {
        maintainAspectRatio: false, // To control the chart's aspect ratio
        plugins: {
          legend: {
            labels: {
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const dataset = data.datasets[0];
                    const value = dataset.data[i];
                    const color = dataset.backgroundColor[i];
                    if (value !== undefined && label !== undefined) {
                      return {
                        text: `${label}: ${value}`, // Display label and value
                        fillStyle: color,
                        hidden: false,
                        index: i
                      };
                    }
                    return null;
                  }).filter(label => label !== null);
                }
                return [];
              }
            }
          }
        }
      }
    });
  };
  

  // Handler function to update expense limit based on user input
  const handleExpenseLimitChange = (event) => {
    const newLimit = parseFloat(event.target.value);
    if (!isNaN(newLimit) && newLimit > 0) {
      setExpenseLimit(newLimit);
    } else {
      console.error('Invalid expense limit value');
    }
  };

  useEffect(() => {
    if (usernameParam) {
      // If username is available in URL parameter, update the state
      setUsername(usernameParam);
    } //else {
      //fetchUsername();
  //  }
  }, [usernameParam]);
  useEffect(() => {
    let sessionTimer;
    let popupTimer;

    const resetSessionTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        setShowPopup(true);
        popupTimer = setTimeout(() => {
          setPopupExpired(true);
        }, 40000); // 40 seconds
      }, 40000); // 40 seconds
    };
  
    const handleUserInteraction = () => {
      clearTimeout(popupTimer);
      setPopupExpired(false);
      resetSessionTimer();
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserInteraction);
    });

    resetSessionTimer();

    return () => {
      clearTimeout(sessionTimer);
      clearTimeout(popupTimer);
      events.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  const handlePopupResponse = (renew) => {
    setShowPopup(false);
    if (renew) {
      setPopupExpired(false);
    } else {
      setLogoutInitiated(true);
    }
  };

  useEffect(() => {
    if (popupExpired) {
      setLogoutInitiated(true);
    }
  }, [popupExpired]);

  useEffect(() => {
    if (logoutInitiated) {
      navigate('/Pages/LogoutPage');
    }
  }, [navigate, logoutInitiated]);

  useEffect(() => {
    getBudgetFromDatabase();
  }, []);

  useEffect(() => {
    initializeVisualizations();
  }, [datasource]);

  useEffect(() => {
    createBarGraph();
  }, [expenseLimit, datasource]);

 useEffect(() => {
    createChart();
    createD3Chart();
    createBarGraph();
  }, [datasource]); 

  useEffect(() => {
    let timeout;
    if (logoutInitiated) {
      // Redirect to HomePage after 20 seconds only if logout is initiated
      timeout = setTimeout(() => {
        navigate('/Pages/HomePage');
      }, 20000);
    }
    return () => clearTimeout(timeout);
  }, [navigate, logoutInitiated]);

  /*useEffect(() => {
    // Fetch username when the component mounts
    fetchUsername();
  }, []);*/



  return (
    <div className="container center">
      <div className="page-area">

        {/* Popup for session expiration */}
      {showPopup && !popupExpired && (
        <div className="alert">
          <p>Would you like to renew your session?</p>
          <button onClick={() => handlePopupResponse(true)}>Yes</button>
          <button onClick={() => handlePopupResponse(false)}>No</button>
        </div>
      )}
        <div className="text-box">
        <h3>Welcome {username ? `user ${username}` : 'user'}</h3>
          <h3>Visualization_1. ChartJs expenditure reasons with a legend</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <canvas id="myChart" width="300" height="300" style={{ margin: '10px' }}></canvas>
          </div>
        </div>

        <article>
          <h3>Visualization_2. D3Chart expense amount categorized by description (in $)</h3>
          {/* Categorized by the description */}
          <div ref={d3ChartRef} style={{ width: '300px', height: '300px', margin: '50px' }}></div>
        </article>

        <div className="bar-graph">
          <h3>Visualization_3. Bar Graph Amount saved compared to fixed expense limit</h3>
          {/* Try to update in such a way that the expense limit is set by the user */}
         
          <div>
            <label htmlFor="expenseLimit">Enter Expense Limit: </label>
            <input
              type="number"
              id="expenseLimit"
              value={expenseLimit}
              onChange={handleExpenseLimitChange}
            />
          </div>

          <canvas id="barGraph" width="300" height="200" style={{ margin: '10px' }}></canvas>
        </div>
        <div className="container center">
     
      {/* Other components and content */}
      <button onClick={() => handlePopupResponse(false)}>Logout</button> 
        {/* You can add more components, content, or buttons here */}
        <Link to="/manage-budget">
          <button>Enter/Modify Budget</button>
        </Link>

        </div>
      </div>
    </div>
  );
  }

export default DashboardPage;


