import { CollectionPageSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return <CollectionPageSkeleton badge="正在整理文章目录" cards={4} withSidebar />;
}
