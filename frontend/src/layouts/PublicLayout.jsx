import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="demo-banner">
        <span>Portfolio Demonstration Mode: JobSkillMatch analyzes candidate profiles, skill matrices, and resumes.</span>
      </div>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
