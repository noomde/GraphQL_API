import 'dotenv/config';
import jwt from 'jsonwebtoken';

const privateKey = Buffer.from(process.env.JWT_PRIVATE_KEY, 'base64').toString(
  'utf8',
);

const publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY, 'base64').toString(
  'utf8',
);

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
    return jwt.sign(
      {
        sub: user.id,
        username: user.username,
      },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn,
      },
    );
  }

  /**
   * Decodes a JWT and verifies it using the public key.
   *
   * @param {string} token - The JWT to decode.
   * @returns {Promise<object>} The decoded user object.
   */
  static decodeUser(token) {
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    });
  }
}
