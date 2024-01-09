import React, { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    window.parent.postMessage('ping', '*');

    const listener = (event: MessageEvent) => {
      if (event.data === 'increase') setCount((count) => count + 1);
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [setCount]);

  return (
    <div>
      <p>Inside iframe {count}</p>
      <button onClick={() => setCount((count) => count - 1)}>Decrease</button>
    </div>
  );
}

export default App;
