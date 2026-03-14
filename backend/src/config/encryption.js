import CryptoJS from "crypto-js";

const SECRET = process.env.AES_SECRET;

//Advanced Encryption Standard.
export const encryptData = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET,
  ).toString();

  return ciphertext;
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decrypted);
};
