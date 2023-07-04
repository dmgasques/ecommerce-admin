'use client';

import { Billboard, Size } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Heading from '@/components/heading';
import AlertModal from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useOrigin } from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string()
});

type SizeValues = z.infer<typeof formSchema>;

type SizeFormProps = {
  size: Size | null;
};

function SizeForm({ size }: SizeFormProps) {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = size ? 'Edit size' : 'Create size';
  const description = size ? 'Edit a size' : 'Add a new size';
  const toastMessage = size ? 'Size updated.' : 'Size created.';
  const action = size ? 'Save changes' : 'Create';

  const form = useForm<SizeValues>({
    resolver: zodResolver(formSchema),
    defaultValues: size || {
      name: '',
      value: ''
    }
  });

  const onSubmit = async (values: SizeValues) => {
    setLoading(true);

    try {
      if (size) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          values
        );
        console.log(data);
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/sizes`,
          values
        );
        console.log(data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({
        title: toastMessage
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({
        title: 'Size deleted'
      });
    } catch (error) {
      toast({
        title: 'Make sure you remove all products using this size first.',
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
        <Heading title={title} description={description} />
        {size && (
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
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
                      placeholder='Size name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Size value'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}

export default SizeForm;
