"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MediaPicker } from "@/components/admin/media-picker"
import {
  createReferenceSchema,
  updateReferenceSchema,
  type CreateReferenceInput,
  type UpdateReferenceInput,
} from "@/schemas/content"
import { createReference, updateReference } from "@/lib/actions/references"
import type { Reference } from "@/lib/queries/references"
import type { MediaAsset } from "@/lib/queries/media"

interface ReferenceFormProps {
  reference?: Reference
  mediaAssets: MediaAsset[]
}

export function ReferenceForm({ reference, mediaAssets }: ReferenceFormProps) {
  const router = useRouter()

  const form = useForm<CreateReferenceInput & Partial<UpdateReferenceInput>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(reference ? updateReferenceSchema : createReferenceSchema) as any,
    defaultValues: {
      ...(reference ? { id: reference.id } : {}),
      name: reference?.name ?? "",
      jobTitle: reference?.jobTitle ?? "",
      company: reference?.company ?? "",
      quote: reference?.quote ?? "",
      photoUrl: reference?.photoUrl ?? "",
      linkedinUrl: reference?.linkedinUrl ?? "",
      isVisible: reference?.isVisible ?? true,
    },
  })

  async function onSubmit(data: CreateReferenceInput & Partial<UpdateReferenceInput>) {
    const payload = reference ? { ...data, id: reference.id } : data
    const result = reference ? await updateReference(payload) : await createReference(payload)

    if (result.success) {
      toast.success(reference ? "Reference updated" : "Reference created")
      router.push("/admin/references")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl><Input {...field} placeholder="Jane Smith" maxLength={100} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="jobTitle" render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ""} placeholder="Engineering Manager" maxLength={100} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="company" render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ""} placeholder="Acme Corp" maxLength={100} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ""} placeholder="https://linkedin.com/in/..." type="url" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="quote" render={({ field }) => (
          <FormItem>
            <FormLabel>Quote / Testimonial *</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Write the testimonial text here..." rows={5} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="space-y-2">
          <Label>Photo</Label>
          {form.watch("photoUrl") && (
            <img
              src={form.watch("photoUrl")!}
              alt="Photo preview"
              className="w-16 h-16 object-cover rounded-full border"
            />
          )}
          <div className="flex gap-2 items-center">
            <MediaPicker
              trigger={<Button variant="outline" type="button">Choose from Media Library</Button>}
              onSelect={(asset) => form.setValue("photoUrl", asset.publicUrl)}
              filter="image"
              assets={mediaAssets}
            />
            {form.watch("photoUrl") && (
              <Button variant="ghost" type="button" onClick={() => form.setValue("photoUrl", "")}>
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
            {form.formState.isSubmitting ? "Saving..." : reference ? "Save Changes" : "Create Reference"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/references")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
