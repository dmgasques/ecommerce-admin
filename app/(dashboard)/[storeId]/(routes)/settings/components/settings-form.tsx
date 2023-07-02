'use client';

import Heading from '@/components/heading';
import AlertModal from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import prismadb from '@/lib/prismadb';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1)
});

type SettingsValues = z.infer<typeof formSchema>;

type SettingsFormProps = {
  store: Store;
};

function SettingsForm({ store }: SettingsFormProps) {
  const router = useRouter();
  const { storeId } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(formSchema),
    defaultValues: store
  });

  const onSubmit = async (values: SettingsValues) => {
    setLoading(true);

    try {
      const { data } = await axios.patch(`/api/stores/${storeId}`, values);
      router.refresh();
      toast({
        title: 'Update successfull'
      });
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);

    try {
      await axios.delete(`/api/stores/${storeId}`);
      router.refresh();
      router.push('/');
      toast({
        title: 'Store deleted'
      });
    } catch (error) {
      toast({
        title: 'Make sure you remove all products and catogories first.',
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className='flex justify-between items-center'>
        <Heading title='Settings' description='Manage store preferences' />
        <Button
          disabled={loading}
          variant='destructive'
          size='sm'
          onClick={() => setOpen(true)}
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Store name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${storeId}`}
        variant='public'
      />
    </>
  );
}

export default SettingsForm;
