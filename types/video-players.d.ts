// YouTube IFrame Player API Types
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
    Vimeo: typeof Vimeo;
  }
}

// YouTube API Types
declare namespace YT {
  interface Player {
    addEventListener(event: string, listener: (event: any) => void): void;
    removeEventListener(event: string, listener: (event: any) => void): void;
    destroy(): void;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    loadVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): void;
    loadVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): void;
    cueVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): void;
    cueVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    clearVideo(): void;
    nextVideo(): void;
    previousVideo(): void;
    playVideoAt(index: number): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;
    setSize(width: number, height: number): object;
    getPlaybackRate(): number;
    setPlaybackRate(suggestedRate: number): void;
    getAvailablePlaybackRates(): number[];
    setLoop(loopPlaylists: boolean): void;
    setShuffle(shufflePlaylist: boolean): void;
    getVideoLoadedFraction(): number;
    getPlayerState(): PlayerState;
    getCurrentTime(): number;
    getPlaybackQuality(): string;
    setPlaybackQuality(suggestedQuality: string): void;
    getAvailableQualityLevels(): string[];
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getPlaylist(): string[];
    getPlaylistIndex(): number;
    getVideoData(): VideoData;
    addCueRange(start: number, end: number): void;
    removeCueRange(id: string): void;
  }

  interface PlayerOptions {
    width?: string | number;
    height?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: Events;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    cc_lang_pref?: string;
    cc_load_policy?: 0 | 1;
    color?: 'red' | 'white';
    controls?: 0 | 1 | 2;
    disablekb?: 0 | 1;
    enablejsapi?: 0 | 1;
    end?: number;
    fs?: 0 | 1;
    hl?: string;
    iv_load_policy?: 1 | 3;
    list?: string;
    listType?: 'playlist' | 'user_uploads';
    loop?: 0 | 1;
    modestbranding?: 0 | 1;
    origin?: string;
    playlist?: string;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    showinfo?: 0 | 1;
    start?: number;
    widget_referrer?: string;
  }

  interface Events {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: PlayerEvent) => void;
    onPlaybackQualityChange?: (event: PlayerEvent) => void;
    onPlaybackRateChange?: (event: PlayerEvent) => void;
    onError?: (event: PlayerEvent) => void;
    onApiChange?: (event: PlayerEvent) => void;
  }

  interface PlayerEvent {
    target: Player;
    data: any;
  }

  interface VideoData {
    video_id: string;
    author: string;
    title: string;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }

  enum PlayerError {
    INVALID_PARAM = 2,
    HTML5_ERROR = 5,
    VIDEO_NOT_FOUND = 100,
    EMBED_NOT_ALLOWED = 101,
    EMBED_NOT_ALLOWED_DISGUISE = 150
  }

  function ready(callback: () => void): void;
  function load(): void;
  function setConfig(config: any): void;
  function get(id: string): Player;

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
  }
}

// Vimeo Player API Types
declare namespace Vimeo {
  interface Player {
    on(event: string, callback: Function): void;
    off(event: string, callback?: Function): void;
    ready(): Promise<void>;
    enableTextTrack(language: string, kind?: string): Promise<void>;
    disableTextTrack(): Promise<void>;
    getTextTracks(): Promise<TextTrack[]>;
    getCurrentTime(): Promise<number>;
    setCurrentTime(seconds: number): Promise<number>;
    getDuration(): Promise<number>;
    getEnded(): Promise<boolean>;
    getLoop(): Promise<boolean>;
    setLoop(loop: boolean): Promise<boolean>;
    getPaused(): Promise<boolean>;
    getPlaybackRate(): Promise<number>;
    setPlaybackRate(playbackRate: number): Promise<number>;
    getPlayed(): Promise<TimeRange[]>;
    getSeekable(): Promise<TimeRange[]>;
    getSeeking(): Promise<boolean>;
    getVideoEmbedCode(): Promise<string>;
    getVideoId(): Promise<number>;
    getVideoTitle(): Promise<string>;
    getVideoWidth(): Promise<number>;
    getVideoHeight(): Promise<number>;
    getVideoUrl(): Promise<string>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<number>;
    getMuted(): Promise<boolean>;
    setMuted(muted: boolean): Promise<boolean>;
    getChapters(): Promise<Chapter[]>;
    getCurrentChapter(): Promise<Chapter>;
    getCuePoints(): Promise<CuePoint[]>;
    getBuffered(): Promise<TimeRange[]>;
    play(): Promise<void>;
    pause(): Promise<void>;
    unload(): Promise<void>;
    destroy(): Promise<void>;
    getAutopause(): Promise<boolean>;
    setAutopause(autopause: boolean): Promise<boolean>;
    getColor(): Promise<string>;
    setColor(color: string): Promise<string>;
    addCuePoint(time: number, data?: object): Promise<string>;
    removeCuePoint(id: string): Promise<string>;
    getQualities(): Promise<string[]>;
    getQuality(): Promise<string>;
    setQuality(quality: string): Promise<void>;
    getCameraProps(): Promise<CameraProps>;
    setCameraProps(props: Partial<CameraProps>): Promise<void>;
  }

  interface PlayerOptions {
    id?: number;
    url?: string;
    autopause?: boolean;
    autoplay?: boolean;
    background?: boolean;
    byline?: boolean;
    color?: string;
    controls?: boolean;
    dnt?: boolean;
    height?: number;
    interactive_params?: string;
    keyboard?: boolean;
    loop?: boolean;
    maxheight?: number;
    maxwidth?: number;
    muted?: boolean;
    pip?: boolean;
    playsinline?: boolean;
    portrait?: boolean;
    quality?: 'auto' | '240p' | '360p' | '540p' | '720p' | '1080p' | '2k' | '4k';
    responsive?: boolean;
    speed?: boolean;
    texttrack?: string;
    title?: boolean;
    transparent?: boolean;
    width?: number;
  }

  interface TextTrack {
    language: string;
    kind: string;
    label: string;
  }

  interface TimeRange {
    start: number;
    end: number;
  }

  interface Chapter {
    startTime: number;
    title: string;
    index: number;
  }

  interface CuePoint {
    time: number;
    data: object;
    id: string;
  }

  interface CameraProps {
    yaw: number;
    pitch: number;
    roll: number;
    fov: number;
  }

  interface VimeoError {
    name: string;
    message: string;
    method: string;
  }

  class Player {
    constructor(element: HTMLElement | string, options?: PlayerOptions);
  }
}

// Global type exports
export interface VideoPlayerInterface {
  initialize(container: HTMLElement): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seekTo(time: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  setMuted(muted: boolean): Promise<void>;
  setPlaybackRate(rate: number): Promise<void>;
  getCurrentTime(): number;
  getDuration(): number;
  getVolume(): number;
  isMuted(): boolean;
  getPlaybackRate(): number;
  getPlayerState(): 'playing' | 'paused' | 'buffering' | 'ended' | 'unstarted';
  on(event: string, callback: Function): void;
  off(event: string, callback?: Function): void;
  destroy(): Promise<void>;
}

export interface VideoPlayerFactory {
  create(url: string): VideoPlayerInterface;
  detectPlatform(url: string): 'youtube' | 'vimeo' | 'unknown';
}

export interface VideoPlayerConfig {
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  quality?: string;
  playbackRate?: number;
  volume?: number;
}

export interface VideoPlayerEvent {
  type: 'ready' | 'play' | 'pause' | 'ended' | 'timeupdate' | 'error' | 'seeking' | 'seeked' | 'volumechange' | 'ratechange' | 'qualitychange';
  target: VideoPlayerInterface;
  data?: any;
}

export interface VideoPlayerError {
  code: number;
  message: string;
  details?: any;
}

// Module declarations for external libraries
declare module '@vimeo/player' {
  export default Vimeo.Player;
}

declare module 'youtube-player' {
  interface Options {
    width?: number;
    height?: number;
    videoId?: string;
    playerVars?: YT.PlayerVars;
    events?: YT.Events;
  }
  
  function createPlayer(element: string | HTMLElement, options?: Options): YT.Player;
  export default createPlayer;
}