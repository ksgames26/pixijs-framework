/**
 * Worker class
 * Wraps tt.createWorker() for Web Worker API compatibility
 */




export class Worker {
  static previousWorker: Worker | null = null;

  public onmessage: ((this: Worker, ev: MessageEvent) => any) | null = null;

  private _worker: TT.WorkerInstance;

  constructor(file: string) {
    // Terminate previous worker if exists
    if (Worker.previousWorker) {
      Worker.previousWorker.terminate();
    }
    Worker.previousWorker = this;

    // Store file reference for potential debugging
    void file;
    this._worker = tt.createWorker(file);

    this._worker.onMessage((res: any) => {
      if (this.onmessage) {
        const event = new MessageEvent('message', { data: res }) as any;
        event.target = this;
        this.onmessage(event);
      }
    });
  }

  postMessage(message: any, transferList?: ArrayBuffer[]): void {
    this._worker.postMessage(message, transferList);
  }

  terminate(): void {
    this._worker.terminate();
    Worker.previousWorker = null;
  }
}

export default Worker;
