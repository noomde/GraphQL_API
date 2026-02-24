import { JsonWebToken } from '../lib/jsonWebToken.js'
import http from 'node:http'

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
export const authenticateJWT = async (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    req.user = await JsonWebToken.decodeUser(token)

    next()
  } catch (error) {
    const statusCode = 401
    const err = new Error(http.STATUS_CODES[statusCode])
    err.status = statusCode
    err.cause = error

    next(err)
  }
}



/**
 * Authorizes a request based on the user associated with the resource.
 *
 * @param {*} req - Express request object.
 * @param {*} res - Express response object.
 * @param {*} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const authorizeJWT = async (req, res, next) => {
  if (!req.doc) {
    return res
      .status(404)
      .json({ error: 'Resource not found.' })
  }

  if (req.doc.createdBy === req.user.id.toString()) {
    next()
  } else {
    const error = new Error('Forbidden: You are not the owner of this resource.')
    error.status = 403
    next(error)
  }
}

