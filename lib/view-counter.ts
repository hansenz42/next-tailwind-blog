// Counts persist; only request deduplication and rate-limit keys expire.
export const countViewScript = `
local rate = redis.call('INCR', KEYS[4])
if rate == 1 then redis.call('EXPIRE', KEYS[4], 60) end
if rate > 60 then return {-1, -1} end
local fresh = redis.call('SET', KEYS[3], '1', 'NX', 'EX', 300)
if fresh then
  redis.call('INCR', KEYS[1])
  redis.call('INCR', KEYS[2])
end
return {tonumber(redis.call('GET', KEYS[1]) or '0'), tonumber(redis.call('GET', KEYS[2]) or '0')}
`

export function normalizeViewPath(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 1024 || !value.startsWith('/')) return null
  try {
    const decoded = decodeURIComponent(value).normalize('NFC')
    if (decoded.includes('//')) return null
    const path = decoded.replace(/\/+$/, '') || '/'
    // Reject control characters as well as URL delimiters.
    // eslint-disable-next-line no-control-regex
    if (/[?#\\\x00-\x20\x7f]/.test(path) || path.includes('//')) return null
    if (path.split('/').some((part) => part === '.' || part === '..')) return null
    return path
  } catch {
    return null
  }
}

export function isViewRequestId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  )
}

export function parseViewCounts(value: unknown): { site: number; page: number } | null {
  if (!Array.isArray(value) || value.length !== 2) return null
  const [site, page] = value
  if (!Number.isSafeInteger(site) || !Number.isSafeInteger(page) || site < 0 || page < 0)
    return null
  return { site, page }
}
