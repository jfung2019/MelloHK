import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { BellIcon, CameraIcon, HomeIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";

function SideBar() {
  const { authUser } = useAuthStore();
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);
  const location = useLocation();
  const currentLocation = location.pathname;

  const navItems = [
    { to: "/", icon: <HomeIcon className="size-5" />, label: "Home" },
    { to: "/notifications", icon: <BellIcon className="size-5" />, label: "Notifications" }
  ];

  return (
    <aside
      className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col min-h-[calc(100vh-4rem)] sticky top-0 transition-all duration-300 shadow-lg"
      aria-label="Sidebar Navigation"
    >
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            className={`btn btn-ghost justify-start w-full gap-3 px-4 normal-case transition-all duration-200 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-primary ${
              currentLocation === to
                ? "btn-active bg-base-300 text-primary-content shadow"
                : "hover:bg-base-300"
            }`}
            tabIndex={0}
          >
            <span className="text-primary opacity-70" title={label}>{icon}</span>
            <span className="hidden md:inline">{label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-base-300 mt-auto bg-base-300/50 backdrop-blur-sm">
        <Link
          to="/profile"
          className="flex items-center gap-3 group cursor-pointer hover:bg-base-300 p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Profile"
        >
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 relative">
              {imgLoading && (
                <LoaderCircle className="absolute animate-spin text-primary w-10 h-10" />
              )}
              {authUser?.profilePicture && !imgError ? (
                <img
                  src={authUser.profilePicture}
                  alt="Profile"
                  className={`rounded-full object-cover transition-all duration-300 ${
                    imgLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImgLoading(false)}
                  onError={() => {
                    setImgError(true);
                    setImgLoading(false);
                  }}
                />
              ) : (
                <div className="relative size-10 flex items-center justify-center bg-base-300">
                  <CameraIcon className="size-6 text-primary" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 transition-all duration-200">
            <p className="font-semibold text-sm group-hover:text-primary">
              {authUser?.name}
            </p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              Online
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

export default SideBar;