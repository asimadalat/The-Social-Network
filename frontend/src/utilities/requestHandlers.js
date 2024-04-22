/**
 * Verify HTTP status code, resolving or rejecting based on value
 * @param {object} response - the Response() object to process
 */
export function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return new Promise((resolve, reject) => {
        return reject(response);
      });
    }
}

/**
 * Extract response body
 * @param {object} response - the Response() object to process
 */
export function json(response) {
  return response.json();
}
