import ParticlesBackground from "./components/ParticlesBackground";
import Header from "./components/Header";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      {/* background layer */}
      <ParticlesBackground />

      {/* top header with CosmaX logo */}
      <Header />

      {/* page content */}
      <Home />
    </>
  );
}
