import { CurrentlyPlaying } from "./components/CurrentlyPlaying";
import { UserProfile } from "./components/UserProfile";
import PlayerPage from "./player/[username]/page";
import SpotifyDashboard from "./SpotifyDashboard/page";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <UserProfile />
    {/* <SpotifyDashboard /> */}
    <PlayerPage />
    {/* <CurrentlyPlaying/> */}
    </div>
  )
}
