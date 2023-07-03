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
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useOrigin } from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().url()
});

type BillboardValues = z.infer<typeof formSchema>;

type BillboardFormProps = {
  billboard: Billboard | null;
};

function BillboardForm({ billboard }: BillboardFormProps) {
  const router = useRouter();
  const origin = useOrigin();
  const { storeId, billboardId } = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = billboard ? 'Edit billboard' : 'Create billboard';
  const description = billboard ? 'Edit a billboard' : 'Add a new billboard';
  const toastMessage = billboard ? 'Billboard updated.' : 'Billboard created.';
  const action = billboard ? 'Save changes' : 'Create';

  const form = useForm<BillboardValues>({
    resolver: zodResolver(formSchema),
    defaultValues: billboard || {
      label: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (values: BillboardValues) => {
    setLoading(true);

    try {
      if (billboard) {
        const { data } = await axios.patch(
          `/api/${storeId}/billboards/${billboardId}`,
          values
        );
        console.log(data);
      } else {
        const { data } = await axios.post(`/api/${storeId}/billboards`, values);
        console.log(data);
      }
      router.refresh();
      router.push(`/${storeId}/billboards`);
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
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
      router.refresh();
      router.push(`/${storeId}/billboards`);
      toast({
        title: 'Billboard deleted'
      });
    } catch (error) {
      toast({
        title:
          'Make sure you remove all catogories using this billboard first.',
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
        {billboard && (
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
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Billboard label'
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

export default BillboardForm;
