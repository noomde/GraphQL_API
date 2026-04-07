import { AuthenticationError } from 'apollo-server-errors';
import { JsonWebToken } from '../lib/jsonWebToken.js';

/**
 * Middleware function to authenticate a user using JWT from the Authorization header.
 *
 * @param {object} req - Express request object.
 * @returns {Promise<Object|null>} The decoded user object or null if not authenticated.
 */
export async function authenticateJWT(req) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return null;
    }

    const [authenticationScheme, token] = authorization.split(' ');

    if (authenticationScheme !== 'Bearer') {
      throw new AuthenticationError('Invalid authentication scheme.');
    }

    return await JsonWebToken.decodeUser(token);
  }

/**
 * Ensures that the user is authenticated before allowing access to a resolver.
 *
 * @param {Object} context - The GraphQL context object.
 */
export function ensureAuthenticated(context) {
  if (!context.user) {
    throw new AuthenticationError(
      'You are not authorized to perform this action',
    );
  }
}
