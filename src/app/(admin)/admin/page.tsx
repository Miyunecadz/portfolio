import Link from "next/link"
import { eq } from "drizzle-orm"
import {
  FolderSimple,
  Briefcase,
  Lightning,
  Envelope,
  Plus,
  PencilSimple,
  ArrowSquareOut,
  Clock,
  ChartLine,
} from "@phosphor-icons/react/dist/ssr"
import { db } from "@/db"
import { siteSettings } from "@/db/schema/app"
import { getDashboardStats, getRecentActivity } from "@/lib/queries/dashboard"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RelativeTime } from "@/components/admin/relative-time"

export default async function AdminPage() {
  const [stats, activities, settingsRows] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    db
      .select({ googleAnalyticsId: siteSettings.googleAnalyticsId })
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1),
  ])

  const googleAnalyticsId = settingsRows[0]?.googleAnalyticsId ?? null

  const statCards = [
    {
      label: "Projects",
      count: stats.projectCount,
      icon: FolderSimple,
      href: "/admin/projects",
    },
    {
      label: "Experience",
      count: stats.experienceCount,
      icon: Briefcase,
      href: "/admin/experience",
    },
    {
      label: "Skills",
      count: stats.skillCount,
      icon: Lightning,
      href: "/admin/skills",
    },
    {
      label: "Inbox",
      count: stats.unreadCount,
      icon: Envelope,
      href: "/admin/inbox",
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon size={20} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.count}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={18} />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No activity yet. Actions you take in the admin will appear here.
                </p>
              ) : (
                <ul className="divide-y">
                  {activities.map((activity) => (
                    <li key={activity.id} className="flex items-center gap-3 py-2">
                      <Clock size={16} className="text-muted-foreground shrink-0" />
                      <span className="text-sm flex-1">{activity.action}</span>
                      {activity.entityType && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.entityType}
                        </Badge>
                      )}
                      <RelativeTime date={activity.createdAt} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full justify-start">
                  <Link href="/admin/projects/new">
                    <Plus size={16} className="mr-2" />
                    Add Project
                  </Link>
                </Button>
                <Button asChild variant="default" className="w-full justify-start">
                  <Link href="/admin/experience/new">
                    <Plus size={16} className="mr-2" />
                    Add Experience
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/admin/settings/profile">
                    <PencilSimple size={16} className="mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <ArrowSquareOut size={16} className="mr-2" />
                    View Public Site
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GA Panel */}
          <div className="mt-4">
            {googleAnalyticsId ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartLine size={18} />
                    Google Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    Measurement ID: <code className="font-mono">{googleAnalyticsId}</code>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Live GA data will appear here once the GA Data API is connected (Phase 6).
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartLine size={18} />
                    Google Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your Google Analytics property to see page views, visitor counts, and
                    top pages here.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/admin/settings">Configure in Settings</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
