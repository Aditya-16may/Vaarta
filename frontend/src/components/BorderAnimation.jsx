import React from 'react'

function BorderAnimation({ children }) {
  return (
    <div className="animated-border w-full h-full flex overflow-hidden rounded-3xl">
      {children}
    </div>
  );
}

export default BorderAnimation;
