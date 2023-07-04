import prismadb from '@/lib/prismadb';
import { NextPage } from 'next';
import CategoryForm from './components/category-form';

type CategoryPageProps = {
  params: {
    categoryId: string;
    storeId: string;
  };
};

const CategoryPage: NextPage<CategoryPageProps> = async ({ params }) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId
    }
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm category={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
