import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-input"></div>
      <div className="skeleton-button"></div>
      <div className="skeleton-results">
        <div className="skeleton-heading"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 