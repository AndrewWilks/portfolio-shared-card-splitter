import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./router.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </StrictMode>
  );
}
