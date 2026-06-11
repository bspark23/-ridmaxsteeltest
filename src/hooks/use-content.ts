import { useEffect } from 'react';
import useSWR from 'swr';
import { Content, Item } from '@/models/content';
import { SITE_CONTENT, SYSTEM_SETTINGS } from '@/constants/content';
import { useAppDispatch } from '@/store/hooks';
import { setSiteContent } from '@/store/slices/content-slice';

// Merge local item images into API items where the API item is missing them.
// Matches by title (case-insensitive).
function mergeItemImages(
  apiItems: Item[] | undefined,
  localItems: Item[] | undefined,
): Item[] | undefined {
  if (!apiItems) return apiItems;
  if (!localItems) return apiItems;
  return apiItems.map((apiItem) => {
    if (apiItem.images && apiItem.images.length > 0) return apiItem;
    const match = localItems.find(
      (l) => l.title.toLowerCase() === apiItem.title.toLowerCase(),
    );
    if (match?.images && match.images.length > 0) {
      return { ...apiItem, images: match.images };
    }
    return apiItem;
  });
}

// Walk the API content and fill in missing images arrays from local content.
function mergeLocalImages(apiContent: Content): Content {
  const merged = { ...apiContent, siteContent: { ...apiContent.siteContent } };
  for (const page of Object.keys(SITE_CONTENT)) {
    const localPage = SITE_CONTENT[page as keyof typeof SITE_CONTENT];
    const apiPage = merged.siteContent[page];
    if (!apiPage || !localPage) continue;
    merged.siteContent[page] = { ...apiPage };
    for (const sectionKey of Object.keys(localPage)) {
      const localSection = (localPage as Record<string, { items?: Item[] }>)[sectionKey];
      const apiSection = apiPage[sectionKey];
      if (!apiSection || !localSection?.items) continue;
      merged.siteContent[page][sectionKey] = {
        ...apiSection,
        items: mergeItemImages(apiSection.items, localSection.items),
      };
    }
  }
  return merged;
}

export const useContent = () => {
  const dispatch = useAppDispatch();
  const { data, error } = useSWR<Content>('/content');

  useEffect(() => {
    if (data) {
      dispatch(setSiteContent(mergeLocalImages(data)));
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
