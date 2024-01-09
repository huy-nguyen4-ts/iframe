export class PostMessage {
  private iframeResolve: (iframe: HTMLIFrameElement) => void = () => undefined;
  private iframePromise: Promise<HTMLIFrameElement>;

  private isPingResolve: (isPing: boolean) => void = () => undefined;
  private isPingPromise: Promise<boolean>;

  constructor() {
    this.iframePromise = new Promise<HTMLIFrameElement>((resolve) => {
      this.iframeResolve = resolve;
    });
    this.isPingPromise = new Promise((resolve) => {
      this.isPingResolve = resolve;
    });
  }

  initialize() {
    const listener = (event: MessageEvent) => {
      if (event.data === 'ping') this.isPingResolve(true);
    };
    window.addEventListener('message', listener);
  }

  setIframe(iframe: HTMLIFrameElement) {
    this.iframeResolve(iframe);
  }

  async call(data: string) {
    await this.isPingPromise;
    const iframe = await this.iframePromise;
    iframe.contentWindow?.postMessage(data, '*');
  }
}

export const postMessage = new PostMessage();
