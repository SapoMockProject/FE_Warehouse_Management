import { SidebarComponent } from "../components/Sidebar/SidebarComponent";
import { HeaderComponent } from "../components/Header/HeaderComponent";
import { Outlet } from "react-router-dom";
import "./DefaultLayout.css";

export const DefaultLayout = () => {
  return (
    <div className="default-layout-container">
      <aside className="default-layout-sidebar">
        <SidebarComponent />
      </aside>

      <div className="default-layout-main-content">
        <header className="default-layout-header">
          <HeaderComponent />
        </header>

        <main className="default-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
