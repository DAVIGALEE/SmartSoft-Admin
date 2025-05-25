import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {DashboardSidebar} from "@/components/DashboardSidebar.tsx";
import {DashboardHeader} from "@/components/DashboardHeader.tsx";

export const DashboardLayout = () => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <DashboardHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};