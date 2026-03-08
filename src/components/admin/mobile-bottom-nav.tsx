"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SquaresFour,
  FolderSimple,
  Briefcase,
  UserCircle,
  DotsThree,
  Lightning,
  ChatCircleText,
  GraduationCap,
  PaintBrush,
  GithubLogo,
  LinkedinLogo,
  Robot,
  Gear,
  Envelope,
} from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface TabItem {
  href: string
  label: string
  icon: Icon
}

const tabs: TabItem[] = [
  { href: "/admin", label: "Dashboard", icon: SquaresFour },
  { href: "/admin/projects", label: "Projects", icon: FolderSimple },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/settings", label: "Profile", icon: UserCircle },
]

interface DrawerNavItem {
  href: string
  label: string
  icon: Icon
  group: string
}

const drawerItems: DrawerNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: SquaresFour, group: "Content" },
  { href: "/admin/projects", label: "Projects", icon: FolderSimple, group: "Content" },
  { href: "/admin/experience", label: "Experience", icon: Briefcase, group: "Content" },
  { href: "/admin/skills", label: "Skills", icon: Lightning, group: "Content" },
  { href: "/admin/references", label: "References", icon: ChatCircleText, group: "Content" },
  { href: "/admin/education", label: "Education", icon: GraduationCap, group: "Content" },
  { href: "/admin/appearance", label: "Theme", icon: PaintBrush, group: "Appearance" },
  { href: "/admin/integrations/github", label: "GitHub", icon: GithubLogo, group: "Integrations" },
  { href: "/admin/integrations/linkedin", label: "LinkedIn", icon: LinkedinLogo, group: "Integrations" },
  { href: "/admin/integrations/ai-chat", label: "AI Chat", icon: Robot, group: "Integrations" },
  { href: "/admin/settings", label: "Settings", icon: Gear, group: "Settings" },
  { href: "/admin/inbox", label: "Inbox", icon: Envelope, group: "Settings" },
]

const drawerGroups = ["Content", "Appearance", "Integrations", "Settings"]

function isTabActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(href + "/")
}

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background pb-4">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = isTabActive(tab.href, pathname)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </Link>
          )
        })}

        <Drawer>
          <DrawerTrigger asChild>
            <button className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-muted-foreground">
              <DotsThree size={20} />
              <span>More</span>
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <div className="overflow-y-auto px-4 py-4">
              {drawerGroups.map((group) => (
                <div key={group} className="mb-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {group}
                  </p>
                  <div className="space-y-1">
                    {drawerItems
                      .filter((item) => item.group === group)
                      .map((item) => {
                        const active = isTabActive(item.href, pathname)
                        return (
                          <DrawerClose asChild key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                                active
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-foreground hover:bg-accent/50"
                              )}
                            >
                              <item.icon size={18} />
                              {item.label}
                            </Link>
                          </DrawerClose>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  )
}
