import React, { useEffect, useState } from 'react';

let iframeResolve: (iframe: HTMLIFrameElement) => void;
let iframePromise = new Promise<HTMLIFrameElement>((resolve) => {
  iframeResolve = resolve;
});
let isPingResolve: (isPing: boolean) => void;
let isPingPromise = new Promise((resolve) => {
  isPingResolve = resolve;
});

const listener = (event: MessageEvent) => {
  if (event.data === 'ping') isPingResolve(true);
};
window.addEventListener('message', listener);

const call = async (data: string) => {
  await isPingPromise;
  const iframe = await iframePromise;
  iframe.contentWindow?.postMessage(data, '*');
};

function App() {
  const [render, setRender] = useState(false);
  useEffect(() => {
    call('increase');
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setRender(true);
    }, 1000);
  }, []);

  if (!render) return null;
  return (
    <>
      <iframe
        ref={iframeResolve}
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
