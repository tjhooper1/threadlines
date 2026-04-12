"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
    LayoutDashboard,
    Clock,
    Layers,
    CalendarDays,
    Fingerprint,
    Brain,
    Image,
    Sparkles,
    BarChart3,
    FileText,
    Settings,
    LogOut,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/(auth)/actions";

const navItems = [
    { title: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { title: "Timeline", href: "/app/timeline", icon: Clock },
    { title: "Eras", href: "/app/eras", icon: Layers },
    { title: "Events", href: "/app/events", icon: CalendarDays },
    { title: "Identity", href: "/app/identity", icon: Fingerprint },
    { title: "Personality", href: "/app/personality", icon: Brain },
    { title: "Artifacts", href: "/app/artifacts", icon: Image },
    { title: "Influences", href: "/app/influences", icon: Sparkles },
    { title: "Stats", href: "/app/stats", icon: BarChart3 },
    { title: "Summary", href: "/app/summary", icon: FileText },
];

export function AppSidebar({ user }: { user: User }) {
    const pathname = usePathname();
    const initials =
        user.user_metadata?.display_name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase() ??
        user.email?.charAt(0).toUpperCase() ??
        "?";

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2">
                    <span className="text-lg font-bold tracking-tight">Threadline</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Your Life</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        render={<Link href={item.href} />}
                                        isActive={pathname === item.href}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<Link href="/app/settings" />} isActive={pathname.startsWith("/app/settings")}>
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger render={<SidebarMenuButton />}>
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate">
                                    {user.user_metadata?.display_name ?? user.email}
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start">
                                <form action={logout}>
                                    <DropdownMenuItem render={<button type="submit" />}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
