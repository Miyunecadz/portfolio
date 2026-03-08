"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaGrid } from "@/components/admin/media-grid"
import type { MediaAsset } from "@/lib/queries/media"

interface MediaPickerProps {
  trigger: React.ReactNode
  onSelect: (asset: MediaAsset) => void
  filter?: "image" | "pdf" | "all"
  assets: MediaAsset[]
}

export function MediaPicker({
  trigger,
  onSelect,
  filter = "all",
  assets,
}: MediaPickerProps) {
  const [open, setOpen] = useState(false)

  function handleSelect(asset: MediaAsset) {
    onSelect(asset)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="select">
          <TabsList>
            <TabsTrigger value="select">Select</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="select">
            <MediaGrid
              initialAssets={assets}
              selectable={true}
              filter={filter}
              onSelect={handleSelect}
            />
          </TabsContent>
          <TabsContent value="upload">
            <MediaGrid
              initialAssets={[]}
              selectable={true}
              filter={filter}
              onSelect={handleSelect}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Upload a new file — it will appear in the Select tab after upload.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
