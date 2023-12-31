import prismadb from '@/lib/prismadb';
import { NextPage } from 'next';
import SizeForm from './components/size-form';

type SizePageProps = {
  params: {
    sizeId: string;
  };
};

const SizePage: NextPage<SizePageProps> = async ({ params }) => {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId
    }
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm size={size} />
      </div>
    </div>
  );
};

export default SizePage;
