export interface Telescope {
  name: string;
  displayName: string;
}

export interface TelescopeLayout {
  boards: number | null;
  pixelGroups: PixelGroup[] | null;
  pixels: Pixel[] | null;
  channels: Channel[] | null;

  pixelSize: number;
  pixelGroupSize: number | null;
}

export type Channel = string;

export interface PixelGroup {
  name: string;
  x: number;
  y: number;
  board: number;
}

export interface Pixel {
  name: string;
  x: number;
  y: number;
  board: number;
  group: number;
}

export interface Event {
  name: string;
  timestamp: number;
  data: number[];
}
