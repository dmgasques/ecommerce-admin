import { NextPage } from 'next';
import BillboardClient from './components/client';
import prismadb from '@/lib/prismadb';
import { BillboardColumn } from './components/columns';
import { format } from 'date-fns';

type BillboardsPageProps = {
  params: {
    storeId: string;
  };
};

const BillboardsPage: NextPage<BillboardsPageProps> = async ({ params }) => {
  const { storeId } = params;
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    ({ id, label, createdAt }) => ({
      id,
      label,
      createdAt: format(createdAt, 'MMMM do, yyyy')
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
