"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DotsThree, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { deleteExperience } from "@/lib/actions/experience"
import type { Experience } from "@/lib/queries/experience"

function RowActions({ experience }: { experience: Experience }) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteExperience(experience.id)
    if (result.success) {
      toast.success("Experience deleted")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Row actions">
          <DotsThree size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/admin/experience/${experience.id}/edit`)}>
          <PencilSimple size={14} className="mr-2" /> Edit
        </DropdownMenuItem>
        <DeleteConfirmDialog
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              <Trash size={14} className="mr-2" /> Delete
            </DropdownMenuItem>
          }
          entityName="experience"
          onConfirm={handleDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const experienceColumns: ColumnDef<Experience>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => <span className="font-medium">{row.original.companyName}</span>,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "employmentType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.employmentType}</Badge>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }),
  },
  {
    accessorKey: "isCurrentRole",
    header: "Status",
    cell: ({ row }) =>
      row.original.isCurrentRole ? (
        <Badge>Current</Badge>
      ) : row.original.endDate ? (
        <span className="text-muted-foreground text-sm">
          {new Date(row.original.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
        </span>
      ) : "—",
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions experience={row.original} />,
  },
]
