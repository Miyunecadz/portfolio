import { db } from "@/db"
import { contactSubmissions } from "@/db/schema/app"
import { desc } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { markAsRead, archiveSubmission, deleteSubmission } from "@/lib/actions/contact-admin"
import { ContactSubmissionRow } from "./contact-submission-row"

export default async function ContactInboxPage() {
  const submissions = await db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))

  const unreadCount = submissions.filter((s) => s.status === "unread").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contact Inbox</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No contact submissions yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <ContactSubmissionRow
                  key={submission.id}
                  submission={submission}
                  markAsRead={markAsRead}
                  archiveSubmission={archiveSubmission}
                  deleteSubmission={deleteSubmission}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
