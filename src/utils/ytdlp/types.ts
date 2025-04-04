
// Interface for YT-DLP info extraction
export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  formats: VideoFormat[];
  isPlaylist: boolean;
  playlistItems?: VideoInfo[];
  playlistTitle?: string;
  playlistCount?: number;
}

export interface VideoFormat {
  formatId: string;
  extension: string;
  resolution?: string;
  filesize?: number;
  audioQuality?: string;
  type: "audio" | "video" | "both";
  quality: string;
}
