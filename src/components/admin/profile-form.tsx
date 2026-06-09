'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import type { Media } from '@/models/media';
import type { User } from '@/models/user';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/store/slices/auth-slice';
import { MediaManager } from '@/components/admin/media-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().optional().or(z.literal('')),
});

type Values = z.infer<typeof schema>;

function toImageMedia(url: string | undefined): Media | null {
  const u = (url ?? '').trim();
  if (!u) return null;
  return { url: u, type: 'image', alt: '' };
}

export function ProfileForm({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const defaults = useMemo<Values>(() => {
    return {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      avatarUrl: user.avatarUrl ?? '',
    };
  }, [user]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    form.reset(defaults);
  }, [defaults, form]);

  const [avatar, setAvatar] = useState<Media | null>(() =>
    toImageMedia(user.avatarUrl),
  );

  const [saving, setSaving] = useState(false);

  async function submit(values: Values) {
    setSaving(true);
    try {
      await dispatch(
        updateProfile({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phone: values.phone?.trim() || '',
          avatarUrl: values.avatarUrl?.trim() || undefined,
        }),
      ).unwrap();
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className='space-y-6'>
        <Card className='border-white/10 bg-white/5'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-white'>Profile</CardTitle>
            <CardDescription className='text-white/70'>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='md:col-span-2'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='space-y-2 md:col-span-2'>
              <div className='text-sm font-medium'>Avatar</div>
              <MediaManager
                value={avatar}
                onChange={(m) => {
                  const media = (m as Media | null) ?? null;
                  setAvatar(media);
                  form.setValue('avatarUrl', media?.url ?? '');
                }}
                defaultType='image'
                triggerLabel='Select avatar'
              />
              <FormField
                control={form.control}
                name='avatarUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='Avatar URL' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={() => form.reset(defaults)}>
            Reset
          </Button>
          <Button type='submit' loading={saving}>
            Save profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
