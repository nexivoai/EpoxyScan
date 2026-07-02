type LogData = Record<string, unknown>

export function createLogger(scope: string) {
  return {
    info(message: string, data?: LogData) {
      console.log(JSON.stringify({ level: 'info', scope, message, ...data }))
    },
    error(message: string, data?: LogData) {
      console.error(JSON.stringify({ level: 'error', scope, message, ...data }))
    },
  }
}
