"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { MediaPicker } from "@/components/admin/media-picker"
import { upsertProfileSchema, type UpsertProfileInput } from "@/schemas/content"
import { upsertProfile } from "@/lib/actions/profile"
import type { Profile } from "@/lib/queries/profile"
import type { MediaAsset } from "@/lib/queries/media"

interface ProfileFormProps {
  profile?: Profile
  mediaAssets: MediaAsset[]
}

export function ProfileForm({ profile, mediaAssets }: ProfileFormProps) {
  const form = useForm<UpsertProfileInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(upsertProfileSchema) as any,
    defaultValues: {
      id: profile?.id,
      fullName: profile?.fullName ?? "",
      tagline: profile?.tagline ?? "",
      bio: profile?.bio ?? "",
      location: profile?.location ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      availabilityStatus:
        (profile?.availabilityStatus as UpsertProfileInput["availabilityStatus"]) ??
        "not_available",
      avatarUrl: profile?.avatarUrl ?? "",
      resumeUrl: profile?.resumeUrl ?? "",
      githubUrl: profile?.githubUrl ?? "",
      linkedinUrl: profile?.linkedinUrl ?? "",
      facebookUrl: profile?.facebookUrl ?? "",
      blogUrl: profile?.blogUrl ?? "",
    },
  })

  const avatarUrl = form.watch("avatarUrl")
  const resumeUrl = form.watch("resumeUrl")

  async function onSubmit(data: UpsertProfileInput) {
    const result = await upsertProfile(data)
    if (result.success) {
      toast.success("Profile saved")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="identity">
          <TabsList>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="bio">Bio</TabsTrigger>
            <TabsTrigger value="media">Avatar &amp; Resume</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>

          {/* Identity Tab */}
          <TabsContent value="identity" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      maxLength={160}
                      placeholder="e.g. Full-stack developer building products people love"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} placeholder="City, Country" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availabilityStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open_to_work">Open to Work</SelectItem>
                        <SelectItem value="open_to_freelance">Open to Freelance</SelectItem>
                        <SelectItem value="not_available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Bio Tab */}
          <TabsContent value="bio" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Write your professional bio..."
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6 pt-4">
            {/* Avatar */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Avatar</p>
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              )}
              <div className="flex gap-2 items-center">
                <MediaPicker
                  trigger={
                    <Button variant="outline" type="button">
                      Choose from Media Library
                    </Button>
                  }
                  onSelect={(asset) => form.setValue("avatarUrl", asset.publicUrl)}
                  filter="image"
                  assets={mediaAssets}
                />
                {avatarUrl && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => form.setValue("avatarUrl", "")}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload images (JPG, PNG, WebP) via the Media Library. Max 2MB.
              </p>
            </div>

            {/* Resume PDF */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Resume PDF</p>
              {resumeUrl && (
                <p className="text-sm text-muted-foreground">
                  Current:{" "}
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    View PDF
                  </a>
                </p>
              )}
              <div className="flex gap-2 items-center">
                <MediaPicker
                  trigger={
                    <Button variant="outline" type="button">
                      Choose from Media Library
                    </Button>
                  }
                  onSelect={(asset) => form.setValue("resumeUrl", asset.publicUrl)}
                  filter="pdf"
                  assets={mediaAssets}
                />
                {resumeUrl && (
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => form.setValue("resumeUrl", "")}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload PDF via the Media Library. Max 5MB.
              </p>
            </div>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="space-y-4 pt-4">
            {(["githubUrl", "linkedinUrl", "facebookUrl", "blogUrl"] as const).map((fieldName) => {
              const labels: Record<typeof fieldName, string> = {
                githubUrl: "GitHub URL",
                linkedinUrl: "LinkedIn URL",
                facebookUrl: "Facebook URL",
                blogUrl: "Blog URL",
              }
              return (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels[fieldName]}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="url"
                          placeholder="https://"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            })}
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  )
}
