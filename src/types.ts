export interface ImageInfo {
  name: string;
  path: string;
  thumbnail_path: string;
  size: number;
  modified: string;
  mime: string;
  width: number;
  height: number;
  aspect_ratio: number;
  thumbnail_width: number;
  thumbnail_height: number;
  type: 'image';
}

export interface DirectoryItem {
  type: 'directory';
  name: string;
  path: string;
} 