import React from 'react';

interface PageHeroProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ title, description, children }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary">{title}</h1>
      {description && <p className="text-lg">{description}</p>}
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHero;
