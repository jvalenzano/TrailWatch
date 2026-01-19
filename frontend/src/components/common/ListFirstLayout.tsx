
import React from 'react';

interface ListFirstLayoutProps {
  listContent: React.ReactNode;
  mapContent: React.ReactNode;
}

export function ListFirstLayout({ listContent, mapContent }: ListFirstLayoutProps) {
  return (
    <div className="flex h-full">
      <div className="w-3/5 p-4">{listContent}</div>
      <div className="w-2/5 p-4">{mapContent}</div>
    </div>
  );
}
