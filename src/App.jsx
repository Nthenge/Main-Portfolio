import { SectionProvider } from "./context/SectionContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <SectionProvider>
      <Navbar />
      <Hero />
      <Work />
      <Services />
      <About />
      <Contact />
    </SectionProvider>
  );
}

export default App;
