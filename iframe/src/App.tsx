import React, { useEffect, useState } from 'react';
import { postMessage } from './PostMessage';

postMessage.initialize();

function App() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    postMessage.register('increase', () => {
      return new Promise((resolve) => {
        setCount((count) => {
          resolve({ count: count + 1 });
          return count + 1;
        });
      });
    });
    postMessage.register('setCount', ({ count }) => {
      setCount(count);
    });
    postMessage.register('getToken', () => {
      return { token: 'Hello' };
    });
  }, []);

  return (
    <div>
      <p>Inside iframe {count}</p>
      <button onClick={() => setCount((count) => count - 1)}>Decrease</button>
    </div>
  );
}

export default App;
