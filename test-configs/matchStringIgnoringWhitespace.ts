import {replace, map, equals} from 'ramda';
import {matcherHint, printReceived, printExpected} from 'jest-matcher-utils';
import diff from 'jest-diff';

const replaceWhitespace = replace(/\s+/g, ` `);
const compressWhitespace = map(replaceWhitespace);

const name = `toEqualWithCompressedWhitespace`;

export default function (received, expected) {
  const [
    receivedWithCompressedWhitespace,
    expectedWithCompressedWhitespace,
  ] = compressWhitespace([received, expected]);
  const pass = equals(
    receivedWithCompressedWhitespace,
    expectedWithCompressedWhitespace
  );
  const message = pass
    ? () =>
      `${matcherHint(`.not.${name}`)}\n\n` +
      `Uncompressed expected value:\n` +
      `  ${printExpected(expected)}\n` +
      `Expected value with compressed whitespace to not equal:\n` +
      `  ${printExpected(expectedWithCompressedWhitespace)}\n` +
      `Uncompressed received value:\n` +
      `  ${printReceived(received)}\n` +
      `Received value with compressed whitespace:\n` +
      `  ${printReceived(receivedWithCompressedWhitespace)}`
    : () => {
      const diffString = diff(
        expectedWithCompressedWhitespace,
        receivedWithCompressedWhitespace,
        {
          expand: this.expand,
        }
      );
      return (
        `${matcherHint(`.${name}`)}\n\n` +
        `Uncompressed expected value:\n` +
        `  ${printExpected(expected)}\n` +
        `Expected value with compressed whitespace to equal:\n` +
        `  ${printExpected(expectedWithCompressedWhitespace)}\n` +
        `Uncompressed received value:\n` +
        `  ${printReceived(received)}\n` +
        `Received value with compressed whitespace:\n` +
        `  ${printReceived(receivedWithCompressedWhitespace)}${
          diffString ? `\n\nDifference:\n\n${diffString}` : ``
        }`
      );
    };
  return {
    actual: received,
    expected,
    message,
    name,
    pass,
  };
};
