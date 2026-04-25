import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ReportItem from './pages/ReportItem';
import Browse from './pages/Browse';
import MatchDetails from './pages/MatchDetails';
import ItemDetails from './pages/ItemDetails';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

function AppContent() {
    const { user } = useAuth();
    
    return (
        <SocketProvider user={user}>
            <div className="min-h-screen bg-[#050505]">
                <Toaster position="top-right" reverseOrder={false} />
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
                        <Route path="/match-details/:matchId" element={<MatchDetails />} />
                        <Route path="/item/:id" element={<ItemDetails />} />
                    </Routes>
                </main>
            </div>
        </SocketProvider>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId="136383796213-68mi7lq95c90iug44tuoq5a4jjkhjct4.apps.googleusercontent.com">
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
