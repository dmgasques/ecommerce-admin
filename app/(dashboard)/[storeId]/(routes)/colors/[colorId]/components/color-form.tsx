'use client';

import { Color } from '@prisma/client';
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'The value should be a valid hex code.'
  })
});

type ColorValues = z.infer<typeof formSchema>;

type ColorFormProps = {
  color: Color | null;
};

function ColorForm({ color }: ColorFormProps) {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = color ? 'Edit color' : 'Create color';
  const description = color ? 'Edit a color' : 'Add a new color';
  const toastMessage = color ? 'Color updated.' : 'Color created.';
  const action = color ? 'Save changes' : 'Create';

  const form = useForm<ColorValues>({
    resolver: zodResolver(formSchema),
    defaultValues: color || {
      name: '',
      value: ''
    }
  });

  const onSubmit = async (values: ColorValues) => {
    setLoading(true);

    try {
      if (color) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values
        );
        console.log(data);
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/colors`,
          values
        );
        console.log(data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast({
        title: 'Color deleted'
      });
    } catch (error) {
      toast({
        title: 'Make sure you remove all products using this color first.',
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
        {color && (
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
                      placeholder='Color name'
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
                    <div className='flex items-center gap-x-4'>
                      <Input
                        disabled={loading}
                        placeholder='Color value'
                        {...field}
                      />
                      <div
                        className='border p-4 rounded-full'
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default ColorForm;
