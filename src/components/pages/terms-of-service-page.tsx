'use client';

import { useAppSelector } from '@/store/hooks';

export default function TermsOfServicePage() {
  const { siteContent } = useAppSelector((s) => s.content.content);
  const section1 = siteContent?.termsOfService?.section1 ?? {};
  return (
    <>
      <section>
        <h1>{section1.title}</h1>
        <p>{section1.body}</p>
      </section>
    </>
  );
}
