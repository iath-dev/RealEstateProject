import React from 'react';

import PageHero from '@/components/common/PageHero';
import PropertiesGrid from '@/components/common/PropertiesGrid';
import PropertyDialog from '@/components/common/PropertyDialog';
import PropertyFilters from '@/components/common/PropertyFilters';
import MainLayout from '@/components/layout/MainLayout';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <PageHero
        title="Real Estate"
        description="Explore and invest in tokenized real estate properties using blockchain technology."
      >
        <PropertyFilters />
      </PageHero>
      <PropertiesGrid />
      <PropertyDialog />
    </MainLayout>
  );
};

export default HomePage;
