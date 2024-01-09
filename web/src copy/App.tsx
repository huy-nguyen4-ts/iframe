import React from 'react';

function App() {
  return (
    <>
      <iframe
        src="http://localhost:3001"
        title="iframe"
        style={{ width: '100%', height: '50vh', border: 'none' }}
      />
      <div style={{ height: '50vh' }}>Out Frame</div>
    </>
  );
}

export default App;
