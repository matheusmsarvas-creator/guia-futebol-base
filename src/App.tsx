import Header from "./components/Header";
import Hero from "./components/Hero";
import Facts from "./components/Facts";
import Features from "./components/Features";
import Audience from "./components/Audience";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import StickyCta from "./components/StickyCta";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Facts />
        <Features />
        <Audience />
        <CtaSection />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
