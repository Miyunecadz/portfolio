"use client"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Submission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  budgetRange: string | null
  projectType: string | null
  status: string
  ipAddress: string | null
  createdAt: Date
  updatedAt: Date
}

interface ContactSubmissionRowProps {
  submission: Submission
  markAsRead: (id: string) => Promise<void>
  archiveSubmission: (id: string) => Promise<void>
  deleteSubmission: (id: string) => Promise<void>
}

function StatusBadge({ status }: { status: string }) {
  if (status === "unread") {
    return (
      <Badge variant="destructive" className="text-xs">
        Unread
      </Badge>
    )
  }
  if (status === "archived") {
    return (
      <Badge variant="secondary" className="text-xs">
        Archived
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-xs text-muted-foreground">
      Read
    </Badge>
  )
}

export function ContactSubmissionRow({
  submission,
  markAsRead,
  archiveSubmission,
  deleteSubmission,
}: ContactSubmissionRowProps) {
  const [expanded, setExpanded] = useState(false)

  const isUnread = submission.status === "unread"
  const rowClass = isUnread
    ? "border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-950/10"
    : ""

  const formattedDate = new Date(submission.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <>
      <TableRow className={rowClass}>
        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
          {formattedDate}
        </TableCell>
        <TableCell className="font-medium">{submission.name}</TableCell>
        <TableCell className="text-sm">{submission.email}</TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {submission.subject ?? <span className="italic">(no subject)</span>}
        </TableCell>
        <TableCell>
          <StatusBadge status={submission.status} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </Button>
            {isUnread && (
              <form action={markAsRead.bind(null, submission.id)}>
                <Button variant="outline" size="sm" className="h-7 text-xs" type="submit">
                  Mark Read
                </Button>
              </form>
            )}
            {submission.status !== "archived" && (
              <form action={archiveSubmission.bind(null, submission.id)}>
                <Button variant="outline" size="sm" className="h-7 text-xs" type="submit">
                  Archive
                </Button>
              </form>
            )}
            <form action={deleteSubmission.bind(null, submission.id)}>
              <Button
                variant="destructive"
                size="sm"
                className="h-7 text-xs"
                type="submit"
                onClick={(e) => {
                  if (!confirm("Delete this submission? This cannot be undone.")) {
                    e.preventDefault()
                  }
                }}
              >
                Delete
              </Button>
            </form>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className={isUnread ? "bg-red-50/30 dark:bg-red-950/10" : "bg-muted/20"}>
          <TableCell colSpan={6} className="px-6 py-4">
            <div className="space-y-3 text-sm">
              {(submission.projectType || submission.budgetRange) && (
                <div className="flex gap-4 text-muted-foreground">
                  {submission.projectType && (
                    <span>
                      <strong>Type:</strong> {submission.projectType}
                    </span>
                  )}
                  {submission.budgetRange && (
                    <span>
                      <strong>Budget:</strong> {submission.budgetRange}
                    </span>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap rounded-md bg-background p-4 border">
                {submission.message}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
