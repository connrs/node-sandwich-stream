import { SandwichStream } from 'sandwich-stream';
import { PassThrough } from 'stream';

jest.setTimeout(10000);

describe('Testing Sandwich Stream', () => {
    test.skip('Emits content of 1 stream', async () => {
        const pass = new PassThrough();
        const output = <Uint8Array[]> [];
        const sandwich = new SandwichStream({});
        const testString = 'Content of 1 stream';

        expect.assertions(1);

        sandwich.add(pass)
                .setEncoding('UTF8')
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: Uint8Array) => output.push(data))
                .on('end', () => expect(Buffer.concat(output).toString()).toEqual(testString));

        pass.write(testString);
        pass.end();
    });
});
