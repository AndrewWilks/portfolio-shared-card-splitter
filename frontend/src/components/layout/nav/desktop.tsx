import { Link } from "@tanstack/react-router";
import ThemeBtn from "../../ui/theme/btn.tsx";
import { useAuth } from "../../../auth/AuthContext.tsx";
import LogoutBtn from "../../../auth/ui/logoutBtn.tsx";

export default function NavDesktop() {
  const { isAuthenticated } = useAuth();
  return (
    <header className=" border-b">
      <div className="flex items-center justify-between container mx-auto p-4">
        <Link to="/">Shared Card Splitter</Link>
        <nav>
          {isAuthenticated && <LogoutBtn />}
          <ThemeBtn />
        </nav>
      </div>
    </header>
  );
}
