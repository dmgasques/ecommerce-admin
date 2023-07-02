import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { storeId } = params;
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Bad request. Missing data.', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Id is required', { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId
      },
      data: {
        name
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { storeId } = params;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Id is required', { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
