import { CollectionPageSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return <CollectionPageSkeleton badge="正在显影相册主题" cards={4} cardType="album" />;
}
