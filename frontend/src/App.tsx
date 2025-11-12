import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Hello World</h1>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </main>
  );
}

export default App;
