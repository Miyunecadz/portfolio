"use client"

import { useForm } from "react-hook-form"
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
import { MediaPicker } from "@/components/admin/media-picker"
import {
  createEducationSchema,
  updateEducationSchema,
  type CreateEducationInput,
  type UpdateEducationInput,
} from "@/schemas/content"
import { createEducation, updateEducation } from "@/lib/actions/education"
import type { Education } from "@/lib/queries/education"
import type { MediaAsset } from "@/lib/queries/media"

interface EducationFormProps {
  entry?: Education
  mediaAssets: MediaAsset[]
}

export function EducationForm({ entry, mediaAssets }: EducationFormProps) {
  const router = useRouter()

  const form = useForm<CreateEducationInput & Partial<UpdateEducationInput>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(entry ? updateEducationSchema : createEducationSchema) as any,
    defaultValues: {
      ...(entry ? { id: entry.id } : {}),
      schoolName: entry?.schoolName ?? "",
      schoolLogoUrl: entry?.schoolLogoUrl ?? "",
      degreeType: (entry?.degreeType as CreateEducationInput["degreeType"]) ?? "bachelor",
      fieldOfStudy: entry?.fieldOfStudy ?? "",
      startYear: entry?.startYear ?? new Date().getFullYear(),
      endYear: entry?.endYear ?? undefined,
      isVisible: entry?.isVisible ?? true,
    },
  })

  async function onSubmit(data: CreateEducationInput & Partial<UpdateEducationInput>) {
    const payload = entry ? { ...data, id: entry.id } : data
    const result = entry ? await updateEducation(payload) : await createEducation(payload)

    if (result.success) {
      toast.success(entry ? "Education updated" : "Education created")
      router.push("/admin/education")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormField control={form.control} name="schoolName" render={({ field }) => (
          <FormItem>
            <FormLabel>School Name *</FormLabel>
            <FormControl><Input {...field} placeholder="University of Example" maxLength={100} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="degreeType" render={({ field }) => (
          <FormItem>
            <FormLabel>Degree Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="bachelor">Bachelor&apos;s</SelectItem>
                <SelectItem value="master">Master&apos;s</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="associate">Associate</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="bootcamp">Bootcamp</SelectItem>
                <SelectItem value="self-taught">Self-taught</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="fieldOfStudy" render={({ field }) => (
          <FormItem>
            <FormLabel>Field of Study</FormLabel>
            <FormControl><Input {...field} value={field.value ?? ""} placeholder="Computer Science" maxLength={100} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="startYear" render={({ field }) => (
            <FormItem>
              <FormLabel>Start Year *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1900}
                  max={2100}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="endYear" render={({ field }) => (
            <FormItem>
              <FormLabel>End Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1900}
                  max={2100}
                  placeholder="Leave blank if ongoing"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="space-y-2">
          <Label>School Logo</Label>
          {form.watch("schoolLogoUrl") && (
            <img
              src={form.watch("schoolLogoUrl")!}
              alt="School logo preview"
              className="w-20 h-20 object-contain rounded border"
            />
          )}
          <div className="flex gap-2 items-center">
            <MediaPicker
              trigger={<Button variant="outline" type="button">Choose from Media Library</Button>}
              onSelect={(asset) => form.setValue("schoolLogoUrl", asset.publicUrl)}
              filter="image"
              assets={mediaAssets}
            />
            {form.watch("schoolLogoUrl") && (
              <Button variant="ghost" type="button" onClick={() => form.setValue("schoolLogoUrl", "")}>
                Remove
              </Button>
            )}
          </div>
        </div>

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
            {form.formState.isSubmitting ? "Saving..." : entry ? "Save Changes" : "Create Education"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/education")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
