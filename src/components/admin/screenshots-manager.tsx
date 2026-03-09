"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, ImagePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@supabase/supabase-js"
import {
  getScreenshotUploadUrl,
  recordScreenshot,
  reorderScreenshots,
  updateScreenshotCaption,
  deleteScreenshot,
} from "@/lib/actions/screenshots"

interface Screenshot {
  id: string
  publicUrl: string
  caption: string | null
  sortOrder: number
  storagePath: string
}

interface Props {
  projectId: string
  initialScreenshots: Screenshot[]
}

interface SortableCardProps {
  screenshot: Screenshot
  pendingCaptions: Record<string, string>
  savingId: string | null
  onCaptionChange: (id: string, value: string) => void
  onSaveCaption: (id: string) => void
  onDelete: (id: string) => void
}

function SortableScreenshotCard({
  screenshot,
  pendingCaptions,
  savingId,
  onCaptionChange,
  onSaveCaption,
  onDelete,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: screenshot.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const currentCaption = pendingCaptions[screenshot.id] ?? screenshot.caption ?? ""
  const savedCaption = screenshot.caption ?? ""
  const captionChanged = currentCaption !== savedCaption
  const isSaving = savingId === screenshot.id

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-3 rounded-lg border bg-card ${isDragging ? "opacity-50" : ""}`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="mt-2 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Thumbnail */}
      <div className="relative w-20 h-16 rounded overflow-hidden flex-shrink-0">
        <Image
          src={screenshot.publicUrl}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Caption + actions */}
      <div className="flex-1 space-y-2 min-w-0">
        <Input
          type="text"
          value={currentCaption}
          onChange={(e) => onCaptionChange(screenshot.id, e.target.value)}
          placeholder="Add a caption..."
          className="text-sm"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => onSaveCaption(screenshot.id)}
            disabled={!captionChanged || isSaving}
          >
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => onDelete(screenshot.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ScreenshotsManager({ projectId, initialScreenshots }: Props) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>(initialScreenshots)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pendingCaptions, setPendingCaptions] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = screenshots.findIndex((s) => s.id === active.id)
    const newIndex = screenshots.findIndex((s) => s.id === over.id)
    const reordered = arrayMove(screenshots, oldIndex, newIndex)

    setScreenshots(reordered)
    // Fire-and-forget optimistic reorder
    reorderScreenshots(projectId, reordered.map((s) => s.id))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
    setIsUploading(true)
    setUploadError(null)

    // Step 1: Get signed upload URL
    const urlResult = await getScreenshotUploadUrl(projectId, ext)
    if (!urlResult.success) {
      setUploadError(urlResult.error ?? "Failed to get upload URL")
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    const { signedUrl: _signedUrl, token, storagePath, publicUrl } = urlResult.data

    // Step 2: Client-side upload using anon key (NOT service role — server-only)
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: uploadErr } = await supabaseClient.storage
      .from("portfolio-media")
      .uploadToSignedUrl(storagePath, token, file)

    if (uploadErr) {
      setUploadError(uploadErr.message ?? "Upload failed")
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    // Step 3: Record in DB
    const recordResult = await recordScreenshot({ projectId, storagePath, publicUrl })
    if (recordResult.success) {
      const newScreenshot: Screenshot = {
        id: recordResult.data.id,
        publicUrl,
        storagePath,
        caption: null,
        sortOrder: screenshots.length,
      }
      setScreenshots((prev) => [...prev, newScreenshot])
    } else {
      setUploadError(recordResult.error ?? "Failed to record screenshot")
    }

    // Reset file input so re-selecting the same file triggers onChange again
    if (fileInputRef.current) fileInputRef.current.value = ""
    setIsUploading(false)
  }

  function handleCaptionChange(id: string, value: string) {
    setPendingCaptions((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSaveCaption(id: string) {
    setSavingId(id)
    const caption = pendingCaptions[id] ?? ""
    const result = await updateScreenshotCaption(id, caption)
    if (result.success) {
      // Commit caption to local screenshot state
      setScreenshots((prev) =>
        prev.map((s) => (s.id === id ? { ...s, caption } : s))
      )
      // Clear dirty state
      setPendingCaptions((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
    setSavingId(null)
  }

  async function handleDelete(id: string) {
    // Optimistic remove
    const removed = screenshots.find((s) => s.id === id)
    setScreenshots((prev) => prev.filter((s) => s.id !== id))

    const result = await deleteScreenshot(id)
    if (!result.success && removed) {
      // Re-add on failure
      setScreenshots((prev) => [...prev, removed].sort((a, b) => a.sortOrder - b.sortOrder))
    }
  }

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <ImagePlus className="h-4 w-4 mr-2" />
            Add Screenshot
          </>
        )}
      </Button>

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      {/* Screenshot list */}
      {screenshots.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          No screenshots yet. Add one to showcase your project.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={screenshots.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {screenshots.map((screenshot) => (
                <SortableScreenshotCard
                  key={screenshot.id}
                  screenshot={screenshot}
                  pendingCaptions={pendingCaptions}
                  savingId={savingId}
                  onCaptionChange={handleCaptionChange}
                  onSaveCaption={handleSaveCaption}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
