import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <section className=" bg-base-200 flex flex-col overflow-x-hidden">
      <main className="container mx-auto px-2 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        {children}
      </main>
    </section>
  );
};

export default MainLayout;
