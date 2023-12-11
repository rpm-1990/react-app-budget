import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the correct text', () => {
    render(<Footer />);
    const expectedText = 'Website for final project testing purposes only submission by P M Reddy.';
    // Use getByText to find the text content within the rendered Footer component
    const footerElement = screen.getByText(expectedText);
    // Assert that the expected text content is present in the Footer component
    expect(footerElement).toBeInTheDocument();
  });
});


