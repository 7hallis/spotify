import { AppearanceSection } from "../components/AppearanceSection";

// http://127.0.0.1:3000/api/auth/callback/spotify
export default function SpotifyDashboard() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <h1>Spotify Dashboard</h1>
        <p>Welcome to your Spotify Dashboard!</p>
        <div>
          <p>Customization</p>
          <p>aparencia</p>

          <div>
            <AppearanceSection />
            
          </div>
        </div>

      </div>
    </div>
  );
}
