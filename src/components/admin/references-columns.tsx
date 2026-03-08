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
import { deleteReference } from "@/lib/actions/references"
import type { Reference } from "@/lib/queries/references"

function RowActions({ reference }: { reference: Reference }) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteReference(reference.id)
    if (result.success) {
      toast.success("Reference deleted")
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
        <DropdownMenuItem onClick={() => router.push(`/admin/references/${reference.id}/edit`)}>
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
          entityName="reference"
          onConfirm={handleDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const referenceColumns: ColumnDef<Reference>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => row.original.company ?? "—",
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
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions reference={row.original} />,
  },
]
