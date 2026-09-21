declare module "dom-to-image-more" {
  interface DomToImageOptions {
    width?: number;
    height?: number;
    cacheBust?: boolean;
    imagePlaceholder?: string;
    bgcolor?: string;
    style?: Record<string, string>;
    filter?: (node: Node) => boolean;
  }

  interface DomToImage {
    toBlob(node: Node, options?: DomToImageOptions): Promise<Blob>;
    toPng(node: Node, options?: DomToImageOptions): Promise<string>;
    toJpeg(node: Node, options?: DomToImageOptions): Promise<string>;
    toSvg(node: Node, options?: DomToImageOptions): Promise<string>;
  }

  const domtoimage: DomToImage;
  export default domtoimage;
}
