import { NextPage } from 'next';
import prismadb from '@/lib/prismadb';
import { SizeColumn } from './components/columns';
import { format } from 'date-fns';
import SizesClient from './components/client';

type SizesPageProps = {
  params: {
    storeId: string;
  };
};

const SizesPage: NextPage<SizesPageProps> = async ({ params }) => {
  const { storeId } = params;
  const sizes = await prismadb.size.findMany({
    where: {
      storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedSizes: SizeColumn[] = sizes.map(
    ({ id, name, value, createdAt }) => ({
      id,
      name,
      value,
      createdAt: format(createdAt, 'MMMM do, yyyy')
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
