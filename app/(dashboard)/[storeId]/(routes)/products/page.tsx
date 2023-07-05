import { NextPage } from 'next';
import ProductsClient from './components/client';
import prismadb from '@/lib/prismadb';
import { ProductColumn } from './components/columns';
import { format } from 'date-fns';
import { priceFormater } from '@/lib/utils';

type ProductsPageProps = {
  params: {
    storeId: string;
  };
};

const ProductsPage: NextPage<ProductsPageProps> = async ({ params }) => {
  const { storeId } = params;
  const products = await prismadb.product.findMany({
    where: {
      storeId
    },
    include: {
      category: true,
      color: true,
      size: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map(
    ({
      id,
      name,
      price,
      createdAt,
      isFeatured,
      isArchived,
      category,
      color,
      size
    }) => ({
      id,
      name,
      isFeatured,
      isArchived,
      price: priceFormater.format(price.toNumber()),
      category: category.name,
      size: size.name,
      color: color.value,
      createdAt: format(createdAt, 'MMMM do, yyyy')
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
