import type { Icon } from "@phosphor-icons/react";
import {
    SquaresFour,
    FolderSimple,
    Briefcase,
    Lightning,
    ChatCircleText,
    GraduationCap,
    PaintBrush,
    GithubLogo,
    LinkedinLogo,
    Robot,
    Gear,
    Envelope,
} from "@phosphor-icons/react";

interface NavItem {
    href: string;
    label: string;
    icon: Icon;
    group: string;
}

export const navItems: NavItem[] = [
    // Content
    { href: "/admin", label: "Dashboard", icon: SquaresFour, group: "Content" },
    {
        href: "/admin/projects",
        label: "Projects",
        icon: FolderSimple,
        group: "Content",
    },
    {
        href: "/admin/experience",
        label: "Experience",
        icon: Briefcase,
        group: "Content",
    },
    {
        href: "/admin/skills",
        label: "Skills",
        icon: Lightning,
        group: "Content",
    },
    {
        href: "/admin/references",
        label: "References",
        icon: ChatCircleText,
        group: "Content",
    },
    {
        href: "/admin/education",
        label: "Education",
        icon: GraduationCap,
        group: "Content",
    },
    // Appearance
    {
        href: "/admin/appearance",
        label: "Theme",
        icon: PaintBrush,
        group: "Appearance",
    },
    // Integrations
    {
        href: "/admin/integrations/github",
        label: "GitHub",
        icon: GithubLogo,
        group: "Integrations",
    },
    {
        href: "/admin/integrations/linkedin",
        label: "LinkedIn",
        icon: LinkedinLogo,
        group: "Integrations",
    },
    {
        href: "/admin/integrations/ai-chat",
        label: "AI Chat",
        icon: Robot,
        group: "Integrations",
    },
    // Settings
    {
        href: "/admin/settings",
        label: "Settings",
        icon: Gear,
        group: "Settings",
    },
    { href: "/admin/inbox", label: "Inbox", icon: Envelope, group: "Settings" },
];
