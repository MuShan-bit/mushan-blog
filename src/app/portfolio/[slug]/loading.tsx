import { ReaderPageSkeleton } from "@/components/loading/page-skeletons";

export default function Loading() {
  return <ReaderPageSkeleton badge="正在展开案例文档" detailLabel="portfolio" hasRelated={false} />;
}
