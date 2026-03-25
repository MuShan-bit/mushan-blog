"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useColorPalette } from "@/components/theme/use-color-palette";

type FocusSoundscape = "forest" | "waves" | "hearth" | "rain";
type NoiseColor = "white" | "pink" | "brown";
type Cleanup = () => void;

type FocusModeContextValue = {
  active: boolean;
  busy: boolean;
  soundscape: FocusSoundscape;
  soundscapeLabel: string;
  toggle: () => void;
};

const focusLabels: Record<FocusSoundscape, string> = {
  forest: "森林白噪音",
  waves: "海浪白噪音",
  hearth: "火炉白噪音",
  rain: "雨声白噪音",
};

const paletteFocusMap: Record<string, FocusSoundscape> = {
  verdant: "forest",
  ocean: "waves",
  sunrise: "hearth",
  graphite: "rain",
};

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function safeStop(node: AudioScheduledSourceNode | OscillatorNode | ConstantSourceNode) {
  try {
    node.stop();
  } catch {}
}

function getAudioContextConstructor() {
  const windowWithWebkit = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext ?? windowWithWebkit.webkitAudioContext;
}

function createNoiseBuffer(context: AudioContext, color: NoiseColor, duration = 2.8) {
  const frameCount = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);
  let pink0 = 0;
  let pink1 = 0;
  let pink2 = 0;
  let pink3 = 0;
  let pink4 = 0;
  let pink5 = 0;
  let pink6 = 0;
  let brown = 0;

  for (let index = 0; index < frameCount; index += 1) {
    const white = Math.random() * 2 - 1;

    if (color === "white") {
      channel[index] = white;
      continue;
    }

    if (color === "pink") {
      pink0 = 0.99886 * pink0 + white * 0.0555179;
      pink1 = 0.99332 * pink1 + white * 0.0750759;
      pink2 = 0.969 * pink2 + white * 0.153852;
      pink3 = 0.8665 * pink3 + white * 0.3104856;
      pink4 = 0.55 * pink4 + white * 0.5329522;
      pink5 = -0.7616 * pink5 - white * 0.016898;
      const pink = pink0 + pink1 + pink2 + pink3 + pink4 + pink5 + pink6 + white * 0.5362;
      pink6 = white * 0.115926;
      channel[index] = pink * 0.11;
      continue;
    }

    brown = (brown + 0.02 * white) / 1.02;
    channel[index] = brown * 3.5;
  }

  return buffer;
}

function createMotionLfo(
  context: AudioContext,
  target: AudioParam,
  { base, depth, frequency }: { base: number; depth: number; frequency: number },
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  target.value = base;
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.value = depth;
  oscillator.connect(gain);
  gain.connect(target);
  oscillator.start();

  return () => {
    safeStop(oscillator);
    oscillator.disconnect();
    gain.disconnect();
  };
}

function scheduleRecurring(task: () => void, minDelay: number, maxDelay: number) {
  let timerId: number | null = null;
  let disposed = false;

  const run = () => {
    if (disposed) {
      return;
    }

    timerId = window.setTimeout(() => {
      task();
      run();
    }, randomBetween(minDelay, maxDelay));
  };

  run();

  return () => {
    disposed = true;

    if (timerId !== null) {
      window.clearTimeout(timerId);
    }
  };
}

function spawnToneBurst(
  context: AudioContext,
  destination: AudioNode,
  {
    from,
    to,
    gainAmount,
    duration,
    type = "sine",
  }: {
    from: number;
    to: number;
    gainAmount: number;
    duration: number;
    type?: OscillatorType;
  },
) {
  const startAt = context.currentTime + 0.01;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(from, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(to, startAt + duration);
  filter.type = "bandpass";
  filter.frequency.value = to;
  filter.Q.value = 1.4;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainAmount, startAt + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.04);

  window.setTimeout(() => {
    oscillator.disconnect();
    filter.disconnect();
    gain.disconnect();
  }, (duration + 0.18) * 1000);
}

function spawnNoiseBurst(
  context: AudioContext,
  destination: AudioNode,
  getBuffer: (color: NoiseColor) => AudioBuffer,
  {
    color,
    duration,
    gainAmount,
    lowpass,
    highpass,
    bandpass,
    q = 0.7,
  }: {
    color: NoiseColor;
    duration: number;
    gainAmount: number;
    lowpass?: number;
    highpass?: number;
    bandpass?: number;
    q?: number;
  },
) {
  const startAt = context.currentTime + 0.01;
  const source = context.createBufferSource();
  const gain = context.createGain();
  const chain: AudioNode[] = [];

  source.buffer = getBuffer(color);

  let previousNode: AudioNode = source;

  if (highpass) {
    const filter = context.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = highpass;
    previousNode.connect(filter);
    previousNode = filter;
    chain.push(filter);
  }

  if (bandpass) {
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = bandpass;
    filter.Q.value = q;
    previousNode.connect(filter);
    previousNode = filter;
    chain.push(filter);
  }

  if (lowpass) {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lowpass;
    previousNode.connect(filter);
    previousNode = filter;
    chain.push(filter);
  }

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(gainAmount, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  previousNode.connect(gain);
  gain.connect(destination);

  source.start(startAt);
  source.stop(startAt + duration + 0.04);

  window.setTimeout(() => {
    source.disconnect();
    chain.forEach((node) => node.disconnect());
    gain.disconnect();
  }, (duration + 0.18) * 1000);
}

function buildForestScene(context: AudioContext, destination: GainNode, getBuffer: (color: NoiseColor) => AudioBuffer) {
  const cleanups: Cleanup[] = [];

  const canopy = context.createGain();
  const canopySource = context.createBufferSource();
  const canopyHighpass = context.createBiquadFilter();
  const canopyLowpass = context.createBiquadFilter();
  canopySource.buffer = getBuffer("pink");
  canopySource.loop = true;
  canopyHighpass.type = "highpass";
  canopyHighpass.frequency.value = 220;
  canopyLowpass.type = "lowpass";
  canopyLowpass.frequency.value = 2400;
  canopySource.connect(canopyHighpass);
  canopyHighpass.connect(canopyLowpass);
  canopyLowpass.connect(canopy);
  canopy.connect(destination);
  canopySource.start();

  cleanups.push(() => {
    safeStop(canopySource);
    canopySource.disconnect();
    canopyHighpass.disconnect();
    canopyLowpass.disconnect();
    canopy.disconnect();
  });
  cleanups.push(createMotionLfo(context, canopy.gain, { base: 0.04, depth: 0.016, frequency: 0.07 }));
  cleanups.push(createMotionLfo(context, canopyLowpass.frequency, { base: 2400, depth: 320, frequency: 0.045 }));

  const leaves = context.createGain();
  const leafSource = context.createBufferSource();
  const leafBandpass = context.createBiquadFilter();
  leafSource.buffer = getBuffer("white");
  leafSource.loop = true;
  leafBandpass.type = "bandpass";
  leafBandpass.frequency.value = 2900;
  leafBandpass.Q.value = 0.45;
  leafSource.connect(leafBandpass);
  leafBandpass.connect(leaves);
  leaves.connect(destination);
  leafSource.start();

  cleanups.push(() => {
    safeStop(leafSource);
    leafSource.disconnect();
    leafBandpass.disconnect();
    leaves.disconnect();
  });
  cleanups.push(createMotionLfo(context, leaves.gain, { base: 0.012, depth: 0.008, frequency: 0.11 }));
  cleanups.push(
    scheduleRecurring(() => {
      const chirpCount = Math.round(randomBetween(2, 4));

      for (let index = 0; index < chirpCount; index += 1) {
        window.setTimeout(() => {
          spawnToneBurst(context, destination, {
            from: randomBetween(1400, 2100),
            to: randomBetween(2300, 3200),
            gainAmount: randomBetween(0.012, 0.02),
            duration: randomBetween(0.16, 0.28),
            type: "triangle",
          });
        }, index * randomBetween(120, 220));
      }
    }, 8000, 15000),
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function buildOceanScene(context: AudioContext, destination: GainNode, getBuffer: (color: NoiseColor) => AudioBuffer) {
  const cleanups: Cleanup[] = [];

  const surf = context.createGain();
  const surfSource = context.createBufferSource();
  const surfHighpass = context.createBiquadFilter();
  const surfLowpass = context.createBiquadFilter();
  surfSource.buffer = getBuffer("brown");
  surfSource.loop = true;
  surfHighpass.type = "highpass";
  surfHighpass.frequency.value = 90;
  surfLowpass.type = "lowpass";
  surfLowpass.frequency.value = 980;
  surfSource.connect(surfHighpass);
  surfHighpass.connect(surfLowpass);
  surfLowpass.connect(surf);
  surf.connect(destination);
  surfSource.start();

  cleanups.push(() => {
    safeStop(surfSource);
    surfSource.disconnect();
    surfHighpass.disconnect();
    surfLowpass.disconnect();
    surf.disconnect();
  });
  cleanups.push(createMotionLfo(context, surf.gain, { base: 0.046, depth: 0.03, frequency: 0.085 }));

  const foam = context.createGain();
  const foamSource = context.createBufferSource();
  const foamHighpass = context.createBiquadFilter();
  const foamLowpass = context.createBiquadFilter();
  foamSource.buffer = getBuffer("white");
  foamSource.loop = true;
  foamHighpass.type = "highpass";
  foamHighpass.frequency.value = 1200;
  foamLowpass.type = "lowpass";
  foamLowpass.frequency.value = 4200;
  foamSource.connect(foamHighpass);
  foamHighpass.connect(foamLowpass);
  foamLowpass.connect(foam);
  foam.connect(destination);
  foamSource.start();

  cleanups.push(() => {
    safeStop(foamSource);
    foamSource.disconnect();
    foamHighpass.disconnect();
    foamLowpass.disconnect();
    foam.disconnect();
  });
  cleanups.push(createMotionLfo(context, foam.gain, { base: 0.012, depth: 0.008, frequency: 0.14 }));

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function buildHearthScene(context: AudioContext, destination: GainNode, getBuffer: (color: NoiseColor) => AudioBuffer) {
  const cleanups: Cleanup[] = [];

  const ember = context.createGain();
  const emberSource = context.createBufferSource();
  const emberHighpass = context.createBiquadFilter();
  const emberLowpass = context.createBiquadFilter();
  emberSource.buffer = getBuffer("pink");
  emberSource.loop = true;
  emberHighpass.type = "highpass";
  emberHighpass.frequency.value = 150;
  emberLowpass.type = "lowpass";
  emberLowpass.frequency.value = 1600;
  emberSource.connect(emberHighpass);
  emberHighpass.connect(emberLowpass);
  emberLowpass.connect(ember);
  ember.connect(destination);
  emberSource.start();

  cleanups.push(() => {
    safeStop(emberSource);
    emberSource.disconnect();
    emberHighpass.disconnect();
    emberLowpass.disconnect();
    ember.disconnect();
  });
  cleanups.push(createMotionLfo(context, ember.gain, { base: 0.034, depth: 0.009, frequency: 0.09 }));

  const hiss = context.createGain();
  const hissSource = context.createBufferSource();
  const hissBandpass = context.createBiquadFilter();
  hissSource.buffer = getBuffer("white");
  hissSource.loop = true;
  hissBandpass.type = "bandpass";
  hissBandpass.frequency.value = 2200;
  hissBandpass.Q.value = 0.7;
  hissSource.connect(hissBandpass);
  hissBandpass.connect(hiss);
  hiss.connect(destination);
  hissSource.start();

  cleanups.push(() => {
    safeStop(hissSource);
    hissSource.disconnect();
    hissBandpass.disconnect();
    hiss.disconnect();
  });
  cleanups.push(createMotionLfo(context, hiss.gain, { base: 0.01, depth: 0.006, frequency: 0.17 }));
  cleanups.push(
    scheduleRecurring(() => {
      spawnNoiseBurst(context, destination, getBuffer, {
        color: "white",
        duration: randomBetween(0.05, 0.13),
        gainAmount: randomBetween(0.016, 0.034),
        highpass: 1800,
        bandpass: randomBetween(2400, 4200),
        lowpass: 7200,
        q: 1.4,
      });
    }, 260, 860),
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function buildRainScene(context: AudioContext, destination: GainNode, getBuffer: (color: NoiseColor) => AudioBuffer) {
  const cleanups: Cleanup[] = [];

  const rain = context.createGain();
  const rainSource = context.createBufferSource();
  const rainHighpass = context.createBiquadFilter();
  const rainLowpass = context.createBiquadFilter();
  rainSource.buffer = getBuffer("white");
  rainSource.loop = true;
  rainHighpass.type = "highpass";
  rainHighpass.frequency.value = 1700;
  rainLowpass.type = "lowpass";
  rainLowpass.frequency.value = 7200;
  rainSource.connect(rainHighpass);
  rainHighpass.connect(rainLowpass);
  rainLowpass.connect(rain);
  rain.connect(destination);
  rainSource.start();

  cleanups.push(() => {
    safeStop(rainSource);
    rainSource.disconnect();
    rainHighpass.disconnect();
    rainLowpass.disconnect();
    rain.disconnect();
  });
  cleanups.push(createMotionLfo(context, rain.gain, { base: 0.044, depth: 0.008, frequency: 0.055 }));

  const roof = context.createGain();
  const roofSource = context.createBufferSource();
  const roofBandpass = context.createBiquadFilter();
  roofSource.buffer = getBuffer("pink");
  roofSource.loop = true;
  roofBandpass.type = "bandpass";
  roofBandpass.frequency.value = 1350;
  roofBandpass.Q.value = 0.5;
  roofSource.connect(roofBandpass);
  roofBandpass.connect(roof);
  roof.connect(destination);
  roofSource.start();

  cleanups.push(() => {
    safeStop(roofSource);
    roofSource.disconnect();
    roofBandpass.disconnect();
    roof.disconnect();
  });
  cleanups.push(createMotionLfo(context, roof.gain, { base: 0.013, depth: 0.006, frequency: 0.12 }));
  cleanups.push(
    scheduleRecurring(() => {
      spawnToneBurst(context, destination, {
        from: randomBetween(520, 760),
        to: randomBetween(820, 1180),
        gainAmount: randomBetween(0.006, 0.012),
        duration: randomBetween(0.18, 0.3),
        type: "sine",
      });
    }, 2200, 5200),
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

class FocusSoundEngine {
  private context: AudioContext;
  private compressor: DynamicsCompressorNode;
  private masterGain: GainNode;
  private currentScene: FocusSoundscape | null = null;
  private sceneGain: GainNode | null = null;
  private sceneCleanup: Cleanup | null = null;
  private buffers = new Map<NoiseColor, AudioBuffer>();
  private transition = Promise.resolve();
  private disposed = false;

  private constructor(context: AudioContext) {
    this.context = context;
    this.compressor = context.createDynamicsCompressor();
    this.masterGain = context.createGain();

    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 18;
    this.compressor.ratio.value = 2.2;
    this.compressor.attack.value = 0.08;
    this.compressor.release.value = 0.35;
    this.masterGain.gain.value = 0.0001;

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(context.destination);
  }

  static async create(scene: FocusSoundscape) {
    const AudioContextConstructor = getAudioContextConstructor();

    if (!AudioContextConstructor) {
      throw new Error("AudioContext is not supported in this browser.");
    }

    const context = new AudioContextConstructor();
    const engine = new FocusSoundEngine(context);
    await context.resume();
    await engine.setScene(scene);
    const now = context.currentTime;
    engine.masterGain.gain.cancelScheduledValues(now);
    engine.masterGain.gain.setValueAtTime(0.0001, now);
    engine.masterGain.gain.exponentialRampToValueAtTime(0.16, now + 0.8);
    return engine;
  }

  private getBuffer(color: NoiseColor) {
    const current = this.buffers.get(color);

    if (current) {
      return current;
    }

    const next = createNoiseBuffer(this.context, color);
    this.buffers.set(color, next);
    return next;
  }

  async setScene(scene: FocusSoundscape) {
    this.transition = this.transition.then(async () => {
      if (this.disposed || this.currentScene === scene) {
        return;
      }

      const now = this.context.currentTime;
      const nextSceneGain = this.context.createGain();
      nextSceneGain.gain.setValueAtTime(0.0001, now);
      nextSceneGain.connect(this.compressor);

      const cleanup =
        scene === "forest"
          ? buildForestScene(this.context, nextSceneGain, this.getBuffer.bind(this))
          : scene === "waves"
            ? buildOceanScene(this.context, nextSceneGain, this.getBuffer.bind(this))
            : scene === "hearth"
              ? buildHearthScene(this.context, nextSceneGain, this.getBuffer.bind(this))
              : buildRainScene(this.context, nextSceneGain, this.getBuffer.bind(this));

      nextSceneGain.gain.exponentialRampToValueAtTime(1, now + 0.55);

      const previousSceneGain = this.sceneGain;
      const previousCleanup = this.sceneCleanup;

      this.sceneGain = nextSceneGain;
      this.sceneCleanup = cleanup;
      this.currentScene = scene;

      if (previousSceneGain) {
        previousSceneGain.gain.cancelScheduledValues(now);
        previousSceneGain.gain.setValueAtTime(Math.max(previousSceneGain.gain.value, 0.0001), now);
        previousSceneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
        await wait(420);
        previousCleanup?.();
        previousSceneGain.disconnect();
      }
    });

    return this.transition;
  }

  async stop() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    await this.transition.catch(() => undefined);

    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    await wait(380);

    this.sceneCleanup?.();
    this.sceneGain?.disconnect();
    this.compressor.disconnect();
    this.masterGain.disconnect();

    await this.context.close();
  }
}

function getFocusSoundscape(paletteId: string): FocusSoundscape {
  return paletteFocusMap[paletteId] ?? "forest";
}

export function FocusModeProvider({ children }: { children: ReactNode }) {
  const palette = useColorPalette();
  const soundscape = getFocusSoundscape(palette);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const engineRef = useRef<FocusSoundEngine | null>(null);
  const soundscapeRef = useRef<FocusSoundscape>(soundscape);

  const stop = useCallback(async () => {
    if (busy) {
      return;
    }

    setBusy(true);
    setActive(false);
    soundscapeRef.current = soundscape;

    try {
      const current = engineRef.current;
      engineRef.current = null;
      await current?.stop();
    } finally {
      setBusy(false);
    }
  }, [busy, soundscape]);

  const start = useCallback(
    async (nextSoundscape: FocusSoundscape) => {
      if (busy) {
        return;
      }

      setBusy(true);

      try {
        if (!engineRef.current) {
          engineRef.current = await FocusSoundEngine.create(nextSoundscape);
        } else {
          await engineRef.current.setScene(nextSoundscape);
        }

        soundscapeRef.current = nextSoundscape;
        setActive(true);
      } catch (error) {
        console.warn("Unable to start focus mode ambience.", error);
        setActive(false);
        const current = engineRef.current;
        engineRef.current = null;
        await current?.stop().catch(() => undefined);
      } finally {
        setBusy(false);
      }
    },
    [busy],
  );

  const toggle = useCallback(() => {
    if (active) {
      void stop();
      return;
    }

    void start(soundscape);
  }, [active, soundscape, start, stop]);

  useEffect(() => {
    if (!active || !engineRef.current || soundscapeRef.current === soundscape) {
      return;
    }

    let cancelled = false;

    setBusy(true);

    void engineRef.current
      .setScene(soundscape)
      .then(() => {
        if (!cancelled) {
          soundscapeRef.current = soundscape;
        }
      })
      .catch((error) => {
        console.warn("Unable to switch focus mode ambience.", error);
      })
      .finally(() => {
        if (!cancelled) {
          setBusy(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [active, soundscape]);

  useEffect(() => {
    return () => {
      const current = engineRef.current;
      engineRef.current = null;

      if (current) {
        void current.stop();
      }
    };
  }, []);

  const value = useMemo<FocusModeContextValue>(
    () => ({
      active,
      busy,
      soundscape,
      soundscapeLabel: focusLabels[soundscape],
      toggle,
    }),
    [active, busy, soundscape, toggle],
  );

  return <FocusModeContext.Provider value={value}>{children}</FocusModeContext.Provider>;
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);

  if (!context) {
    throw new Error("useFocusMode must be used within FocusModeProvider.");
  }

  return context;
}
