'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signIn } from '@/store/slices/auth-slice';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2 } from 'lucide-react';

const signinSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function AdminSigninPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { systemSettings } = useAppSelector((s) => s.content.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SigninFormValues) {
    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(signIn(values));
      if (signIn.fulfilled.match(resultAction)) {
        toast.success('Welcome back, Admin!');
        router.push('/admin/dashboard');
      } else {
        toast.error(error || 'Sign in failed. Please check your credentials.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='w-full border-none outline-none'>
      <CardHeader className='space-y-1 text-center'>
        <div className='flex justify-center mb-4'>
          <div className='p-3 rounded-full bg-primary/10 text-primary'>
            <ShieldCheck size={32} />
          </div>
        </div>
        <CardTitle className='text-2xl font-bold tracking-tight'>
          Admin Sign In
        </CardTitle>
        <CardDescription>{systemSettings.siteDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='admin@elcielohomes.ng' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full mt-6'
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex flex-col text-center border-t py-4 bg-muted/30'>
        <p className='text-xs text-muted-foreground'>
          {systemSettings?.siteName ?? ''} Management System &copy;{' '}
          {new Date().getFullYear()}
        </p>
      </CardFooter>
    </Card>
  );
}
