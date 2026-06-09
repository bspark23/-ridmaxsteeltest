import { useEffect } from 'react';
import useSWR from 'swr';
import { Content } from '@/models/content';
import { SITE_CONTENT, SYSTEM_SETTINGS } from '@/constants/content';
import { useAppDispatch } from '@/store/hooks';
import { setSiteContent } from '@/store/slices/content-slice';

export const useContent = () => {
  const dispatch = useAppDispatch();
  const { data, error } = useSWR<Content>('/content');

  useEffect(() => {
    if (data) {
      dispatch(setSiteContent(data));
      return;
    }

    if (error) {
      dispatch(
        setSiteContent({
          siteContent: SITE_CONTENT,
          systemSettings: SYSTEM_SETTINGS,
        }),
      );
    }
  }, [data, error, dispatch]);
};
