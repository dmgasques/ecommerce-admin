import prismadb from '@/lib/prismadb';

type DashboardProps = {
  params: {
    storeId: string;
  };
};

export default async function Dashboard({ params }: DashboardProps) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId
    }
  });

  return <div>Active store: {store?.name}</div>;
}
