import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { NextPage } from 'next';
import React from 'react';
import { CategoryColumn } from './components/columns';
import CategoriesClient from './components/client';

type CategoriesPageProps = {
  params: {
    storeId: string;
  };
};

const CategoriesPage: NextPage<CategoriesPageProps> = async ({ params }) => {
  const { storeId } = params;
  const categories = await prismadb.category.findMany({
    where: {
      storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    ({ id, name, billboard, createdAt }) => ({
      id,
      name,
      billboardLabel: billboard.label,
      createdAt: format(createdAt, 'MMMM do, yyyy')
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
