import  { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getCurrentUser } from '@/services/auth.service';
import { AuthContext } from '@/contexts/AuthContext.tsx';

interface User {
    username: string;
}

interface NavigationItem {
    name: string;
    href: string;
}

const navigation: NavigationItem[] = [
    { name: 'Captions', href: '/captions' },
    { name: 'Countries', href: '/countries' },
];

export function DashboardHeader() {
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState<Partial<User> | null>(null);
    const location = useLocation();

    const { logout } = authContext || {};

    useEffect(() => {
        const userData = getCurrentUser();
        setUser(userData);
    }, []);

    const getPageTitle = () => {
        const currentNav = navigation.find(item => item.href === location.pathname);
        return currentNav?.name || 'Dashboard';
    };

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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/captions">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="ml-auto flex items-center gap-2 px-4 md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {getUserInitials(user?.username)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                                <p className="font-medium">{user?.username || 'User'}</p>
                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                    Online
                                </p>
                            </div>
                        </div>
                        <DropdownMenuItem onClick={logout} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}