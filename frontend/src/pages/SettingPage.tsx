import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/store";
import { THEMES } from "../constants/themes";
import { useState } from "react";
import { createPortal } from "react-dom";

function SettingPage() {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);

  const modalContent = (
    <div data-theme={theme}>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)}></div>
        {/* Modal content */}
        <div className="z-[100000] bg-base-200 text-base-content px-2 py-4 rounded shadow-lg flex flex-col items-center min-w-96">
          <h3 className="font-bold text-lg mb-4">Choose Theme</h3>
          <ul className="menu p-0 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto w-full">
            {THEMES.map((themeItem, i) => (
              <button
                key={i}
                className={`flex gap-2 justify-start items-center btn btn-ghost w-full ${theme === themeItem.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}`}
                onClick={() => { setTheme(themeItem.name) }}
              >
                <PaletteIcon className="text-primary" />
                <span>{themeItem.label}</span>
                <div className="flex flex-row gap-1 px-2 py-2 bg-base-300 rounded ml-auto">
                  {themeItem.colors.map((color, idx) => (
                    <div key={idx} className="w-4 h-4 rounded-full border border-base-100" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </button>
            ))}
          </ul>
          <div className="modal-action mt-4 w-full flex justify-center">
            <button className="btn" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center">
      {/* Trigger button */}
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen(true)}
        aria-label="Open theme settings"
      >
        <PaletteIcon className="text-primary" />
      </button>
      {open && createPortal(modalContent, document.getElementById("modal-root")!)}
    </div>
  );
}

export default SettingPage;