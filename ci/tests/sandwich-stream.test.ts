import { SandwichStream } from 'sandwich-stream';
import { PassThrough } from 'stream';

jest.setTimeout(10000);

const testString = 'Content of one stream';

describe('Testing with one stream', () => {
    test('Setting all configurations', async (done) => {
        const head = 'foo\n';
        const tail = '\nbar\n';
        const separator = '\n---\n';
        const pass = new PassThrough();
        const sandwich = new SandwichStream({ head, separator, tail });
        let output = '';

        expect.assertions(1);

        sandwich.add(pass)
                .setEncoding('utf8')
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: string) => output += data)
                .on('end', () => {
                    expect(output).toMatch(`${head}${testString}${tail}`);

                    done();
                });

        pass.write(testString);
        pass.end();
    });

    test('Setting enconding to utf8', async (done) => {
        const pass = new PassThrough();
        const sandwich = new SandwichStream({});
        let output = '';

        expect.assertions(1);

        sandwich.add(pass)
                .setEncoding('utf8')
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: string) => output += data)
                .on('end', () => {
                    expect(output).toMatch(testString);

                    done();
                });

        pass.write(testString);
        pass.end();
    });

    test('Setting enconding to utf8 and passing through in chunks', async (done) => {
        const pass = new PassThrough();
        const sandwich = new SandwichStream({});
        let output = '';

        expect.assertions(1);

        sandwich.add(pass)
                .setEncoding('utf8')
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: string) => output += data)
                .on('end', () => {
                    expect(output).toMatch(testString);

                    done();
                });

        pass.write('Content ');

        process.nextTick(() => {
            pass.write('of one stream');

            process.nextTick(() => pass.end());
        });
    });

    test('Without setting enconding', async (done) => {
        const pass = new PassThrough();
        const output = <Uint8Array[]> [];
        const sandwich = new SandwichStream({});

        expect.assertions(1);

        sandwich.add(pass)
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: Uint8Array) => output.push(data))
                .on('end', () => {
                    expect(Buffer.concat(output).toString()).toMatch(testString);

                    done();
                });

        pass.write(testString);
        pass.end();
    });

    test('Without setting enconding and passing through in chunks', async (done) => {
        const pass = new PassThrough();
        const output = <Uint8Array[]>[];
        const sandwich = new SandwichStream({});

        expect.assertions(1);

        sandwich.add(pass)
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: Uint8Array) => output.push(data))
                .on('end', () => {
                    expect(Buffer.concat(output).toString()).toMatch(testString);

                    done();
                });

        pass.write('Content ');

        process.nextTick(() => {
            pass.write('of one stream');

            process.nextTick(() => pass.end());
        });
    });
});

describe('Testing with two streams', () => {
    test('Setting all configurations', async (done) => {
        const head = 'foo\n';
        const tail = '\nbar\n';
        const separator = '\n---\n';
        const passOne = new PassThrough();
        const passTwo = new PassThrough();
        const sandwich = new SandwichStream({ head, separator, tail });
        let output = '';

        expect.assertions(1);

        sandwich.add(passOne)
                .add(passTwo)
                .setEncoding('utf8')
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: string) => output += data)
                .on('end', () => {
                    expect(output).toMatch(`${head}${testString}${separator}${testString}${tail}`);

                    done();
                });

        passOne.write(testString);
        passTwo.write(testString);
        passOne.end();
        passTwo.end();
    });

    test('Setting enconding to utf8', async (done) => {
        const passOne = new PassThrough();
        const passTwo = new PassThrough();
        const sandwich = new SandwichStream({});
        let output = '';

        expect.assertions(1);

        sandwich.add(passOne)
                .add(passTwo)
                .setEncoding('utf8')
                .on('error', console.error)

                .on('uncaughtException', console.error)
                .on('data', (data: string) => output += data)
                .on('end', () => {
                    expect(output).toMatch(`${testString}${testString}`);

                    done();
                });

        passOne.write(testString);
        passTwo.write(testString);
        passOne.end();
        passTwo.end();
    });

    test('Setting enconding to utf8 and passing through in chunks', async (done) => {
        const passOne = new PassThrough();
        const passTwo = new PassThrough();
        const sandwich = new SandwichStream({});
        let output = '';

        expect.assertions(1);

        sandwich.add(passOne)
                .add(passTwo)
                .setEncoding('utf8')
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: string) => output += data)
                .on('end', () => {
                    expect(output).toMatch(`${testString}${testString}`);

                    done();
                });

        passOne.write('Content ');

        process.nextTick(() => {
            passOne.write('of one stream');

            process.nextTick(() => {
                passOne.end();

                process.nextTick(() => {
                    passTwo.write('Content ');

                    process.nextTick(() => {
                        passTwo.write('of one stream');

                        process.nextTick(() => passTwo.end());
                    });
                });
            });
        });
    });

    test('Without setting enconding', async (done) => {
        const output = <Uint8Array[]>[];
        const passOne = new PassThrough();
        const passTwo = new PassThrough();
        const sandwich = new SandwichStream({});

        expect.assertions(1);

        sandwich.add(passOne)
                .add(passTwo)
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: Uint8Array) => output.push(data))
                .on('end', () => {
                    expect(Buffer.concat(output).toString()).toMatch(`${testString}${testString}`);

                    done();
                });

        passOne.write(testString);
        passTwo.write(testString);
        passOne.end();
        passTwo.end();
    });

    test('Without setting enconding and passing through in chunks', async (done) => {
        const output = <Uint8Array[]>[];
        const passOne = new PassThrough();
        const passTwo = new PassThrough();
        const sandwich = new SandwichStream({});

        expect.assertions(1);

        sandwich.add(passOne)
                .add(passTwo)
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('data', (data: Uint8Array) => output.push(data))
                .on('end', () => {
                    expect(Buffer.concat(output).toString()).toMatch(`${testString}${testString}`);

                    done();
                });

        passOne.write('Content ');

        process.nextTick(() => {
            passOne.write('of one stream');

            process.nextTick(() => {
                passOne.end();

                process.nextTick(() => {
                    passTwo.write('Content ');

                    process.nextTick(() => {
                        passTwo.write('of one stream');

                        process.nextTick(() => passTwo.end());
                    });
                });
            });
        });
    });
});

describe('Concurrent streams', () => {
    const output = <Uint8Array[]>[];
    const passOne = new PassThrough();
    const passTwo = new PassThrough();
    const sandwich = new SandwichStream({});

    beforeAll(() => {
        passOne.write(testString);
        passTwo.write(testString);

        sandwich.add(passOne)
                .on('data', (data: Uint8Array) => {
                    output.push(data);
                    sandwich.add(passTwo);
                });
    });

    test('Without setting enconding and setting two concurrent streams', (done) => {
        expect.assertions(1);

        sandwich.add(passTwo)
                .on('error', console.error)
                .on('uncaughtException', console.error)
                .on('end', () => {
                    expect(Buffer.concat(output).toString()).toMatch(`${testString}${testString}`);

                    done();
                });

        passOne.end();
        passTwo.end();
    });
});

describe('Errors', () => {
    test('Writing after ending PassThrough', async (done) => {
        const pass = new PassThrough();
        const sandwich = new SandwichStream({});
        let output = '';

        expect.assertions(2);

        sandwich.add(pass)
                .setEncoding('utf8')
                .on('error', (err) => {
                    expect(err).toEqual(new Error('[ERR_STREAM_WRITE_AFTER_END]: write after end'));
                })
                .on('uncaughtException', console.error)
                .on('data', (data: string) => output += data)
                .on('end', () => {
                    expect(output).toMatch(testString);

                    done();
                });

        pass.write(testString);
        pass.end();
        pass.write(testString);
    });
});
