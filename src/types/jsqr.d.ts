declare module 'jsqr' {
  export interface QRCode {
    data: string;
    binaryData?: Uint8ClampedArray;
    location?: any;
    version?: number;
  }
  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): QRCode | null;
}
