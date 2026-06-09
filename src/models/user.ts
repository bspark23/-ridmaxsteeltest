export interface UserSession {
  deviceId: string;
  deviceType: 'iOS' | 'Android' | 'Web';
  deviceModel?: string;
  pushNotificationToken?: string;
  lastActive: string;
  lastLogin?: string;
  ipAddress?: string;
}

export type UserRole = 'admin' | 'customer';

// ======================
// PRIVILEGES
// ======================
export type AppPrivilege =
  | 'dashboard:read'
  | 'settings:read'
  | 'settings:manage'
  | 'blog:manage'
  | 'page:manage'
  | 'subscribers:read'
  | 'subscribers:manage'
  | 'staff:manage'
  | 'report:read'
  | 'notification:send';

export interface User {
  uid: string;
  staffMemberId?: string;

  // Basic Info
  firstName: string;
  lastName: string;
  name: string; // full name
  email: string;
  phone?: string;
  avatarUrl?: string;

  // Role & Access
  role: UserRole;
  privileges: AppPrivilege[]; // Defined below

  // Referral info
  referralSource?: string;

  // Session info
  sessions?: UserSession[];
  // Staff-specific properties (for all admin users)
  position?: 'manager';
  isActive: boolean;
  shift?: 'morning' | 'afternoon' | 'night';
  salary?: number;
  hireDate?: string;

  // Auth fields
  provider: 'password' | 'google' | 'apple';
  password?: string; // hashed
  resetToken?: string;
  resetTokenExpiry?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  privileges?: AppPrivilege[];
  position?: User['position'];
  isActive?: boolean;
}

export interface UserPasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

export type UserUpdateInput = Partial<User>;
