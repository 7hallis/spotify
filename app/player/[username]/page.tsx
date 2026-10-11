import { SpotifyLogin } from "@/app/components/SpotifyLogin";
import { AppearanceEditor } from "@/app/components/player/AppearanceEditor";


export default function PlayerPage() {
  return (
    <>
    <SpotifyLogin />
    <AppearanceEditor />
    </>
  )
}