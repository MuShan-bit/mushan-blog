export function HeroWaveDivider() {
  return (
    <div className="article-hero__wave" aria-hidden="true">
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="article-hero__wave-layer article-hero__wave-layer--back"
      >
        <path d="M0,96C96,124,192,136,288,118C384,100,480,52,576,56C672,60,768,116,864,120C960,124,1056,76,1152,68C1248,60,1344,92,1440,124L1440,160L0,160Z" />
      </svg>
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="article-hero__wave-layer article-hero__wave-layer--mid"
      >
        <path d="M0,110C120,78,240,74,360,96C480,118,600,150,720,134C840,118,960,54,1080,52C1200,50,1320,110,1440,88L1440,160L0,160Z" />
      </svg>
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="article-hero__wave-layer article-hero__wave-layer--front"
      >
        <path d="M0,122C90,96,180,84,270,94C360,104,450,136,540,138C630,140,720,112,810,98C900,84,990,82,1080,100C1170,118,1260,156,1350,148C1395,144,1425,136,1440,128L1440,160L0,160Z" />
      </svg>
    </div>
  );
}
