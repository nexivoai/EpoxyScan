export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { parseServerEnv } = await import('@/lib/config/env')
    parseServerEnv(process.env)
  }
}
