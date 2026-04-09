"use client";

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { InfluencerSection } from "@/components/sections/InfluencerSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* Navigation */}
      <Navbar />

      {/* Main Hero Section */}
      <HeroSection />

      {/* Projects Showcase Section */}
      <ProjectsSection />

      {/* Services/Grow Section */}
      <ServicesSection />

      {/* Influencer Marketing & Commerce Section */}
      <InfluencerSection />

      {/* Clients Logo Showcase Section */}
      <ClientsSection />

      {/* Final Premium Footer */}
      <Footer />
</main>
  );
}
