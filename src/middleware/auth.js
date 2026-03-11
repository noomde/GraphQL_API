import { AuthenticationError } from 'apollo-server-errors';
import { JsonWebToken } from '../lib/jsonWebToken.js';
import http from 'node:http';

/**
 * Authenticates a request based on a JSON Web Token (JWT).
 *
 * This middleware checks the authorization header of the request, verifies the authentication scheme,
 * decodes the JWT using the provided public key, and attaches the decoded user object to the `req.user` property.
 * If the authentication fails, an unauthorized response with a 401 Unauthorized status code is sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export async function authenticateJWT(req) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error('Missing authorization header');
    }

    const [authenticationScheme, token] = authorization.split(' ');

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.');
    }

    return await JsonWebToken.decodeUser(token);
  } catch (error) {
    const statusCode = 401;
    const err = new Error(http.STATUS_CODES[statusCode]);
    err.status = statusCode;
    err.cause = error;
    throw err;
  }
}

/**
 * Ensures that the user is authenticated before allowing access to a resolver.
 *
 * @param {Object} context - The GraphQL context object.
 */
export async function ensureAuthenticated(context) {
  if (!context.user) {
    throw new AuthenticationError(
      'You are not authenticated to perform this action',
      'UNAUTHENTICATED',
    );
  }
}
