'use client';

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
import { Billboard, Category } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string()
});

type CategoryValues = z.infer<typeof formSchema>;

type CategoryFormProps = {
  category: Category | null;
  billboards: Billboard[];
};

function CategoryForm({ category, billboards }: CategoryFormProps) {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = category ? 'Edit category' : 'Create category';
  const description = category ? 'Edit a category' : 'Add a new category';
  const toastMessage = category ? 'Category updated.' : 'Category created.';
  const action = category ? 'Save changes' : 'Create';

  const form = useForm<CategoryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: '',
      billboardId: ''
    }
  });

  const onSubmit = async (values: CategoryValues) => {
    setLoading(true);

    try {
      if (category) {
        const { data } = await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values
        );
        console.log(data);
      } else {
        const { data } = await axios.post(
          `/api/${params.storeId}/categories`,
          values
        );
        console.log(data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast({
        title: 'Category deleted'
      });
    } catch (error) {
      toast({
        title: 'Make sure you remove all products using this category first.',
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
        {category && (
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
                      placeholder='Category name...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder='Select a billboard...'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}{' '}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
