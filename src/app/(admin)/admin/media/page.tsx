import { getMediaAssets } from "@/lib/queries/media"
import { MediaGrid } from "@/components/admin/media-grid"

export default async function MediaPage() {
  const assets = await getMediaAssets()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {assets.length} file{assets.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <MediaGrid initialAssets={assets} />
    </div>
  )
}
