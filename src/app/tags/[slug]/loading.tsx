import { CollectionPageSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return <CollectionPageSkeleton badge="正在聚合标签内容" cards={4} withSidebar />;
}
