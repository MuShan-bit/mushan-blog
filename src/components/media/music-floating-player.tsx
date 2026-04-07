"use client";

import { LoaderCircle, Music4, Pause, Play, Shuffle } from "lucide-react";
import { useMusicPlayer } from "@/components/providers/music-player-provider";
import { cn } from "@/lib/cn";

export function MusicFloatingPlayer() {
  const {
    currentTrack,
    handleFrameLoad,
    hasMultipleTracks,
    iframeKey,
    iframeSrc,
    isLoading,
    isPlaying,
    playRandomTrack,
    togglePlayback,
  } = useMusicPlayer();

  return (
    <div className="music-player-dock" data-loading={isLoading} data-playing={isPlaying}>
      <div className="music-player-dock__frame" aria-hidden="true">
        {iframeSrc ? (
          <iframe
            key={iframeKey}
            frameBorder="0"
            marginWidth={0}
            marginHeight={0}
            width="298"
            height="52"
            src={iframeSrc}
            title={`${currentTrack.title} - 网易云音乐外链播放器`}
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media"
            onLoad={handleFrameLoad}
          />
        ) : null}
      </div>

      <div className="music-player-dock__meta" aria-live="polite">
        <p className="music-player-dock__eyebrow">专注伴音</p>
        <p className="music-player-dock__title">{currentTrack.title}</p>
        <p className="music-player-dock__artist">{currentTrack.artist}</p>
      </div>

      <div className="music-player-dock__controls">
        <button
          type="button"
          onClick={() => void togglePlayback()}
          className={cn(
            "music-player-dock__button music-player-dock__button--primary",
            isPlaying && "music-player-dock__button--active",
          )}
          aria-label={isPlaying ? `停止播放 ${currentTrack.title}` : `播放 ${currentTrack.title}`}
          title={isPlaying ? `停止播放 ${currentTrack.title}` : `播放 ${currentTrack.title}`}
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
          aria-label={hasMultipleTracks ? "随机切换音乐" : "重新载入网易云播放器"}
          title={hasMultipleTracks ? "随机切换音乐" : "重新载入网易云播放器"}
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
