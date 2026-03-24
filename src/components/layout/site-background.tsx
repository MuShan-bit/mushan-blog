export function SiteBackground() {
  return (
    <div aria-hidden="true" className="site-background">
      <div className="site-background__mesh" />
      <div className="site-background__wash" />
      <div className="site-background__vignette" />

      <div className="ambient-orb ambient-orb--mint left-[-10rem] top-[-5rem] h-[24rem] w-[24rem] animate-pulse" />
      <div className="ambient-orb ambient-orb--sky right-[-8rem] top-[12vh] h-[26rem] w-[26rem]" />
      <div className="ambient-orb ambient-orb--gold left-[18%] top-[48vh] h-[18rem] w-[18rem]" />
      <div className="ambient-orb ambient-orb--mint bottom-[-7rem] right-[12%] h-[22rem] w-[22rem]" />
    </div>
  );
}
