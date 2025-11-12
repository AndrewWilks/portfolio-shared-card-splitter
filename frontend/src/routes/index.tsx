import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [count, setCount] = useState(0);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then((data) => setApiMessage(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>Count: {count}</p>
      <p>API says: {apiMessage}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
