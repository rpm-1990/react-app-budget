const { initPlugin } = require('@applitools/eyes-cypress');

module.exports = (on, config) => {
  // Initialize Applitools Eyes plugin with your API key
  initPlugin({
    ...config,
    apiKey: 'jAmh9ZYGekfgXobCOGhJw1TYqnQFa111yy4PknXtebi5M110', // Replace with your actual API key
    // Other configuration options
  });

  // Return the updated Cypress config
  return config;
};