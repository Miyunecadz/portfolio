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
import { deleteSkill } from "@/lib/actions/skills"

type SkillRow = {
  id: string
  name: string
  categoryId: string | null
  categoryName: string | null
  proficiency: string
  iconUrl: string | null
  isVisible: boolean
  sortOrder: number | null
  createdAt: Date
  updatedAt: Date
}

function RowActions({ skill }: { skill: SkillRow }) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteSkill(skill.id)
    if (result.success) {
      toast.success("Skill deleted")
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
        <DropdownMenuItem onClick={() => router.push(`/admin/skills/${skill.id}/edit`)}>
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
          entityName="skill"
          onConfirm={handleDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const proficiencyVariant: Record<string, "default" | "secondary" | "outline"> = {
  beginner: "outline",
  intermediate: "secondary",
  advanced: "default",
  expert: "default",
}

export const skillColumns: ColumnDef<SkillRow>[] = [
  {
    accessorKey: "name",
    header: "Skill",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => row.original.categoryName ?? "—",
  },
  {
    accessorKey: "proficiency",
    header: "Proficiency",
    cell: ({ row }) => (
      <Badge variant={proficiencyVariant[row.original.proficiency] ?? "secondary"}>
        {row.original.proficiency}
      </Badge>
    ),
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
    cell: ({ row }) => <RowActions skill={row.original} />,
  },
]
