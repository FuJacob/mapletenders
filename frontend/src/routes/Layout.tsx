import { Outlet } from "react-router-dom";
import { Footer } from "../components";
import { Header } from "../components";
export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
