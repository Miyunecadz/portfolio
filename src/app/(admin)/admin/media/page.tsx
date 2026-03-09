import { getMediaAssets } from "@/lib/queries/media"
import { MediaGrid } from "@/components/admin/media-grid"
import { MediaCategoryFilter } from "@/components/admin/media-category-filter"

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const activeCategory = category ?? "all"
  const section = activeCategory !== "all" ? activeCategory : undefined
  const assets = await getMediaAssets(section)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {assets.length} file{assets.length !== 1 ? "s" : ""}
            {activeCategory !== "all" ? ` in ${activeCategory}` : ""}
          </p>
        </div>
      </div>
      <MediaCategoryFilter activeCategory={activeCategory} />
      <MediaGrid key={activeCategory} initialAssets={assets} />
    </div>
  )
}
