import { notFound } from "next/navigation";
import { SITE_CONTENT } from "@/constants/content";
import {
  PRODUCT_IMAGES,
  getProductCategory,
  getProductSlug,
  getProductSlugByIndex,
  slugifyTitle,
} from "@/lib/product-images";
import { Item } from "@/models/content";
import ProductDetailPage from "@/components/pages/product-detail-page";

interface ProductDetailRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

function titleCaseProduct(key: string) {
  return key
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveMappedProduct(slug: string): Item | null {
  const mappedKey = Object.keys(PRODUCT_IMAGES).find(
    (key) => slugifyTitle(key) === slug,
  );

  if (!mappedKey) return null;

  return {
    title: titleCaseProduct(mappedKey),
    body: "Available in various sizes and specifications.",
    image: PRODUCT_IMAGES[mappedKey][0],
    images: PRODUCT_IMAGES[mappedKey],
  };
}

function resolveNumberedProductSlug(
  slug: string,
  routeItems: Item[],
): Item | null {
  const match = slug.match(/^(.*)-(?:t)?(\d+)$/);
  if (!match) return null;

  const [, baseSlug, number] = match;
  const duplicateIndex = Number(number) - 1;
  if (duplicateIndex < 0) return null;

  const matches = routeItems.filter((item) => {
    const itemSlugs = [
      slugifyTitle(item.title),
      slugifyTitle(getProductCategory(item)),
    ];

    return itemSlugs.includes(baseSlug);
  });

  return matches[duplicateIndex] ?? matches[0] ?? resolveMappedProduct(baseSlug);
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { slug } = await params;
  const catalogueItems = SITE_CONTENT.products.section2.items ?? [];
  const homeItems = SITE_CONTENT.home.section2.items ?? [];
  const routeItems = [...catalogueItems, ...homeItems];
  const product =
    routeItems.find((item, itemIndex) => {
      const catalogueIndex = catalogueItems.findIndex(
        (candidate) => candidate === item,
      );
      const possibleSlugs = [
        getProductSlug(item, catalogueItems),
        catalogueIndex >= 0
          ? getProductSlugByIndex(item, catalogueItems, catalogueIndex)
          : getProductSlugByIndex(item, routeItems, itemIndex),
        slugifyTitle(item.title),
        slugifyTitle(getProductCategory(item)),
      ];

      return possibleSlugs.includes(slug);
    }) ??
    resolveNumberedProductSlug(slug, routeItems) ??
    resolveMappedProduct(slug);

  if (!product) {
    return notFound();
  }

  const productCategory = getProductCategory(product);
  const relatedItems = catalogueItems.filter(
    (item) =>
      getProductCategory(item) === productCategory &&
      getProductSlug(item, catalogueItems) !== slug,
  );

  return (
    <ProductDetailPage
      item={product}
      relatedItems={relatedItems}
      catalogueItems={catalogueItems}
    />
  );
}
