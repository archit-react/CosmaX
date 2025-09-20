import { useEffect, useState } from "react";
import CosmaXLogo from "../components/CosmaXLogo"; // import your new logo

export default function Header() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1117] border-b border-zinc-800 shadow-sm text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3 text-xl font-bold">
          <CosmaXLogo className="h-10 w-auto" />
          <span className="tracking-wide">CosmaX</span>
        </div>

        {/* Right: Online/Offline indicator */}
        <div
          className={`flex items-center text-sm font-medium gap-2 ${
            isOnline ? "text-green-400" : "text-red-500"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </header>
  );
}
