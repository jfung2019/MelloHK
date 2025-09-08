import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/store";
import { THEMES } from "../constants/themes";

function SettingPage() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center">
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-ghost btn-circle"><PaletteIcon className="text-primary" /></label>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-80 grid grid-cols-1 gap-2 right-0 max-h-64 overflow-y-auto">
          {THEMES.map((themeItem, i) =>
            <button key={i} className={`flex gap-2 justify-start items-center btn btn-ghost w-full ${theme === themeItem.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}`} onClick={() => setTheme(themeItem.name)}>
              <PaletteIcon className="text-primary" />
              <span>{themeItem.label}</span>
              <div className="flex flex-row gap-1 px-2 py-2 bg-base-300 rounded ml-auto">
                {themeItem.colors.map((color, idx) => (
                  <div key={idx} className="w-4 h-4 rounded-full border border-base-100" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          )}
        </ul>
      </div>
    </div>
  )
}

export default SettingPage;