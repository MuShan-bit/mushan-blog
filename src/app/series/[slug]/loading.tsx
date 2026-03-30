import { ReaderPageSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return (
    <ReaderPageSkeleton
      badge="正在展开专题内容"
      detailLabel="series"
      hasSidebar={false}
      hasRelated={false}
    />
  );
}
