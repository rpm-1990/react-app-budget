// Assuming you have Percy set up and configured in your Cypress project

describe('Signup Page', () => {
  beforeEach(() => {
    // Visit the signup page before each test
    cy.visit('http://68.183.24.210:3000/Pages/SignupPage');
  });

  it('allows user signup and performs visual regression testing', () => {
    // Fill out the signup form
    cy.get('input[name="username"]').type('user1234');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('testpassword');

    // Submit the form
    cy.get('form').submit();

    // Check for successful redirection after signup (assuming it redirects to '/Pages/HomePage' after successful signup)
    cy.url({ timeout: 100000 }).should('include', '/Pages/HomePage');

    // Wait for any animations or dynamic content to stabilize
    cy.wait(1000); // Adjust this wait time if needed

    // Use Percy to take a snapshot of the page after signup
    cy.percySnapshot('Signup Page After Signup');
  });
});
