import xss from 'xss';

/**
 * Sanitizes input in the form of string, array and objects.
 *
 * @param {*} input - the input to be sanitized.
 * @returns the sanitized input.
 */
export function sanitize(input) {
  if (typeof input === 'string') {
    return xss(input);
  }

  if (Array.isArray(input)) {
    return input.map(sanitize);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized = {};

    for (const key in input) {
      sanitized[key] = sanitize(input[key]);
    }

    return sanitized;
  }

  return input;
}

/**
 * Validates the username regex.
 *
 * @param {string} username - the username to be checked.
 */
export function checkUsernameRegex(username) {
  if (typeof username !== 'string') {
    throw new ApolloError('Invalid username', 'INVALID_USERNAME');
  }

  const regex = /^[a-zA-Z0-9_-]{3,30}$/;

  if (!regex.test(username)) {
    throw new ApolloError('Invalid username', 'INVALID_USERNAME');
  }
}
