import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Captions,
    Globe,
    LogOut,
    User,
    ChevronRight
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentUser } from '@/services/auth.service';
import { AuthContext } from '@/contexts/AuthContext.tsx';

interface User {
    username: string;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
    { name: 'Captions', href: '/captions', icon: Captions },
    { name: 'Countries', href: '/countries', icon: Globe },
];

export function DashboardSidebar() {
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState<Partial<User> | null>(null);
    const location = useLocation();

    const { logout } = authContext || {};

    useEffect(() => {
        const userData = getCurrentUser();
        setUser(userData);
    }, []);

    const getUserInitials = (username?: string) => {
        if (!username) return 'U';
        return username
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-border">
                <div className="flex items-center gap-3 px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-sm font-semibold">D</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">Dashboard</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.href;

                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className="w-full"
                                        >
                                            <a href={item.href} className="flex items-center gap-3">
                                                <Icon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarFallback className="rounded-lg">
                                            {getUserInitials(user?.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                          {user?.username || 'User'}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                          Online
                                        </span>
                                    </div>
                                    <ChevronRight className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem onClick={logout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}