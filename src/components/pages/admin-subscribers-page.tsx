'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { RefreshCcw } from 'lucide-react';

import type { SubscriberType } from '@/models/subscriber';
import { SubscriberService, type SubscribersListResult } from '@/services/subscriber.service';
import { AdminPageHeader } from '@/components/admin/page-header';
import { RequirePermission } from '@/components/admin/require-permission';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDate(isoString: string) {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

export default function AdminSubscribersPage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState<SubscriberType | 'all'>('all');
  const [page, setPage] = useState(1);

  const limit = 20;

  const params = useMemo(() => {
    const trimmed = q.trim();
    return {
      q: trimmed ? trimmed : undefined,
      type: type === 'all' ? undefined : type,
      page,
      limit,
    };
  }, [q, type, page]);

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR<SubscribersListResult>(
    ['/subscriber', params],
    () => SubscriberService.list(params),
  );

  const subscribers = data?.subscribers ?? [];
  const pagination = data?.pagination;

  const hasPrev = page > 1;
  const hasNext = pagination ? pagination.hasMore : subscribers.length === limit;

  return (
    <RequirePermission privileges={['subscribers:read', 'subscribers:manage']}>
      <div className='space-y-6'>
        <AdminPageHeader
          title='Subscribers'
          description='Review enquiries and newsletter sign-ups.'
          actions={
            <Button variant='outline' onClick={() => void mutate()}>
              <RefreshCcw className='h-4 w-4' />
              Refresh
            </Button>
          }
        />

        <Card className='border-white/10 bg-white/5'>
          <CardHeader className='gap-3'>
            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              <div className='space-y-1'>
                <CardTitle className='text-white'>All subscribers</CardTitle>
                <CardDescription className='text-white/70'>
                  {pagination?.total !== undefined
                    ? `${pagination.total} total`
                    : 'Filter and browse subscriber records.'}
                </CardDescription>
              </div>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <Input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder='Search name or email…'
                  className='h-9 w-full sm:w-72'
                />
                <Select
                  value={type}
                  onValueChange={(v) => {
                    setType(v as SubscriberType | 'all');
                    setPage(1);
                  }}
                >
                  <SelectTrigger className='h-9 w-full sm:w-44'>
                    <SelectValue placeholder='Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='enquiry'>Enquiry</SelectItem>
                    <SelectItem value='newsletter'>Newsletter</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className='pt-0'>
            {loading && !data ? (
              <div className='py-10'>
                <Loading label='Loading subscribers…' />
              </div>
            ) : error ? (
              <div className='rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/80'>
                Unable to load subscribers. Please try again.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className='border-white/10'>
                      <TableHead className='text-white/80'>Contact</TableHead>
                      <TableHead className='text-white/80'>Type</TableHead>
                      <TableHead className='text-white/80'>Message</TableHead>
                      <TableHead className='text-right text-white/80'>
                        Created
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.length ? (
                      subscribers.map((s) => (
                        <TableRow
                          key={s.id ?? `${s.email}-${s.createdAt}`}
                          className='border-white/10'
                        >
                          <TableCell className='min-w-0'>
                            <div className='min-w-0'>
                              <div className='truncate font-medium text-white'>
                                {s.name || 'Unknown'}
                              </div>
                              <div className='truncate text-xs text-white/60'>
                                {s.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant='outline'
                              className='border-white/15 bg-white/[0.02] text-white/80'
                            >
                              {s.type}
                            </Badge>
                          </TableCell>
                          <TableCell className='min-w-0'>
                            <div className='max-w-[520px] truncate text-sm text-white/70'>
                              {s.metadata?.message ?? '—'}
                            </div>
                          </TableCell>
                          <TableCell className='text-right text-sm text-white/70'>
                            {formatDate(s.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className='border-white/10'>
                        <TableCell colSpan={4} className='py-10'>
                          <div className='text-center text-sm text-white/70'>
                            No subscribers found.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='text-sm text-white/70'>
                    {pagination?.total !== undefined ? (
                      <>
                        Page {pagination.page} of {pagination.totalPages}
                      </>
                    ) : (
                      <>Page {page}</>
                    )}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={!hasPrev}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={!hasNext}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </RequirePermission>
  );
}
