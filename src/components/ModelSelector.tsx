import { useState } from "react";

const models = ["Gemini Pro", "Gemini 1.5", "Gemini Ultra (soon)"];

export default function ModelSelector() {
  const [selected, setSelected] = useState(models[0]);

  return (
    <aside className="bg-zinc-900 border-r border-zinc-800 h-full w-52 px-4 py-6 flex flex-col gap-4">
      <h2 className="text-sm text-zinc-400 font-semibold">Model</h2>
      {models.map((model) => (
        <button
          key={model}
          onClick={() => setSelected(model)}
          className={`text-left px-3 py-2 rounded-lg text-sm ${
            selected === model
              ? "bg-green-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          {model}
        </button>
      ))}
    </aside>
  );
}
