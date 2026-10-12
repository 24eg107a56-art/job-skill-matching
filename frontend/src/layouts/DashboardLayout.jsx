import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const DashboardLayout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="demo-banner">
        <span>Demonstration Mode Active: Seamlessly test Candidate &amp; Admin views using the top-bar role switcher.</span>
      </div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
