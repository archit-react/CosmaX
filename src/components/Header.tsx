import { useEffect, useState } from "react";
import { MonitorSmartphone, Moon, Sun } from "lucide-react";
import useTheme from "../hooks/useTheme";

export default function Header() {
  const [isOnline, setIsOnline] = useState(true);
  const { theme, toggleTheme } = useTheme();

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
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 shadow-sm text-black dark:text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold">
          <MonitorSmartphone className="w-6 h-6 text-green-500 dark:text-green-400" />
          <span className="text-green-600 dark:text-green-400">AI ChatBot</span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center text-sm font-medium gap-2 ${
              isOnline ? "text-green-500 dark:text-green-400" : "text-red-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {isOnline ? "Online" : "Offline"}
          </div>

          <button onClick={toggleTheme} className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition">
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
