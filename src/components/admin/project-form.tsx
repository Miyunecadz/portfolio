"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import slugify from "slugify"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ChipInput } from "@/components/admin/chip-input"
import { MediaPicker } from "@/components/admin/media-picker"
import { ScreenshotsManager } from "@/components/admin/screenshots-manager"
import {
  createProjectSchema,
  updateProjectSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "@/schemas/content"
import { createProject, updateProject } from "@/lib/actions/projects"
import type { Project } from "@/lib/queries/projects"
import type { MediaAsset } from "@/lib/queries/media"

interface ScreenshotItem {
  id: string
  publicUrl: string
  caption: string | null
  sortOrder: number
  storagePath: string
}

interface ProjectFormProps {
  project?: Project
  mediaAssets: MediaAsset[]
  initialScreenshots?: ScreenshotItem[]
}

export function ProjectForm({ project, mediaAssets, initialScreenshots = [] }: ProjectFormProps) {
  const router = useRouter()
  const slugManuallyEdited = useRef(false)

  const form = useForm<CreateProjectInput & Partial<UpdateProjectInput>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(project ? updateProjectSchema : createProjectSchema) as any,
    defaultValues: {
      ...(project ? { id: project.id } : {}),
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      shortDescription: project?.shortDescription ?? "",
      fullDescription: project?.fullDescription ?? "",
      techStackTags: (project?.techStackTags as string[]) ?? [],
      liveUrl: project?.liveUrl ?? "",
      repoUrl: project?.repoUrl ?? "",
      thumbnailUrl: project?.thumbnailUrl ?? "",
      isFeatured: project?.isFeatured ?? false,
      status: (project?.status as "draft" | "published") ?? "draft",
      problemStatement: project?.problemStatement ?? "",
      solutionApproach: project?.solutionApproach ?? "",
      outcomesAndImpact: project?.outcomesAndImpact ?? "",
      myRole: project?.myRole ?? "",
    },
  })

  const titleValue = form.watch("title")

  useEffect(() => {
    if (!slugManuallyEdited.current) {
      form.setValue("slug", slugify(titleValue ?? "", { lower: true, strict: true }))
    }
  }, [titleValue, form])

  async function onSubmit(data: CreateProjectInput & Partial<UpdateProjectInput>) {
    const payload = project ? { ...data, id: project.id } : data
    const result = project ? await updateProject(payload) : await createProject(payload)

    if (result.success) {
      toast.success(project ? "Project updated" : "Project created")
      router.push("/admin/projects")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="casestudy">Case Study</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl><Input {...field} placeholder="My Project" maxLength={100} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="my-project"
                    maxLength={120}
                    onChange={(e) => {
                      slugManuallyEdited.current = true
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="shortDescription" render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} placeholder="One-line summary (max 160 chars)" maxLength={160} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-4 items-center">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="isFeatured" render={({ field }) => (
                <FormItem className="flex items-center gap-2 pt-5">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <Label>Featured</Label>
                </FormItem>
              )} />
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 pt-4">
            <FormField control={form.control} name="fullDescription" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description</FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Write a detailed project description..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Controller control={form.control} name="techStackTags" render={({ field }) => (
              <div>
                <Label>Tech Stack Tags</Label>
                <ChipInput value={field.value} onChange={field.onChange} placeholder="Add technology tag..." className="mt-1.5" />
              </div>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="liveUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl><Input {...field} value={field.value ?? ""} placeholder="https://" type="url" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="repoUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Repo URL</FormLabel>
                  <FormControl><Input {...field} value={field.value ?? ""} placeholder="https://github.com/..." type="url" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail</Label>
              {form.watch("thumbnailUrl") && (
                <img
                  src={form.watch("thumbnailUrl")!}
                  alt="Thumbnail preview"
                  className="w-32 h-20 object-cover rounded border"
                />
              )}
              <div className="flex gap-2 items-center">
                <MediaPicker
                  trigger={<Button variant="outline" type="button">Choose from Media Library</Button>}
                  onSelect={(asset) => form.setValue("thumbnailUrl", asset.publicUrl)}
                  filter="image"
                  assets={mediaAssets}
                  usedIn="project"
                />
                {form.watch("thumbnailUrl") && (
                  <Button variant="ghost" type="button" onClick={() => form.setValue("thumbnailUrl", "")}>
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Screenshots — only shown when editing an existing project */}
            {project && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Screenshots</label>
                <ScreenshotsManager projectId={project.id} initialScreenshots={initialScreenshots} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="casestudy" className="space-y-4 pt-4">
            {(["problemStatement", "solutionApproach", "outcomesAndImpact", "myRole"] as const).map((fieldName) => {
              const labels: Record<typeof fieldName, string> = {
                problemStatement: "Problem Statement",
                solutionApproach: "Solution Approach",
                outcomesAndImpact: "Outcomes & Impact",
                myRole: "My Role",
              }
              return (
                <FormField key={fieldName} control={form.control} name={fieldName} render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels[fieldName]}</FormLabel>
                    <FormControl>
                      <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )
            })}
          </TabsContent>
        </Tabs>

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : project ? "Save Changes" : "Create Project"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
