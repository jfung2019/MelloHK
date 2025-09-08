import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { BellIcon, CameraIcon, HomeIcon, LoaderCircle, UsersIcon } from "lucide-react";
import { useState } from "react";

function SideBar() {
  const { authUser } = useAuthStore();
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col min-h-[calc(100vh-4rem)] sticky top-0">
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""
            }`}>
          <HomeIcon className="size-5 text-primary opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/friends" ? "btn-active" : ""
            }`}>
          <UsersIcon className="size-5 text-primary opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/notifications" ? "btn-active" : ""
            }`}>
          <BellIcon className="size-5 text-primary opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          {authUser?.profilePicture && !imgError ?
            <div className="avatar">
              <div className="w-10 rounded-full">
                {imgLoading && (
                  <LoaderCircle className="absolute animate-spin text-primary w-10 h-10" />
                )}
                <img
                  src={authUser?.profilePicture}
                  alt="Profile"
                  className={`rounded-full w-24 h-24 object-cover transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"}`}
                  onLoad={() => setImgLoading(false)}
                  onError={() => {
                    setImgError(true);
                    setImgLoading(false);
                  }}
                />
              </div>
            </div> :
            <div className="relative size-10 flex items-center justify-center">
              <CameraIcon className="size-10" />
            </div>
          }
          <div className="flex-1">
            <div className="flex items-center gap-0.5">
              <p className="font-semibold text-sm">{authUser?.name} - </p>
              <p className="text-sm italic font-light text-base-content/70">
                {authUser?.email}
              </p>
            </div>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
