import Providers from "./providers";
import "./globals.css";

export const metadata = { title: "MeetPlan | Dashboard", description: "A meeting planner dashboard" };
export default function RootLayout({ children }) { return <html lang="en"><body><Providers>{children}</Providers></body></html>; }
