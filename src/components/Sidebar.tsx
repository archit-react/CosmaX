import clsx from "classnames";
import { Bot } from "lucide-react";

const models = ["Gemini", "GPT-3.5", "Claude"];

type SidebarProps = {
  currentModel: string;
  setModel: (model: string) => void;
};

export default function Sidebar({ currentModel, setModel }: SidebarProps) {
  return (
    <aside className="bg-zinc-900 text-white w-48 min-h-screen border-r border-zinc-800 p-4">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Bot className="w-5 h-5 text-green-400" />
        Models
      </h2>

      <ul className="space-y-2">
        {models.map((model) => (
          <li key={model}>
            <button
              onClick={() => setModel(model)}
              className={clsx(
                "w-full text-left px-3 py-2 rounded-md transition",
                currentModel === model
                  ? "bg-green-500 text-black font-semibold"
                  : "hover:bg-zinc-700"
              )}
            >
              {model}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
