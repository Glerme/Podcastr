import { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Image from "next/image";

import { usePlayer } from "../../contexts/PlayerContext";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import styles from "../Player/styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

const Player: NextPage = () => {
  const {
    currentEpisodeIndex,
    episodeList,
    isPlay,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffle,
    toogleLoop,
    togglePlay,
    setPlayState,
    playNext,
    playPrevious,
    toggleShuffle,
    clearPlayerState,
  } = usePlayer();

  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlay) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay]);

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", (e) => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  };

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  const handleEpisodeEnded = () => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  };

  return (
    <div className={styles.playerContainer}>
      {/* tag audio */}
      {episode && (
        <audio
          src={episode.url}
          autoPlay
          ref={audioRef}
          loop={isLooping}
          onPlay={() => {
            setPlayState(true);
          }}
          onPause={() => {
            setPlayState(false);
          }}
          onLoadedMetadata={() => setupProgressListener()}
          onEnded={() => handleEpisodeEnded()}
        />
      )}

      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong>Tocando Agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.member}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um Podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ background: "#04d361" }}
                railStyle={{ background: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: "1px" }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={() => toggleShuffle()}
            className={isShuffle ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={() => playPrevious()}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            className={styles.playButton}
            type="button"
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlay ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={() => playNext()}
          >
            <img src="/play-next.svg" alt="Tocar Próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={() => toogleLoop()}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Player;
