"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ChipInput } from "@/components/admin/chip-input"
import {
  createExperienceSchema,
  updateExperienceSchema,
  type CreateExperienceInput,
  type UpdateExperienceInput,
} from "@/schemas/content"
import { createExperience, updateExperience } from "@/lib/actions/experience"
import type { Experience } from "@/lib/queries/experience"

interface ExperienceFormProps {
  experience?: Experience
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter()

  // Format timestamp to "YYYY-MM" for month input
  const toMonthValue = (date: Date | string | null | undefined) => {
    if (!date) return ""
    const d = new Date(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  }

  const form = useForm<CreateExperienceInput & Partial<UpdateExperienceInput>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(experience ? updateExperienceSchema : createExperienceSchema) as any,
    defaultValues: {
      ...(experience ? { id: experience.id } : {}),
      companyName: experience?.companyName ?? "",
      companyLogoUrl: experience?.companyLogoUrl ?? "",
      jobTitle: experience?.jobTitle ?? "",
      employmentType: (experience?.employmentType as CreateExperienceInput["employmentType"]) ?? "full-time",
      startDate: toMonthValue(experience?.startDate),
      endDate: toMonthValue(experience?.endDate),
      isCurrentRole: experience?.isCurrentRole ?? false,
      description: experience?.description ?? "",
      techStackTags: (experience?.techStackTags as string[]) ?? [],
    },
  })

  const isCurrentRole = form.watch("isCurrentRole")

  async function onSubmit(data: CreateExperienceInput & Partial<UpdateExperienceInput>) {
    // Convert month string "2023-01" to full ISO date string
    const payload = {
      ...data,
      startDate: data.startDate ? `${data.startDate}-01` : data.startDate,
      endDate: data.endDate ? `${data.endDate}-01` : null,
      ...(experience ? { id: experience.id } : {}),
    }
    const result = experience ? await updateExperience(payload) : await createExperience(payload)

    if (result.success) {
      toast.success(experience ? "Experience updated" : "Experience created")
      router.push("/admin/experience")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl><Input {...field} placeholder="Acme Corp" maxLength={100} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="jobTitle" render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title *</FormLabel>
              <FormControl><Input {...field} placeholder="Senior Engineer" maxLength={100} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="employmentType" render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="companyLogoUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo URL</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ""} placeholder="Paste URL (Media Library in 03-04)" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="startDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date *</FormLabel>
              <FormControl><Input {...field} type="month" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {!isCurrentRole && (
            <FormField control={form.control} name="endDate" render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl><Input {...field} value={field.value ?? ""} type="month" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}
        </div>

        <FormField control={form.control} name="isCurrentRole" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <Label>Current Role</Label>
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Describe your role and responsibilities..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Controller control={form.control} name="techStackTags" render={({ field }) => (
          <div>
            <Label>Tech Stack Tags</Label>
            <ChipInput value={field.value} onChange={field.onChange} placeholder="Add technology..." className="mt-1.5" />
          </div>
        )} />

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : experience ? "Save Changes" : "Create Experience"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/experience")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
