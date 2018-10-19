import { SandwichStream } from 'sandwich-stream';
import { PassThrough } from 'stream';

jest.setTimeout(10000);

describe('Testing Sandwich Stream', () => {
    test('Emits content of 1 stream', (done) => {
        const pass = new PassThrough();
        const output = <Uint8Array[]> [];
        const sandwich = new SandwichStream({});
        const testString = 'Content of 1 stream';

        sandwich.add(pass)
                .on('readable', (data: Uint8Array) => output.push(data))
                .on('end', () => {
                    expect(Buffer.concat(output).toString()).toEqual(testString);

                    done();
                });

        pass.write(testString);
        pass.end();
        console.log(sandwich);
    });
});
