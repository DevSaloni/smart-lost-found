import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from "../components/HeroSection"
import StatsBar from "../components/StatsBar"
import ProcessSteps from "../components/ProcessSteps";
import FeaturesSection from "../components/FeaturesSection"
import SafetySection from "../components/SafetySection"
import CTASection from "../components/CTASection"
import Footer from "../components/Footer"

const Home = () => {
    const navigate = useNavigate();

    // Removed automatic redirect to /dashboard so users can access Home page
    return (
        <div>
            <HeroSection />
            <StatsBar />
            <ProcessSteps />
            <FeaturesSection />
            <SafetySection />
            <CTASection />
            <Footer />
        </div>
    )
}

export default Home