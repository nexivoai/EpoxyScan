interface RetryOptions {
  attempts: number
  shouldRetry?: (error: unknown) => boolean
  delayMs?: (attempt: number) => number
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt >= options.attempts) break
      if (options.shouldRetry && !options.shouldRetry(error)) break
      if (options.delayMs) await sleep(options.delayMs(attempt))
    }
  }

  throw lastError
}
