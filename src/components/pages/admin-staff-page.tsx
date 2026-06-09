'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import type { AppPrivilege, User } from '@/models/user';
import { UserService, type UsersListResult } from '@/services/user.service';
import { useAppSelector } from '@/store/hooks';
import { AdminPageHeader } from '@/components/admin/page-header';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RequirePermission } from '@/components/admin/require-permission';
import { Loading } from '@/components/ui/loading';
import { statusColor } from '@/lib/utils';

const staffPositions = ['manager'] as const;

const allPrivileges: AppPrivilege[] = [
  'dashboard:read',
  'settings:manage',
  'blog:manage',
  'page:manage',
  'subscribers:read',
  'subscribers:manage',
  'staff:manage',
  'report:read',
  'notification:send',
];

const privilegeEnum = z.enum(
  allPrivileges as unknown as [AppPrivilege, ...AppPrivilege[]],
);

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(6),
  position: z.enum(staffPositions),
  isActive: z.boolean(),
  privileges: z.array(privilegeEnum).min(1),
});

type CreateValues = z.infer<typeof createSchema>;

function labelize(value: string) {
  return value
    .split('_')
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
    .join(' ');
}

export default function AdminStaffPage() {
  const currentUser = useAppSelector((s) => s.auth.user);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [draftPrivileges, setDraftPrivileges] = useState<Set<AppPrivilege>>(
    new Set(),
  );
  const [draftPosition, setDraftPosition] =
    useState<User['position']>('manager');
  const [draftActive, setDraftActive] = useState<boolean>(true);

  const {
    data,
    isLoading: loading,
    mutate,
  } = useSWR<UsersListResult>([
    '/user',
    { page: 1, limit: 1000, role: 'admin' },
  ]);

  const items = useMemo(
    () =>
      (data?.users ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)),
    [data?.users],
  );

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        accessorKey: 'name',
        header: 'Staff',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.name}</span>
            <span className='text-xs text-white/60'>{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: 'position',
        header: 'Position',
        cell: ({ row }) => (
          <Badge
            variant='outline'
            className='border-white/15 bg-white/[0.02] text-white/80'
          >
            {row.original.position
              ? labelize(row.original.position)
              : 'Unassigned'}
          </Badge>
        ),
      },
      {
        id: 'privileges',
        header: 'Privileges',
        cell: ({ row }) => (
          <span className='text-sm text-white/80'>
            {row.original.privileges?.length ?? 0}
          </span>
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant='outline'
            className={statusColor(
              row.original.isActive ? 'available' : 'neutral',
            )}
          >
            {row.original.isActive ? 'Active' : 'Disabled'}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className='flex justify-end gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setSelected(row.original);
                setDraftPrivileges(new Set(row.original.privileges ?? []));
                setDraftPosition(row.original.position ?? 'manager');
                setDraftActive(!!row.original.isActive);
                setEditOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={async () => {
                try {
                  await UserService.update(row.original.uid, {
                    isActive: !row.original.isActive,
                  });
                  toast.success(
                    row.original.isActive
                      ? 'Staff disabled'
                      : 'Staff activated',
                  );
                  void mutate();
                } catch (e) {
                  toast.error(
                    e instanceof Error ? e.message : 'Failed to update staff',
                  );
                }
              }}
            >
              {row.original.isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
        ),
      },
    ];
  }, [mutate]);

  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      position: 'manager',
      isActive: true,
      privileges: ['dashboard:read'],
    },
  });

  return (
    <RequirePermission privileges={['staff:manage']}>
      <div className='space-y-6'>
        <AdminPageHeader
          title='Staff'
          description='Manage admin users, roles, privileges, and access.'
          actions={
            <div className='flex items-center gap-2'>
              <Button variant='outline' onClick={() => void mutate()}>
                Refresh
              </Button>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button>New Staff</Button>
                </DialogTrigger>
                <DialogContent className='dark bg-background text-foreground max-w-2xl'>
                  <DialogHeader>
                    <DialogTitle>Create Staff</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      className='grid gap-4'
                      onSubmit={form.handleSubmit(async (values) => {
                        setCreateLoading(true);
                        try {
                          await UserService.create({
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            phone: values.phone?.trim()
                              ? values.phone.trim()
                              : '',
                            password: values.password,
                            role: 'admin',
                            position: values.position,
                            privileges: values.privileges,
                            isActive: values.isActive,
                          });
                          toast.success('Staff created');
                          setCreateOpen(false);
                          form.reset();
                          void mutate();
                        } catch (e) {
                          toast.error(
                            e instanceof Error
                              ? e.message
                              : 'Failed to create staff',
                          );
                        } finally {
                          setCreateLoading(false);
                        }
                      })}
                    >
                      <div className='grid gap-4 md:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='firstName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
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
                              <FormLabel>Last Name</FormLabel>
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
                                <Input type='email' {...field} />
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
                        <FormField
                          control={form.control}
                          name='position'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select position' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className='dark bg-background text-foreground'>
                                  {staffPositions.map((p) => (
                                    <SelectItem key={p} value={p}>
                                      {labelize(p)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='password'
                          render={({ field }) => (
                            <FormItem className='md:col-span-2'>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type='password' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='isActive'
                          render={({ field }) => (
                            <FormItem className='md:col-span-2'>
                              <div className='flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2'>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(v) => field.onChange(!!v)}
                                />
                                <span className='text-sm'>Active</span>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name='privileges'
                        render={({ field }) => {
                          const selected = new Set(field.value ?? []);
                          return (
                            <FormItem>
                              <FormLabel>Privileges</FormLabel>
                              <FormControl>
                                <div className='rounded-2xl border border-white/10 bg-white/[0.02]'>
                                  <ScrollArea className='h-[260px] p-3'>
                                    <div className='grid gap-2 md:grid-cols-2'>
                                      {allPrivileges.map((p) => {
                                        const checked = selected.has(p);
                                        return (
                                          <label
                                            key={p}
                                            className='flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2'
                                          >
                                            <Checkbox
                                              checked={checked}
                                              onCheckedChange={(v) => {
                                                const next = new Set(selected);
                                                if (v) next.add(p);
                                                else next.delete(p);
                                                field.onChange(
                                                  Array.from(next),
                                                );
                                              }}
                                            />
                                            <span className='text-sm'>
                                              {labelize(p)}
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </ScrollArea>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <div className='flex justify-end gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => setCreateOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type='submit' loading={createLoading}>
                          Create
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        <div className='rounded-lg border border-white/10 bg-white/[0.02] p-4'>
          {loading ? (
            <Loading className='py-10 text-white/60' label='Loading...' />
          ) : (
            <DataTable
              columns={columns}
              data={items}
              searchPlaceholder='Search staff...'
            />
          )}
        </div>

        <Dialog
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (v) return;
            setSelected(null);
            setDraftPrivileges(new Set());
          }}
        >
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Edit Staff</DialogTitle>
            </DialogHeader>

            {selected ? (
              <div className='grid gap-4'>
                <div className='rounded-xl border border-white/10 bg-white/[0.02] p-3'>
                  <div className='font-medium'>{selected.name}</div>
                  <div className='text-xs text-white/60'>{selected.email}</div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <div className='text-sm font-medium'>Position</div>
                    <Select
                      value={draftPosition ?? 'manager'}
                      onValueChange={(v) =>
                        setDraftPosition(v as User['position'])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select position' />
                      </SelectTrigger>
                      <SelectContent className='dark bg-background text-foreground'>
                        {staffPositions.map((p) => (
                          <SelectItem key={p} value={p}>
                            {labelize(p)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <div className='text-sm font-medium'>Active</div>
                    <label className='flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2'>
                      <Checkbox
                        checked={draftActive}
                        onCheckedChange={(v) => setDraftActive(!!v)}
                      />
                      <span className='text-sm'>
                        {draftActive ? 'Active' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='text-sm font-medium'>Privileges</div>
                  <div className='rounded-2xl border border-white/10 bg-white/[0.02]'>
                    <ScrollArea className='h-[260px] p-3'>
                      <div className='grid gap-2 md:grid-cols-2'>
                        {allPrivileges.map((p) => {
                          const checked = draftPrivileges.has(p);
                          return (
                            <label
                              key={p}
                              className='flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2'
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) => {
                                  const next = new Set(draftPrivileges);
                                  if (v) next.add(p);
                                  else next.delete(p);
                                  setDraftPrivileges(next);
                                }}
                              />
                              <span className='text-sm'>{labelize(p)}</span>
                            </label>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <div className='flex justify-end gap-2'>
                  <Button variant='outline' onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await UserService.update(selected.uid, {
                          privileges: Array.from(draftPrivileges),
                          position: draftPosition,
                          isActive: draftActive,
                        });
                        toast.success('Staff updated');
                        setEditOpen(false);
                        void mutate();
                      } catch (e) {
                        toast.error(
                          e instanceof Error
                            ? e.message
                            : 'Failed to update staff',
                        );
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </RequirePermission>
  );
}
