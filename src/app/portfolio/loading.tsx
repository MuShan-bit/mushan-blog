import { CollectionPageSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return <CollectionPageSkeleton badge="正在铺开作品案例" cards={4} cardType="portfolio" />;
}
