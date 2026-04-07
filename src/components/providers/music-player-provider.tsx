"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type MusicTrack = {
  title: string;
  artist: string;
  playerSrc: string;
};

type MusicPlayerContextValue = {
  currentTrack: MusicTrack;
  iframeKey: number;
  iframeSrc: string | null;
  isLoading: boolean;
  isPlaying: boolean;
  hasMultipleTracks: boolean;
  togglePlayback: () => Promise<void>;
  playRandomTrack: () => Promise<void>;
  handleFrameLoad: () => void;
};

const playlist: MusicTrack[] = [
  {
    title: "专注歌单",
    artist: "网易云音乐外链播放器",
    playerSrc: "https://music.163.com/outchain/player?type=0&id=17854205629&auto=1&height=32",
  },
];

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

function pickRandomIndex(length: number, currentIndex: number) {
  if (length <= 1) {
    return 0;
  }

  let nextIndex = currentIndex;

  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }

  return nextIndex;
}

function buildPlayerSrc(track: MusicTrack, nonce: number) {
  const url = new URL(track.playerSrc);
  url.searchParams.set("_ts", String(nonce));
  return url.toString();
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentIndexRef = useRef(0);
  const frameNonceRef = useRef(0);

  const mountTrack = useCallback((nextIndex: number) => {
    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    frameNonceRef.current += 1;
    setIframeKey(frameNonceRef.current);
    setIsLoading(true);
    setIsPlaying(false);
    setIframeSrc(buildPlayerSrc(playlist[nextIndex], frameNonceRef.current));
  }, []);

  const playRandomTrack = useCallback(async () => {
    const nextIndex = pickRandomIndex(playlist.length, currentIndexRef.current);
    mountTrack(nextIndex);
  }, [mountTrack]);

  const togglePlayback = useCallback(async () => {
    if (iframeSrc) {
      setIframeSrc(null);
      setIsLoading(false);
      setIsPlaying(false);
      return;
    }

    mountTrack(currentIndexRef.current);
  }, [iframeSrc, mountTrack]);

  const handleFrameLoad = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(true);
  }, []);

  const value = useMemo<MusicPlayerContextValue>(
    () => ({
      currentTrack: playlist[currentIndex],
      iframeKey,
      iframeSrc,
      isLoading,
      isPlaying,
      hasMultipleTracks: playlist.length > 1,
      togglePlayback,
      playRandomTrack,
      handleFrameLoad,
    }),
    [
      currentIndex,
      handleFrameLoad,
      iframeKey,
      iframeSrc,
      isLoading,
      isPlaying,
      playRandomTrack,
      togglePlayback,
    ],
  );

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider.");
  }

  return context;
}
