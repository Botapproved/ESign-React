import React from 'react';

const ThreeJsIframe = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <iframe
        src="https://gkjohnson.github.io/three-mesh-bvh/example/bundle/edgeIntersect.html" // Replace with the URL of your Three.js project
        title="Three.js Project"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allowFullScreen
      />
    </div>
  );
};

export default ThreeJsIframe;
