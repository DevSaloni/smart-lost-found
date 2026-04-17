import React from 'react'
import HeroSection from "../components/HeroSection"
import StatsBar from "../components/StatsBar"
import ProcessSteps from "../components/ProcessSteps";

import FeaturesSection from "../components/FeaturesSection"
import SafetySection from "../components/SafetySection"
import CTASection from "../components/CTASection"
import Footer from "../components/Footer"

const Home = () => {
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