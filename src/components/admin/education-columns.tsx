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
import { deleteEducation } from "@/lib/actions/education"
import type { Education } from "@/lib/queries/education"

function RowActions({ entry }: { entry: Education }) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteEducation(entry.id)
    if (result.success) {
      toast.success("Education entry deleted")
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
        <DropdownMenuItem onClick={() => router.push(`/admin/education/${entry.id}/edit`)}>
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
          entityName="education entry"
          onConfirm={handleDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const educationColumns: ColumnDef<Education>[] = [
  {
    accessorKey: "schoolName",
    header: "School",
    cell: ({ row }) => <span className="font-medium">{row.original.schoolName}</span>,
  },
  {
    accessorKey: "degreeType",
    header: "Degree",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.degreeType}</Badge>
    ),
  },
  {
    accessorKey: "startYear",
    header: "Years",
    cell: ({ row }) =>
      `${row.original.startYear} – ${row.original.endYear ?? "Present"}`,
  },
  {
    accessorKey: "isVisible",
    header: "Visible",
    cell: ({ row }) => (
      <Badge variant={row.original.isVisible ? "default" : "secondary"}>
        {row.original.isVisible ? "Visible" : "Hidden"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions entry={row.original} />,
  },
]
