import React, { useEffect, useState } from 'react';

function App() {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data === 'ping') iframe?.contentWindow?.postMessage('increase', '*');
    };
    window.addEventListener('message', listener);
  }, [iframe]);

  return (
    <>
      <iframe
        ref={setIframe}
        src="http://localhost:3001"
        title="iframe"
        style={{ width: '100%', height: '50vh', border: 'none' }}
      />
      <div style={{ height: '50vh', borderTop: '1px solid #000' }}>
        <p>Out Frame</p>
      </div>
    </>
  );
}

export default App;
