declare module 'use-sound' {
  import { ReactNode } from 'react';

  interface HookOptions {
    id?: string;
    volume?: number;
    playbackRate?: number;
    soundEnabled?: boolean;
    interrupt?: boolean;
    onload?: () => void;
    format?: string[];
    [key: string]: string | number | boolean | (() => void) | string[] | undefined;
  }


  type PlayFunction = (options?: HookOptions) => void;

  interface SoundInstance {
    play: PlayFunction;
    stop: (id?: string) => void;
    pause: (id?: string) => void;
    duration: number | null;
    sound: any;
  }

  type ReturnedValue = [PlayFunction, SoundInstance];

  export default function useSound(
    src: string | string[],
    options?: HookOptions
  ): ReturnedValue;
}
