import { NextPage } from 'next';
import OrdersClient from './components/client';
import prismadb from '@/lib/prismadb';
import { OrderColumn } from './components/columns';
import { format } from 'date-fns';
import { priceFormater } from '@/lib/utils';

type OrdersPageProps = {
  params: {
    storeId: string;
  };
};

const OrdersPage: NextPage<OrdersPageProps> = async ({ params }) => {
  const { storeId } = params;
  const orders = await prismadb.order.findMany({
    where: {
      storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map(
    ({ id, phone, address, orderItems, isPaid, createdAt }) => ({
      id,
      phone,
      address,
      isPaid,
      products: orderItems.map((item) => item.product.name).join(', '),
      total: priceFormater.format(
        orderItems.reduce((total, item) => {
          return total + Number(item.product.price);
        }, 0)
      ),
      createdAt: format(createdAt, 'MMMM do, yyyy')
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
