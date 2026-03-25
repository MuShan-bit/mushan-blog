import type { CSSProperties } from "react";

const fireflies = [
  { x: "8%", y: "18%", size: "0.34rem", driftX: "1.3rem", driftY: "-1.8rem", delay: "-1.4s", duration: "10.8s", twinkle: "2.8s", tone: "accent" },
  { x: "15%", y: "62%", size: "0.28rem", driftX: "1.8rem", driftY: "-1.2rem", delay: "-3.2s", duration: "12.6s", twinkle: "3.4s", tone: "mint" },
  { x: "22%", y: "36%", size: "0.22rem", driftX: "0.9rem", driftY: "-1.5rem", delay: "-0.8s", duration: "9.2s", twinkle: "2.5s", tone: "sky" },
  { x: "28%", y: "74%", size: "0.38rem", driftX: "1.4rem", driftY: "-2rem", delay: "-4.6s", duration: "13.8s", twinkle: "3.8s", tone: "gold" },
  { x: "37%", y: "14%", size: "0.26rem", driftX: "1.1rem", driftY: "-1.4rem", delay: "-2.1s", duration: "11.2s", twinkle: "2.9s", tone: "accent" },
  { x: "43%", y: "48%", size: "0.32rem", driftX: "1.6rem", driftY: "-1rem", delay: "-5.2s", duration: "12.1s", twinkle: "3.3s", tone: "sky" },
  { x: "51%", y: "28%", size: "0.24rem", driftX: "1.2rem", driftY: "-1.7rem", delay: "-1.7s", duration: "10.4s", twinkle: "2.6s", tone: "mint" },
  { x: "59%", y: "68%", size: "0.36rem", driftX: "1.9rem", driftY: "-1.6rem", delay: "-3.8s", duration: "14.4s", twinkle: "4s", tone: "accent" },
  { x: "67%", y: "22%", size: "0.2rem", driftX: "0.8rem", driftY: "-1.1rem", delay: "-2.7s", duration: "8.9s", twinkle: "2.2s", tone: "gold" },
  { x: "74%", y: "54%", size: "0.3rem", driftX: "1.5rem", driftY: "-1.9rem", delay: "-6.1s", duration: "13.1s", twinkle: "3.1s", tone: "mint" },
  { x: "82%", y: "16%", size: "0.34rem", driftX: "1.1rem", driftY: "-1.3rem", delay: "-2.4s", duration: "11.7s", twinkle: "2.7s", tone: "sky" },
  { x: "88%", y: "72%", size: "0.24rem", driftX: "1.6rem", driftY: "-1.4rem", delay: "-4.1s", duration: "12.9s", twinkle: "3.6s", tone: "accent" },
  { x: "92%", y: "38%", size: "0.18rem", driftX: "1rem", driftY: "-0.9rem", delay: "-1.2s", duration: "9.4s", twinkle: "2.4s", tone: "gold" },
];

export function SiteBackground() {
  return (
    <div aria-hidden="true" className="site-background">
      <div className="site-background__mesh" />
      <div className="site-background__wash" />
      <div className="site-background__vignette" />
      <div className="site-background__fireflies">
        {fireflies.map((firefly, index) => (
          <span
            // Fixed seeded positions keep the background stable across renders while still feeling random.
            key={`${firefly.x}-${firefly.y}-${index}`}
            className={`site-background__firefly site-background__firefly--${firefly.tone}`}
            style={
              {
                "--firefly-x": firefly.x,
                "--firefly-y": firefly.y,
                "--firefly-size": firefly.size,
                "--firefly-drift-x": firefly.driftX,
                "--firefly-drift-y": firefly.driftY,
                "--firefly-delay": firefly.delay,
                "--firefly-duration": firefly.duration,
                "--firefly-twinkle": firefly.twinkle,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="ambient-orb ambient-orb--mint left-[-10rem] top-[-5rem] h-[24rem] w-[24rem] animate-pulse" />
      <div className="ambient-orb ambient-orb--sky right-[-8rem] top-[12vh] h-[26rem] w-[26rem]" />
      <div className="ambient-orb ambient-orb--gold left-[18%] top-[48vh] h-[18rem] w-[18rem]" />
      <div className="ambient-orb ambient-orb--mint bottom-[-7rem] right-[12%] h-[22rem] w-[22rem]" />
    </div>
  );
}
