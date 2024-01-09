import React, { useEffect, useState } from 'react';

function App() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    window.parent.postMessage('ping', '*');

    const listener = async (event: MessageEvent) => {
      const data = (() => {
        try {
          return JSON.parse(event.data);
        } catch (error) {
          return null;
        }
      })();

      const exposes: Record<string, (params: Record<string, any>) => Promise<any> | any> = {
        increase: () => {
          return new Promise((resolve) => {
            setCount((count) => {
              resolve({ count: count + 1 });
              return count + 1;
            });
          });
        },
        setCount: ({ count }) => {
          setCount(count);
        },
        getToken: () => {
          return { token: 'Hello' };
        },
      };

      if (data?.method && exposes[data.method]) {
        try {
          const response = await exposes[data.method](data.params);
          window.parent.postMessage(
            JSON.stringify({ data: response, type: 'success', id: data.id }),
            '*'
          );
        } catch (error) {
          window.parent.postMessage(
            JSON.stringify({ data: error, type: 'success', id: data.id }),
            '*'
          );
        }
      }
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
