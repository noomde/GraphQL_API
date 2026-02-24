import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync("futute private key", "utf8");
const publicKey = fs.readFileSync("futute public key", "utf8");

/**
 * Exposes methods for working with JSON Web Tokens (JWTs).
 */
export class JsonWebToken {
  /**
   * Encodes user information into a JSON Web Token (JWT) payload.
   *
   * @param {object} user - The user object containing user information to encode.
   * @param {string|number} expiresIn - The expiration time for the JWT, specified in seconds or as a string describing a time span.
   * @returns {Promise<string>} A Promise that resolves to the generated JWT.
   */
  static encodeUser(user, expiresIn) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          iat: Math.floor(Date.now() / 1000),
          sub: user._id,
          username: user.username,
        },
        privateKey,
        {
          algorithm: "RS256",
          expiresIn,
        },
        (error, token) => {
          if (error) {
            reject(new Error(`JWT Sign Error: ${error.message}`));
            return;
          }
          resolve(token);
        },
      );
    });
  }

  /**
   * Decodes a JWT and verifies it using the public key.
   *
   * @param {string} token - The JWT to decode.
   * @returns {Promise<object>} The decoded user object.
   */
  static decodeUser(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
