"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SquaresFour,
  FolderSimple,
  Briefcase,
  Lightning,
  ChatCircleText,
  GraduationCap,
  Images,
  Gear,
  Envelope,
} from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  href: string
  label: string
  icon: Icon
  group: string
}

const navItems: NavItem[] = [
  // Content
  { href: "/admin", label: "Dashboard", icon: SquaresFour, group: "Content" },
  { href: "/admin/projects", label: "Projects", icon: FolderSimple, group: "Content" },
  { href: "/admin/experience", label: "Experience", icon: Briefcase, group: "Content" },
  { href: "/admin/skills", label: "Skills", icon: Lightning, group: "Content" },
  { href: "/admin/references", label: "References", icon: ChatCircleText, group: "Content" },
  { href: "/admin/education", label: "Education", icon: GraduationCap, group: "Content" },
  { href: "/admin/media", label: "Media", icon: Images, group: "Content" },
  // Settings
  { href: "/admin/settings", label: "Settings", icon: Gear, group: "Settings" },
  { href: "/admin/inbox", label: "Inbox", icon: Envelope, group: "Settings" },
]

const groups = ["Content", "Settings"]

interface SidebarNavProps {
  unreadCount: number
}

export function SidebarNav({ unreadCount }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group}>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.label === "Inbox" && unreadCount > 0 && (
                        <SidebarMenuBadge>{unreadCount}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  )
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
