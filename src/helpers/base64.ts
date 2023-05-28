import { Duplex } from 'stream';

export function convertFileToBase64(file) {
  return btoa(JSON.stringify(file));
}

export function convertBase64ToFile(base64) {
  return JSON.parse(atob(base64));
}

export function bufferToStream(myBuffer) {
  const tmp = new Duplex();
  tmp.push(myBuffer);
  tmp.push(null);
  return tmp;
}
