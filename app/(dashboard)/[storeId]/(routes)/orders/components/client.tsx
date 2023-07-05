'use client';

import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { OrderColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

type OrdersClientProps = {
  data: OrderColumn[];
};

const OrdersClient: React.FC<OrdersClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description='Manage orders for your store'
      />

      <Separator />
      <DataTable columns={columns} data={data} searchKey='products' />
    </>
  );
};

export default OrdersClient;
