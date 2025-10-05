import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { ArrowLeft, BellIcon, LogOut, MessageSquareText, UserRoundPen } from "lucide-react";
import SettingPage from "../pages/SettingPage";

function NavBar() {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  
  return (
    <header className="bg-base-100 border-b border-base-300 w-full top-0 z-40 backdrop-blur-lg h-16 px-4">
      <div className="flex justify-between items-center h-full">
        <div className="flex gap-1 items-center">
          {/* Back arrow, only on mobile */}
          {location.pathname.startsWith("/chat/") && (
            <Link to="/chatlist" className="md:hidden" aria-label="Back to channel list">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          )}
          <Link className="flex items-center gap-2" to="/">
            <MessageSquareText className="text-primary" />
            <h1 className="text-lg font-bold">MelloHK</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {authUser && (
            <Link className="flex items-center" to="/notifications">
              <BellIcon className="text-primary" />
            </Link>
          )}
          <SettingPage />
          {authUser && (
            <>
              <Link className="flex items-center" to="/profile">
                <UserRoundPen className="text-primary" />
              </Link>
              <LogOut className="text-primary cursor-pointer" type="button" onClick={() => logout()} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar;