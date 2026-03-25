"use client";

import { LoaderCircle, Music4, Pause, Play, Shuffle } from "lucide-react";
import { useMusicPlayer } from "@/components/providers/music-player-provider";
import { cn } from "@/lib/cn";

export function MusicFloatingPlayer() {
  const { currentTrack, isLoading, isPlaying, playRandomTrack, togglePlayback } = useMusicPlayer();

  return (
    <div className="music-player-dock" data-loading={isLoading} data-playing={isPlaying}>
      <div className="music-player-dock__meta" aria-live="polite">
        <p className="music-player-dock__eyebrow">专注伴音</p>
        <p className="music-player-dock__title">{currentTrack.title}</p>
        <p className="music-player-dock__artist">{currentTrack.artist}</p>
      </div>

      <div className="music-player-dock__controls">
        <button
          type="button"
          onClick={() => void togglePlayback()}
          className={cn("music-player-dock__button music-player-dock__button--primary", isPlaying && "music-player-dock__button--active")}
          aria-label={isPlaying ? `暂停 ${currentTrack.title}` : `播放 ${currentTrack.title}`}
          title={isPlaying ? `暂停 ${currentTrack.title}` : `播放 ${currentTrack.title}`}
        >
          <span className="music-player-dock__glow" />
          <span className="music-player-dock__badge" aria-hidden="true">
            <Music4 className="h-3.5 w-3.5" />
          </span>
          <span className="music-player-dock__bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {isLoading ? (
            <LoaderCircle className="h-[1.1rem] w-[1.1rem] animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-[1.1rem] w-[1.1rem]" />
          ) : (
            <Play className="h-[1.1rem] w-[1.1rem] translate-x-[1px]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => void playRandomTrack()}
          className="music-player-dock__button music-player-dock__button--shuffle"
          aria-label="随机切换音乐"
          title="随机切换音乐"
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
