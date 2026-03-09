"use client"

import { useState, useRef, useTransition } from "react"
import { toast } from "sonner"
import { Copy, Trash, UploadSimple, File } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { uploadMediaAsset, deleteMediaAsset } from "@/lib/actions/media"
import type { MediaAsset } from "@/lib/queries/media"

interface MediaGridProps {
  initialAssets: MediaAsset[]
  selectable?: boolean
  filter?: "image" | "pdf" | "all"
  onSelect?: (asset: MediaAsset) => void
  usedIn?: string
}

export function MediaGrid({
  initialAssets,
  selectable = false,
  filter = "all",
  onSelect,
  usedIn = "misc",
}: MediaGridProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets)
  const [, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    usedIn: { entity: string; name: string }[]
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredAssets = assets.filter((a) => {
    if (filter === "image") return a.fileType.startsWith("image/")
    if (filter === "pdf") return a.fileType === "application/pdf"
    return true
  })

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    const section =
      file.type.startsWith("image/") ? "misc" : file.type === "application/pdf" ? "resumes" : "misc"
    startTransition(async () => {
      const result = await uploadMediaAsset(formData, usedIn, section)
      if (result.success) {
        setAssets((prev) => [
          {
            id: result.data.id,
            publicUrl: result.data.publicUrl,
            fileName: result.data.fileName,
            fileType: file.type,
            fileSizeBytes: file.size,
            storagePath: "",
            usedIn: section,
            createdAt: new Date(),
          },
          ...prev,
        ])
        toast.success("File uploaded")
      } else {
        toast.error(result.error)
      }
    })
    e.target.value = ""
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteMediaAsset(id)
      if (result.success) {
        setAssets((prev) => prev.filter((a) => a.id !== id))
        toast.success("File deleted")
      } else if ("usedIn" in result && result.usedIn) {
        setDeleteTarget({ id, usedIn: result.usedIn })
      } else if ("error" in result) {
        toast.error(result.error)
      }
    })
  }

  function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <UploadSimple size={16} className="mr-2" /> Upload
        </Button>
      </div>

      {filteredAssets.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredAssets.map((asset) => {
            const isImage = asset.fileType.startsWith("image/")
            return (
              <div
                key={asset.id}
                className={`border rounded-md overflow-hidden group relative ${
                  selectable ? "cursor-pointer hover:ring-2 hover:ring-primary" : ""
                }`}
                onClick={() => selectable && onSelect?.(asset)}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.publicUrl}
                      alt={asset.fileName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <File size={32} className="text-muted-foreground" />
                  )}
                </div>
                {/* Filename + size */}
                <div className="p-2">
                  <p className="text-xs font-medium truncate" title={asset.fileName}>
                    {asset.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatBytes(asset.fileSizeBytes)}</p>
                </div>
                {/* Actions — only shown when not in selectable mode */}
                {!selectable && (
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(asset.publicUrl)
                        toast.success("URL copied")
                      }}
                      title="Copy URL"
                    >
                      <Copy size={12} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(asset.id)
                      }}
                      title="Delete"
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Delete-blocked AlertDialog — shows where file is used */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>File is in use</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                This file is referenced by:
                <ul className="mt-2 list-disc list-inside">
                  {deleteTarget?.usedIn.map((u, i) => (
                    <li key={i}>
                      {u.entity}: {u.name}
                    </li>
                  ))}
                </ul>
                Remove the reference first, then delete the file.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
