import { Outlet } from "react-router-dom";
import Siderbar from "../components/Siderbar";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-slate-100">

            <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white shadow-md">
                <Siderbar />
            </aside>

            <main className="ml-64 flex-1">
                <Outlet />
            </main>

        </div>
    );
}