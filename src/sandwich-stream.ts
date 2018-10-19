import { Readable, ReadableOptions } from 'stream';

/**
 * Sandwich Options that will configure parsed data
 */
export interface SandwichOptions extends ReadableOptions {
    readonly head?: string | Buffer;
    readonly tail?: string | Buffer;
    readonly separator?: string | Buffer;
}

/**
 * Handles Readable streams requests as concatenation through data handling as
 * well adding tags it each begin, end and between of the streams
 */
export class SandwichStream extends Readable {
    private streamsActive = false;
    private streams = <Readable[]> [];
    private head: string | Buffer | null;
    private tail: string | Buffer | null;
    private separator: string | Buffer | null;
    private currentStream: Readable | null = null;

    /**
     * Initiates the SandwichStream, you can consider it also passing
     * ReadableOptions to it
     *
     * @param head Pushes this content before all other content
     * @param tail Pushes this content after all other data has been pushed
     * @param separator Pushes this content between each stream
     * @param remaining The other kind of options to be passed to Readable
     * @example
     * const ss = new SandwichStream({
     *     head: 'This at the top\n',
     *     tail: '\nThis at the bottom',
     *     separator: '\n --- \n'
     * });
     */
    constructor({ head, tail, separator, ...remaining }: SandwichOptions) {
        super(remaining);

        this.head = (null !== head && undefined !== head) ? head : null;
        this.tail = (null !== tail && undefined !== tail) ? tail : null;
        this.separator = (null !== separator && undefined !== separator) ? separator : null;
    }

    /**
     * Add a new Readable stream in the queue
     *
     * @param newStream The Readable stream
     * @example
     * sandwichStream.add(streamOne);
     * sandwichStream.add(streamTwo);
     * sandwichStream.add(streamThree);
     * @throws An Error in case that this request was not accepted
     */
    public add(newStream: Readable): SandwichStream {
        if (false === this.streamsActive) {
            this.streams.push(newStream);
            newStream.on('error', this.subStreamOnError.bind(this));
        } else {
            throw new Error('SandwichStream error adding new stream while streaming');
        }

        return this;
    }

    /**
     * Works in a similar way from the Readable read, only that this one checks
     * for whether or not a stream is already being handled
     */
    public read(): SandwichStream {
        if (false === this.streamsActive) {
            this.streamsActive = true;
            this.pushHead();
            this.streamNextStream();
        }

        return this;
    }

    /**
     * Binds an error thrown from one of the streams being handled
     *
     * @param err Error to be bind
     */
    private subStreamOnError(err: Error): SandwichStream {
        this.emit('error', err);

        return this;
    }

    /**
     * Fetches the next stream to be handled
     */
    private streamNextStream(): SandwichStream {
        if (true === this.nextStream()) {
            this.bindCurrentStreamEvents();
        } else {
            this.pushTail();
            this.push(null);
        }

        return this;
    }

    /**
     * Verifies whether or not the stream queue has ended
     */
    private nextStream(): boolean {
        const tmp = this.streams.shift();
        this.currentStream = (undefined !== tmp) ? tmp : null;

        return null !== this.currentStream;
    }

    /**
     * Once the current stream starts to pass their data, this handles it in a
     * less complicated way
     */
    private bindCurrentStreamEvents(): SandwichStream {
        (<Readable> this.currentStream).on('readable', this.currentStreamOnReadable.bind(this));
        (<Readable> this.currentStream).on('end', this.currentStreamOnEnd.bind(this));

        return this;
    }

    /**
     * Handles the data from a current stream once they are being streamed
     */
    private currentStreamOnReadable(): SandwichStream {
        const tmp = (<Readable> this.currentStream).read();
        const data = (undefined !== tmp && null !== tmp) ? tmp : '';

        this.push(data);

        return this;
    }

    /**
     * Handles the tagging once a stream is finished
     */
    private currentStreamOnEnd(): SandwichStream {
        this.pushSeparator();
        this.streamNextStream();

        return this;
    }
    /**
     * Adds the head tag to the Sandwich Stream
     */
    private pushHead(): SandwichStream {
        if (null !== this.head) {
            this.push(this.head);
        }

        return this;
    }

    /**
     * Adds the separator tag to the Sandwich Stream
     */
    private pushSeparator(): SandwichStream {
        if (0 < this.streams.length && null !== this.separator) {
            this.push(this.separator);
        }

        return this;
    }

    /**
     * Adds the tail tag to the Sandwich Stream
     */
    private pushTail(): SandwichStream {
        if (null !== this.tail) {
            this.push(this.tail);
        }

        return this;
    }
}

export default SandwichStream;
