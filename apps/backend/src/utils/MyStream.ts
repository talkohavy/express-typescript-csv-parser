import { PassThrough } from 'node:stream';

class MyStream extends PassThrough {
  transformChunk: any;
  onData: (value: any) => Promise<void>;
  onEnd: () => void;

  constructor({ transformChunk = undefined, onData = undefined, onEnd = undefined }) {
    super({ objectMode: true });

    this.transformChunk = transformChunk;
    this.onData = onData;
    this.onEnd = onEnd;
  }

  override async _transform(chunk: any, _encoding, callback): Promise<void> {
    const transformedChunk = this.transformChunk ? this.transformChunk(chunk) : chunk;
    await this.onData?.(transformedChunk);
    this.push(transformedChunk);

    callback();
  }

  /** @override */
  override _flush(callback): void {
    this.onEnd?.();
    callback();
  }
}

export { MyStream };
