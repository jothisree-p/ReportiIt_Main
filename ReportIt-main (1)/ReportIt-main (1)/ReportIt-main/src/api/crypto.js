import { AUTH_URL } from "./config";
import { apiRequest } from "./http";

let cachedPublicKeyPromise;

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
};

const getPublicKey = async () => {
  if (!cachedPublicKeyPromise) {
    cachedPublicKeyPromise = apiRequest("/api/auth/crypto/public-key", {
      baseUrl: AUTH_URL,
      auth: false,
    }).then((data) =>
      window.crypto.subtle.importKey(
        "spki",
        base64ToArrayBuffer(data.publicKey),
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["encrypt"]
      )
    );
  }
  return cachedPublicKeyPromise;
};

export const encryptPassword = async (password) => {
  const publicKey = await getPublicKey();
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new TextEncoder().encode(password)
  );
  return `enc:v1:${arrayBufferToBase64(encrypted)}`;
};
