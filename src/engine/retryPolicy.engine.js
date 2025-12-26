const MAX_RETRIES = 3;

class RetryPolicy {
  static canRetry(currentRetries) {
    return currentRetries < MAX_RETRIES;
  }
}

module.exports = RetryPolicy;
