import { getProfile } from "@/lib/queries/profile"
import { getMediaAssets } from "@/lib/queries/media"
import { ProfileForm } from "@/components/admin/profile-form"

export default async function ProfilePage() {
  const [profile, mediaAssets] = await Promise.all([
    getProfile(),
    getMediaAssets(),
  ])

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Your public profile information.</p>
      </div>
      <ProfileForm profile={profile} mediaAssets={mediaAssets} />
    </div>
  )
}
