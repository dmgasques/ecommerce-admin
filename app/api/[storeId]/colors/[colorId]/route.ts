import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_GET]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name || !value) {
      return new NextResponse('Bad request. Missing data.', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (store === null) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse('Color ID is required', { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (store === null) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const deleted = await prismadb.color.deleteMany({
      where: {
        id: params.colorId
      }
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
