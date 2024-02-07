import React from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import './PageContainer.scss';

export const PageContainer = ({ children }) => {
  return (
    <div className="pageContainer">
      <div className="page">{children}</div>
    </div>
  );
};
