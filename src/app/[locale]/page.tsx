import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import clientPromise from "@/lib/mongodb";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { InfluencerSection } from "@/components/sections/InfluencerSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { Footer } from "@/components/layout/Footer";
import { ContactBanner } from "@/components/sections/ContactBanner";

export default async function Home() {
  // Read all homepage settings together instead of four browser requests.
  const settings = await clientPromise.then(client =>
    client.db('shiyastudio').collection('settings').find(
      { type: { $in: ['hero', 'services', 'influencer', 'clients'] } },
      { projection: { _id: 0, updatedAt: 0 } }
    ).toArray()
  ).catch(error => {
    console.error('Failed to load homepage settings', error);
    return [];
  });
  const data = Object.fromEntries(settings.map(setting => [setting.type, JSON.parse(JSON.stringify(setting))]));
  return (
    <main className="relative min-h-screen bg-black">
      {/* Navigation */}
      <Navbar overlay />

      {/* Main Hero Section */}
      <HeroSection initialData={data.hero ?? {}} />

      {/* Services/Grow Section */}
      <div id="home-services" className="scroll-mt-20"><ServicesSection initialData={data.services ?? {}} /></div>

      {/* Influencer Marketing & Commerce Section */}
      <InfluencerSection initialData={data.influencer ?? {}} />

      {/* Clients Logo Showcase Section */}
      <ClientsSection initialData={data.clients ?? {}} />

      {/* Final Premium Footer */}
      <ContactBanner />
      <Footer showCta={false} />
    </main>
  );
}
