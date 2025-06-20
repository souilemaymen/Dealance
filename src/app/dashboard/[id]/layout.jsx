import React from "react";
import { Dashboard } from "./Dashboard";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white-100">
      <aside>
        <Dashboard />
      </aside>
      {/*We add flex-1 to ensure it takes the remaining space */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
