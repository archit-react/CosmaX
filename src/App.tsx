import ParticlesBackground from "./components/ParticlesBackground";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      {/* background layer */}
      <ParticlesBackground />

      {/* page content */}
      <Home />
    </>
  );
}
