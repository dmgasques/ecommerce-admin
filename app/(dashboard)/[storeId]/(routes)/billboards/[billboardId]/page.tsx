import prismadb from '@/lib/prismadb';
import { NextPage } from 'next';
import BillboardForm from './components/billboard-form';

type BillboardPageProps = {
  params: {
    billboardId: string;
  };
};

const BillboardPage: NextPage<BillboardPageProps> = async ({ params }) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId
    }
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm billboard={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
