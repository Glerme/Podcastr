import {
  createContext,
  useCallback,
  useState,
  ReactNode,
  useContext,
} from "react";

type Episode = {
  title: string;
  member: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlay: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  isLooping: boolean;
  isShuffle: boolean;
  play: (episode: Episode) => void;
  setPlayState: (boolean) => void;
  togglePlay: () => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  toogleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export const PlayerContextProvider = ({
  children,
}: PlayerContextProviderProps) => {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const play = useCallback((episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlay(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlay(!isPlay);
  }, [isPlay]);

  const setPlayState = useCallback(
    (state: boolean) => {
      setIsPlay(state);
    },
    [isPlay]
  );

  const toogleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlay(true);
  };

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  };

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffle || currentEpisodeIndex + 1 < episodeList.length;

  const playNext = () => {
    if (isShuffle) {
      const nextRandom = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandom);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  const playPrevious = () => {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlay,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffle,
        play,
        togglePlay,
        setPlayState,
        playList,
        playNext,
        playPrevious,
        toogleLoop,
        toggleShuffle,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};
