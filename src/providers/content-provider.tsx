'use client';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useAppSelector } from '@/store/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { Loading } from '@/components/ui/loading';
import { useContent } from '@/hooks/use-content';

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { content } = useAppSelector((state) => state.content);
  useContent();

  const showLoader = !content?.siteContent?.home;

  return (
    <AnimatePresence mode='wait'>
      {showLoader ? (
        <motion.div
          key='loader'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-white'
        >
          <Loading className='text-black' />
        </motion.div>
      ) : (
        <motion.div
          key='app'
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='relative z-10'
        >
          <Sonner />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
