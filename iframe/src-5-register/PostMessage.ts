type Payload = {
  methodName: string;
  params: Record<string, any>;
  id: number;
};
type Method = (params: Record<string, any>) => Promise<any> | any;
export class PostMessage {
  exposePromises: Record<string, Promise<Method>> = {};
  exposeResolves: Record<string, (method: Method) => void> = {};

  initialize() {
    window.parent.postMessage('ping', '*');

    const listener = async (event: MessageEvent) => {
      const data = (() => {
        try {
          return JSON.parse(event.data) as Payload;
        } catch (error) {
          return null;
        }
      })();

      if (!data?.methodName) return;

      if (!(data.methodName in this.exposePromises)) {
        this.exposePromises[data.methodName] = new Promise<Method>((resolve) => {
          this.exposeResolves[data.methodName] = resolve;
        });
      }

      const method = await this.exposePromises[data.methodName];

      try {
        const response = await method(data.params);
        window.parent.postMessage(
          JSON.stringify({ data: response, type: 'success', id: data.id }),
          '*'
        );
      } catch (error) {
        window.parent.postMessage(
          JSON.stringify({ data: error, type: 'success', id: data.id }),
          '*'
        );
      }
    };
    window.addEventListener('message', listener);
  }

  register(methodName: string, method: Method) {
    if (!(methodName in this.exposeResolves)) {
      this.exposePromises[methodName] = new Promise<Method>((resolve) => {
        resolve(method);
      });
    } else {
      this.exposeResolves[methodName](method);
    }
  }
}

export const postMessage = new PostMessage();
