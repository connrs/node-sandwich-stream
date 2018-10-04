declare module 'sandwich-stream' {
    import { Readable, Stream } from 'stream';

    type Input = string | Buffer;

    export interface Options {
        readonly head: Input;
        readonly tail: Input;
        readonly separator: Input;
    }

    /**
     * Improved stream API.
     */
    class Sandwich extends Readable {
        /**
         * New stream to be added to the piping process.
         * 
         * @param stream New stream to be added.
         */
        add(stream: Stream): void;
    }

    /**
     * Creates the Sandwich stream to easyly handle stream API.
     * 
     * @param options Stream configuration.
     * @returns Sandwich stream.
     */
    export function sandwichStream(options: Options): Sandwich;
}
