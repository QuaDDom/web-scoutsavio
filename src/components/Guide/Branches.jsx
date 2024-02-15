import React from 'react';
import { BranchCard } from './BranchCard';

export const Branches = () => {
  return (
    <div>
      <h2 className="title text-4xl font-bold">Ramas</h2>
      <div className="cardsContainer">
        <BranchCard />
        <BranchCard />
        <BranchCard />
      </div>
    </div>
  );
};
