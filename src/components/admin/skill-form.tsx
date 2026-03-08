"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Check, CaretUpDown } from "@phosphor-icons/react/dist/ssr"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import {
  createSkillSchema,
  updateSkillSchema,
  type CreateSkillInput,
  type UpdateSkillInput,
} from "@/schemas/content"
import { createSkill, updateSkill, createSkillCategory } from "@/lib/actions/skills"
import type { Skill, SkillCategory } from "@/lib/queries/skills"

interface SkillFormProps {
  skill?: Skill
  categories: SkillCategory[]
}

export function SkillForm({ skill, categories: initialCategories }: SkillFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")

  const form = useForm<CreateSkillInput & Partial<UpdateSkillInput>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(skill ? updateSkillSchema : createSkillSchema) as any,
    defaultValues: {
      ...(skill ? { id: skill.id } : {}),
      name: skill?.name ?? "",
      categoryId: skill?.categoryId ?? null,
      proficiency: (skill?.proficiency as CreateSkillInput["proficiency"]) ?? "intermediate",
      iconUrl: skill?.iconUrl ?? "",
      isVisible: skill?.isVisible ?? true,
    },
  })

  const selectedCategoryId = form.watch("categoryId")
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const showCreateOption =
    categorySearch.trim().length > 0 &&
    !categories.some((c) => c.name.toLowerCase() === categorySearch.trim().toLowerCase())

  async function handleCreateCategory() {
    const result = await createSkillCategory(categorySearch.trim())
    if (result.success) {
      const newCat = result.data
      setCategories((prev) => [...prev, { ...newCat, isDefault: false, createdAt: new Date() }])
      form.setValue("categoryId", newCat.id)
      setCategorySearch("")
      setCategoryOpen(false)
    } else {
      toast.error(result.error)
    }
  }

  async function onSubmit(data: CreateSkillInput & Partial<UpdateSkillInput>) {
    const payload = skill ? { ...data, id: skill.id } : data
    const result = skill ? await updateSkill(payload) : await createSkill(payload)

    if (result.success) {
      toast.success(skill ? "Skill updated" : "Skill created")
      router.push("/admin/skills")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Skill Name *</FormLabel>
            <FormControl><Input {...field} placeholder="TypeScript" maxLength={50} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Category combobox */}
        <FormField control={form.control} name="categoryId" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}
                  >
                    {selectedCategory?.name ?? "Select category..."}
                    <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search or create category..."
                    value={categorySearch}
                    onValueChange={setCategorySearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {showCreateOption ? null : "No categories found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredCategories.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.name}
                          onSelect={() => {
                            form.setValue("categoryId", cat.id)
                            setCategoryOpen(false)
                            setCategorySearch("")
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", field.value === cat.id ? "opacity-100" : "opacity-0")} />
                          {cat.name}
                        </CommandItem>
                      ))}
                      {showCreateOption && (
                        <CommandItem
                          value={`__create__${categorySearch}`}
                          onSelect={handleCreateCategory}
                        >
                          <span className="text-primary">Create &ldquo;{categorySearch.trim()}&rdquo;</span>
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="proficiency" render={({ field }) => (
          <FormItem>
            <FormLabel>Proficiency *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="iconUrl" render={({ field }) => (
          <FormItem>
            <FormLabel>Icon URL</FormLabel>
            <FormControl><Input {...field} value={field.value ?? ""} placeholder="Paste URL (Media Library in 03-04)" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="isVisible" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <Label>Visible on public site</Label>
          </FormItem>
        )} />

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : skill ? "Save Changes" : "Create Skill"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/skills")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
