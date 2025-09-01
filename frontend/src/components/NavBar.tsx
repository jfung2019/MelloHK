import { Link } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { LogOut, MessageSquareText, Settings, UserRoundPen } from "lucide-react";

function NavBar() {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-300 w-full top-0 z-40 backdrop-blur-lg h-16">
        <div className="flex justify-between items-center h-full">
            <Link className="flex items-center gap-2" to="/">
              <MessageSquareText className="text-primary" />
              <h1 className="text-lg font-bold">MelloHK</h1>
            </Link>
          <div className="flex items-center gap-4">
            <Link className="flex items-center" to="/setting">
              <Settings className="text-primary" />
            </Link>
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