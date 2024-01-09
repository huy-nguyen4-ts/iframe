import React, { useEffect, useState } from 'react';
import { postMessage } from './PostMessage';

postMessage.initialize();

function App() {
  const [render, setRender] = useState(false);

  useEffect(() => {
    postMessage.methods.increase().then(console.log);
    postMessage.methods.getToken().then(console.log);
    setTimeout(() => {
      postMessage.methods.setCount({ count: 100 });
    }, 3000);
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
        ref={(iframe) => iframe && postMessage.setIframe(iframe)}
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
