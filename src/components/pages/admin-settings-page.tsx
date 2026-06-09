'use client';

import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSystemSettings } from '@/store/slices/content-slice';
import { hasAnyPermission } from '@/components/admin/admin-nav';
import { AdminPageHeader } from '@/components/admin/page-header';
import { ProfileForm } from '@/components/admin/profile-form';
import { SecurityForm } from '@/components/admin/security-form';
import { SystemSettingsForm } from '@/components/admin/system-settings-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { systemSettings } = useAppSelector((s) => s.content.content);

  const canManageSettings = hasAnyPermission(user, ['settings:manage']);
  const canReadSettings = hasAnyPermission(user, ['settings:manage', 'settings:read']);

  if (!canReadSettings) {
    return (
      <div className='space-y-4'>
        <AdminPageHeader
          title='Settings'
          description="You don't have access to view settings."
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        title='Settings'
        description='System configuration, profile, and security.'
      />

      <Tabs defaultValue={canManageSettings ? 'system' : 'profile'}>
        <TabsList className='bg-white/5 ring-1 ring-white/10'>
          {canManageSettings ? (
            <TabsTrigger value='system'>System</TabsTrigger>
          ) : null}
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>

        {canManageSettings ? (
          <TabsContent value='system' className='pt-4'>
            {systemSettings ? (
              <SystemSettingsForm
                initial={systemSettings}
                onSave={async (next) => {
                  try {
                    await dispatch(
                      updateSystemSettings(next),
                    ).unwrap();
                    toast.success('Settings saved');
                  } catch {
                    toast.error('Failed to save settings');
                  }
                }}
              />
            ) : null}
          </TabsContent>
        ) : null}

        <TabsContent value='profile' className='pt-4'>
          {user ? <ProfileForm user={user} /> : null}
        </TabsContent>

        <TabsContent value='security' className='pt-4'>
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
