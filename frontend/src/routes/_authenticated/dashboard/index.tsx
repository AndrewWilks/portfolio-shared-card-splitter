import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/AuthContext.tsx";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const [count, setCount] = useState(0);
  const [apiMessage, setApiMessage] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then((data) => setApiMessage(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div className="p-2">
      <h3>Welcome Home, {user?.fullName}!</h3>
      <p>Count: {count}</p>
      <p>API says: {apiMessage}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
