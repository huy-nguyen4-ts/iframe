type Payload = {
  method: string;
  params: Record<string, any>;
};

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
      else {
        const data = (() => {
          try {
            return JSON.parse(event.data);
          } catch (error) {
            return null;
          }
        })();
        if (data?.id && this.callbacks[data.id]) {
          this.callbacks[data.id](data);
          delete this.callbacks[data.id];
        }
      }
    };
    window.addEventListener('message', listener);
  }

  setIframe(iframe: HTMLIFrameElement) {
    this.iframeResolve(iframe);
  }

  private _id = 1;
  private callbacks: Record<number, (data: { type: 'success' | 'error'; data: any }) => void> = {};
  async call(data: Payload) {
    await this.isPingPromise;
    const iframe = await this.iframePromise;
    const id = this._id++;
    iframe.contentWindow?.postMessage(JSON.stringify({ ...data, id }), '*');
    return new Promise((resolve, reject) => {
      this.callbacks[id] = (data) => {
        if (data.type === 'success') resolve(data.data);
        else if (data.type === 'error') reject(data.data);
      };
    });
  }

  get methods(): Record<string, (params?: Record<string, any>) => Promise<any>> {
    return new Proxy(
      {},
      {
        get: (target, property) => {
          const method = property.toString();
          return async (params?: Record<string, any>) => {
            return this.call({
              method,
              params: params || {},
            });
          };
        },
      }
    );
  }
}

export const postMessage = new PostMessage();
