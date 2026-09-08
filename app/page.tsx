import { About } from "@/components/About";
import { ChatWidget } from "@/components/ChatWidget";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Listings } from "@/components/Listings";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Listings />
        <About />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
