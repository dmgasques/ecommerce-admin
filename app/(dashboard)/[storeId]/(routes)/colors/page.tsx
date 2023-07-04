import { NextPage } from 'next';
import prismadb from '@/lib/prismadb';
import { ColorColumn } from './components/columns';
import { format } from 'date-fns';
import SizesClient from './components/client';

type ColorsPageProps = {
  params: {
    storeId: string;
  };
};

const ColorsPage: NextPage<ColorsPageProps> = async ({ params }) => {
  const { storeId } = params;
  const colors = await prismadb.color.findMany({
    where: {
      storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedColors: ColorColumn[] = colors.map(
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
        <SizesClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
