import type { MainLayoutProps } from "../types/types.js";
import SideBar from "./SideBar.js";

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] gap-4">
      <div className="flex">
        <SideBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout