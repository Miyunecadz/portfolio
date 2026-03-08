import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { UserNav } from "@/components/admin/user-nav";

interface AppSidebarProps {
    user: {
        email: string;
        name: string | null;
        image: string | null;
    };
    unreadCount: number;
}

export function AppSidebar({ user, unreadCount }: AppSidebarProps) {
    return (
        <Sidebar
            collapsible="none"
            className="w-60 border-r hidden md:flex flex-col"
        >
            <SidebarHeader className="border-b px-4 py-3">
                <p className="text-sm font-semibold tracking-tight">
                    Portfolio Admin
                </p>
                <div className="mt-2">
                    <UserNav user={user} />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarNav unreadCount={unreadCount} />
            </SidebarContent>
        </Sidebar>
    );
}
