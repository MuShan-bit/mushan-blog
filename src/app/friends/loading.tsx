import { CollectionPageSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return <CollectionPageSkeleton badge="正在摆放友联卡片" cards={4} cardType="friend" />;
}
