import React from 'react';
import './PageContainer.scss';

export const PageContainer = ({ children, noPadding = false }) => {
  return <div className={`pageContainer ${noPadding ? 'no-padding' : ''}`}>{children}</div>;
};
