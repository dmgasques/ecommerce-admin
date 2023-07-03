import { NextPage } from 'next';
import BillboardClient from './components/client';

type BillboardsPageProps = {};

const BillboardsPage: NextPage<BillboardsPageProps> = (props) => {
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient />
      </div>
    </div>
  );
};

export default BillboardsPage;
