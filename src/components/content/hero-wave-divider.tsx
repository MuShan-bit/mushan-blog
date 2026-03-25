type HeroWaveLayerProps = {
  className: string;
  path: string;
  values: string;
  morphDuration: string;
  driftValues: string;
  driftDuration: string;
};

function HeroWaveLayer({
  className,
  path,
  values,
  morphDuration,
  driftValues,
  driftDuration,
}: HeroWaveLayerProps) {
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className={className}>
      <path d={path}>
        <animate
          attributeName="d"
          dur={morphDuration}
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          values={values}
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          dur={driftDuration}
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
          values={driftValues}
        />
      </path>
    </svg>
  );
}

export function HeroWaveDivider() {
  return (
    <div className="article-hero__wave" aria-hidden="true">
      <HeroWaveLayer
        className="article-hero__wave-layer article-hero__wave-layer--back"
        path="M0,104C96,136,192,146,288,128C384,110,480,64,576,66C672,68,768,118,864,122C960,126,1056,84,1152,76C1248,68,1344,96,1440,126L1440,160L0,160Z"
        values="M0,104C96,136,192,146,288,128C384,110,480,64,576,66C672,68,768,118,864,122C960,126,1056,84,1152,76C1248,68,1344,96,1440,126L1440,160L0,160Z;M0,118C110,138,220,126,330,102C440,78,550,42,660,54C770,66,880,126,990,134C1100,142,1210,98,1320,88C1380,82,1420,90,1440,94L1440,160L0,160Z;M0,104C96,136,192,146,288,128C384,110,480,64,576,66C672,68,768,118,864,122C960,126,1056,84,1152,76C1248,68,1344,96,1440,126L1440,160L0,160Z"
        morphDuration="18s"
        driftValues="-20 0; 14 -3; -20 0"
        driftDuration="16s"
      />
      <HeroWaveLayer
        className="article-hero__wave-layer article-hero__wave-layer--mid"
        path="M0,116C120,84,240,78,360,100C480,122,600,150,720,138C840,126,960,70,1080,62C1200,54,1320,112,1440,92L1440,160L0,160Z"
        values="M0,116C120,84,240,78,360,100C480,122,600,150,720,138C840,126,960,70,1080,62C1200,54,1320,112,1440,92L1440,160L0,160Z;M0,124C132,102,264,88,396,96C528,104,660,136,792,128C924,120,1056,72,1188,80C1300,86,1384,118,1440,126L1440,160L0,160Z;M0,116C120,84,240,78,360,100C480,122,600,150,720,138C840,126,960,70,1080,62C1200,54,1320,112,1440,92L1440,160L0,160Z"
        morphDuration="12s"
        driftValues="12 0; -10 2; 12 0"
        driftDuration="11s"
      />
      <HeroWaveLayer
        className="article-hero__wave-layer article-hero__wave-layer--front"
        path="M0,126C90,98,180,84,270,94C360,104,450,136,540,140C630,144,720,116,810,102C900,88,990,86,1080,104C1170,122,1260,152,1350,146C1398,142,1428,136,1440,130L1440,160L0,160Z"
        values="M0,126C90,98,180,84,270,94C360,104,450,136,540,140C630,144,720,116,810,102C900,88,990,86,1080,104C1170,122,1260,152,1350,146C1398,142,1428,136,1440,130L1440,160L0,160Z;M0,132C104,118,208,96,312,98C416,100,520,126,624,132C728,138,832,122,936,104C1040,86,1144,78,1248,94C1340,108,1404,128,1440,136L1440,160L0,160Z;M0,126C90,98,180,84,270,94C360,104,450,136,540,140C630,144,720,116,810,102C900,88,990,86,1080,104C1170,122,1260,152,1350,146C1398,142,1428,136,1440,130L1440,160L0,160Z"
        morphDuration="8.5s"
        driftValues="0 0; -8 -2; 0 0"
        driftDuration="9s"
      />
    </div>
  );
}
