import 'react-native-url-polyfill/auto';
import * as ExpoCrypto from 'expo-crypto';

const root = typeof globalThis !== 'undefined' ? globalThis : global;

if (!root.crypto) {
  // @ts-ignore
  root.crypto = {};
}

if (typeof root.crypto.getRandomValues !== 'function') {
  root.crypto.getRandomValues = ExpoCrypto.getRandomValues;
}
