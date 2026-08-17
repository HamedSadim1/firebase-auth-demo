import React, { useState } from "react";
import { SunIcon, MoonIcon } from "./index";

export const DarkModeToggle: React.FC = () => {
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={() => setActive((prev) => !prev)}
      className="absolute top-6 right-6 p-3 rounded-full border border-panel-line bg-panel hover:bg-panel-line/30 transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label="Thema wisselen"
    >
      {active ? (
        <SunIcon className="w-5 h-5 text-amber" />
      ) : (
        <MoonIcon className="w-5 h-5 text-muted" />
      )}
    </button>
  );
};
