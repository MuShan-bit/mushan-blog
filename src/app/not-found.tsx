import Link from "next/link";

export default function NotFound() {
  return (
    <section className="glass-panel rounded-[2.2rem] p-10 text-center">
      <p className="section-kicker text-sm font-semibold">404</p>
      <h1 className="font-display mt-4 text-5xl font-semibold tracking-[-0.06em] text-foreground">
        页面暂时迷路了
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
        你访问的内容可能还没发布，或者链接已经发生变化。可以先回到首页继续逛逛。
      </p>
      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="liquid-button rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:-translate-y-0.5 hover:bg-accent-strong"
        >
          返回首页
        </Link>
      </div>
    </section>
  );
}
