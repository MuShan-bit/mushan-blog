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

export type MusicTrack = {
  title: string;
  artist: string;
  src: string;
};

type MusicPlayerContextValue = {
  currentTrack: MusicTrack;
  isLoading: boolean;
  isPlaying: boolean;
  togglePlayback: () => Promise<void>;
  playRandomTrack: () => Promise<void>;
};

const playlist: MusicTrack[] = [
  {
    title: "森林自习室",
    artist: "森水垚, 沐灵仙",
    src: "/music/forest-study-room.mp3",
  },
  {
    title: "海的回响",
    artist: "森水垚, 沐灵仙, 尚衡",
    src: "/music/sea-echoes.mp3",
  },
  {
    title: "萤火虫与小猫",
    artist: "沐灵仙",
    src: "/music/fireflies-and-kitten.mp3",
  },
  {
    title: "七年情书",
    artist: "沐灵仙, 森水垚",
    src: "/music/seven-year-love-letter.mp3",
  },
  {
    title: "闯入仙境",
    artist: "沐灵仙, 森水垚",
    src: "/music/wander-into-wonderland.mp3",
  },
  {
    title: "午后阳光",
    artist: "睡前音乐盒",
    src: "/music/afternoon-sunshine-ocean-piano.mp3",
  },
  {
    title: "The Long Wait",
    artist: "Relaxian",
    src: "/music/long-wait-rain-sounds.mp3",
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

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentIndexRef = useRef(0);
  const playRandomRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const playTrack = useCallback(async (nextIndex: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
    setIsLoading(true);
    audio.pause();
    audio.src = playlist[nextIndex].src;
    audio.currentTime = 0;
    audio.load();

    try {
      await audio.play();
    } catch (error) {
      console.warn("Unable to play the selected track.", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, []);

  const playRandomTrack = useCallback(async () => {
    const nextIndex = pickRandomIndex(playlist.length, currentIndexRef.current);
    await playTrack(nextIndex);
  }, [playTrack]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      return;
    }

    setIsLoading(true);

    try {
      await audio.play();
    } catch (error) {
      console.warn("Unable to resume playback.", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    playRandomRef.current = playRandomTrack;
  }, [playRandomTrack]);

  useEffect(() => {
    const audio = new Audio(playlist[0].src);
    audio.preload = "metadata";
    audio.loop = false;
    audio.volume = 0.58;
    audioRef.current = audio;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      void playRandomRef.current();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const value = useMemo<MusicPlayerContextValue>(
    () => ({
      currentTrack: playlist[currentIndex],
      isLoading,
      isPlaying,
      togglePlayback,
      playRandomTrack,
    }),
    [currentIndex, isLoading, isPlaying, playRandomTrack, togglePlayback],
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
