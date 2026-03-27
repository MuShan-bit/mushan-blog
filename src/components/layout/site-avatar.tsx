import Image from "next/image";
import { profile } from "@/data/profile";
import { cn } from "@/lib/cn";

type SiteAvatarProps = {
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function SiteAvatar({ className, sizes = "44px", priority = false }: SiteAvatarProps) {
  return (
    <div
      className={cn(
        "border-border/80 relative overflow-hidden rounded-2xl border bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:bg-white/10",
        className,
      )}
    >
      <Image
        src={profile.portraitAsset}
        alt={`${profile.name} 的站点头像`}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
