import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ReportItem from './pages/ReportItem';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';


import Dashboard from './pages/Dashboard';

function App() {
    return (
        <div className="min-h-screen bg-[#050505]">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/how-it-work" element={<HowItWorks />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/report-item" element={<ReportItem />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/item/:id" element={<ItemDetails />} />



                </Routes>
            </main>
        </div>
    );
}

export default App;
