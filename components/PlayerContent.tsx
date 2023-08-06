import React, { useEffect, useState } from "react";
import { BsPauseFill } from "react-icons/bs";
import { HiMiniPlay, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { FaBackward, FaForward } from "react-icons/fa";
import { Howl } from "howler";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import DurationSlider from "./DurationSlider";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl
}) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [intervalId, setIntervalId] = useState<number>(0);

  function setSongVolume(value: number) {
    setVolume(value);
    sound?.volume(value);
  }

  const Icon = isPlaying ? BsPauseFill : HiMiniPlay;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const [sound, setSound] = useState<Howl | null>(null);

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  useEffect(() => {
    const newSound = new Howl({
      src: [songUrl],
      volume: volume,
      html5: true,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3']
    });

    newSound.once('load', () => {
      setDuration(newSound.duration());
    });

    setSound(newSound);

    if (sound) {
      sound.on('play', () => {
        setIsPlaying(true);
      });

      sound.on('pause', () => {
        setIsPlaying(false);
      });

      sound.on('end', () => {
        setIsPlaying(false);
        onPlayNext();
      });

      sound.on('seek', () => {
        console.log("seeking");

        if (sound.playing()) {
          setIsPlaying(true);
        }
      });
    }

    return () => {
      newSound.unload();
    };
  }, [songUrl]);

  const handlePlay = () => {
    if (sound) {
      if (!isPlaying) {
        sound.play();
      } else {
        sound.pause();
      }
    }
  };

  const handleSliderChange = (newTime: number) => {
    setCurrentTime(newTime);
    if (sound) {
      sound.seek(newTime);
      if (newTime >= duration) {
        onPlayNext();
      }
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
        console.log('updated');
      }, 1000);
    } else {
      clearInterval(intervalId!);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>

        <div className="hidden lg:flex items-center gap-x-2 w-[260px]">
          <DurationSlider
            duration={duration}
            currentTime={currentTime}
            onTimestampChange={handleSliderChange}
          />
        </div>
      </div>

      <div
        className="
            flex 
            md:hidden 
            col-auto 
            w-full 
            justify-end 
            items-center
          "
      >
        <div
          onClick={handlePlay}
          className="
              h-10
              w-10
              flex 
              items-center 
              justify-center 
              rounded-full 
              bg-white 
              p-1 
              cursor-pointer
            "
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>



      <div
        className="
            hidden
            h-full
            md:flex 
            justify-center 
            items-center 
            w-full 
            max-w-[722px] 
            gap-x-6
          "
      >
        <FaBackward
          onClick={onPlayPrevious}
          size={30}
          className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            "
        />

        <div
          onClick={handlePlay}
          className="
              flex 
              items-center 
              justify-center
              h-15
              w-15 
              rounded-full 
              bg-white 
              p-1 
              cursor-pointer
            "
        >
          <Icon size={30} className="text-black" />
        </div>

        <FaForward
          onClick={onPlayNext}
          size={30}
          className="
              text-neutral-400 
              cursor-pointer 
              hover:text-white 
              transition
            "
        />
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider
            value={volume}
            onChange={(value) => setSongVolume(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
