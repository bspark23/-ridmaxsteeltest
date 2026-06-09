import { BRAND_INFO } from '@/constants/brand';
import { ApiService } from './api.service';

export type MailBrand = {
  name: string;
  color?: string;
  icon?: string;
};

export type MailSendInput = {
  to: string | string[];
  subject: string;
  html: string;
  wrapHtml?: boolean;
  brand?: MailBrand;
};

export function parseMailRecipients(to: string | string[]): string[] {
  if (Array.isArray(to)) {
    return to
      .flatMap((t) => String(t).split(/[,;\n]/g))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return String(to)
    .split(/[,;\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseAdminEmailsEnv(
  value: string | undefined | null,
): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  const unwrapped =
    trimmed.startsWith('[') && trimmed.endsWith(']')
      ? trimmed.slice(1, -1)
      : trimmed;
  return parseMailRecipients(unwrapped);
}

export class MailService {
  static adminRecipients(): string[] {
    return parseAdminEmailsEnv(
      process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS,
    );
  }

  static async send(payload: MailSendInput): Promise<void> {
    const toList = parseMailRecipients(payload.to);
    if (!toList.length) return;

    const smtp_host =
      process.env.NEXT_PUBLIC_SMTP_HOST ?? process.env.SMTP_HOST;
    const smtp_port_raw =
      process.env.NEXT_PUBLIC_SMTP_PORT ?? process.env.SMTP_PORT;
    const smtp_port =
      smtp_port_raw && Number.isFinite(Number(smtp_port_raw))
        ? Number(smtp_port_raw)
        : undefined;
    const smtp_user =
      process.env.NEXT_PUBLIC_SMTP_USER ?? process.env.SMTP_USER;
    const smtp_pass =
      process.env.NEXT_PUBLIC_SMTP_PASS ?? process.env.SMTP_PASS;
    const from_email =
      process.env.NEXT_PUBLIC_FROM_EMAIL ?? process.env.FROM_EMAIL;
    const from_name =
      process.env.NEXT_PUBLIC_FROM_NAME ?? process.env.FROM_NAME;

    await ApiService.request<void>('/mail/send', {
      method: 'POST',
      body: JSON.stringify({
        to: toList,
        subject: payload.subject,
        html: payload.html,
        wrapHtml: true,
        smtp_host,
        smtp_port,
        smtp_user,
        smtp_pass,
        from_email,
        from_name,
        brand: BRAND_INFO,
      }),
    });
  }

  static async notifyAdmins(payload: Omit<MailSendInput, 'to'>): Promise<void> {
    const admins = this.adminRecipients();
    if (!admins.length) return;
    await this.send({
      to: admins,
      subject: payload.subject,
      html: payload.html,
    });
  }
}
