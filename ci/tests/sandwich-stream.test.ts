import { SandwichStream } from 'sandwich-stream';

jest.setTimeout(10000);

const sandwich = new SandwichStream({});

console.log(sandwich);

describe('Emits content of 1 stream', () => {
    test.skip('Foo', () => expect(true).toBeTruthy());
});
