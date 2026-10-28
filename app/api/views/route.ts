import { createHmac } from 'node:crypto'
import { Redis } from '@upstash/redis'
import { allBlogs } from 'contentlayer/generated'
import GithubSlugger from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import {
  countViewScript,
  isViewRequestId,
  normalizeViewPath,
  parseViewCounts,
} from '../../../lib/view-counter'

export const runtime = 'nodejs'
export const preferredRegion = 'sin1'
export const dynamic = 'force-dynamic'

const published = allBlogs.filter((post) => !post.draft)
const allowedPaths = new Set(['/', '/blog', '/tags', '/about', '/projects'])
for (const post of published) {
  const path = normalizeViewPath(`/blog/${post.slug}`)
  if (path) allowedPaths.add(path)
  for (const tag of post.tags || []) allowedPaths.add(`/tags/${new GithubSlugger().slug(tag)}`)
}

function isAllowedPath(path: string): boolean {
  if (allowedPaths.has(path)) return true
  const match = path.match(/^(\/blog|\/tags\/[^/]+)\/page\/(\d+)$/)
  return (
    !!match &&
    allowedPaths.has(match[1]) &&
    Number(match[2]) > 0 &&
    Number(match[2]) <= published.length
  )
}

function reply(body: object, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  // Preview and local development must not alter production counts.
  if (process.env.VERCEL_ENV !== 'production') return new Response(null, { status: 204 })
  const origin = new URL(siteMetadata.siteUrl).origin
  if (
    request.headers.get('origin') !== origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  ) {
    return reply({ error: 'Forbidden' }, 403)
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return reply({ error: 'Expected JSON' }, 415)
  }
  if (Number(request.headers.get('content-length')) > 2048)
    return reply({ error: 'Too large' }, 413)

  let body: { path?: unknown; requestId?: unknown }
  try {
    const raw = await request.text()
    if (raw.length > 2048) return reply({ error: 'Too large' }, 413)
    body = JSON.parse(raw)
  } catch {
    return reply({ error: 'Invalid request' }, 400)
  }
  const path = normalizeViewPath(body?.path)
  if (!path || !isAllowedPath(path) || !isViewRequestId(body?.requestId)) {
    return reply({ error: 'Invalid page or request ID' }, 400)
  }
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return reply({ error: 'Counter unavailable' }, 503)

  // Vercel supplies this header. Store only a daily HMAC, never the visitor's raw IP.
  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const fingerprint = createHmac('sha256', token)
    .update(`${new Date().toISOString().slice(0, 10)}:${ip}`)
    .digest('hex')
  try {
    const redis = new Redis({ url, token, retry: false, signal: () => AbortSignal.timeout(4000) })
    const result = await redis.eval(
      countViewScript,
      [
        'blog:views:site',
        `blog:views:page:${path}`,
        `blog:views:event:${body.requestId}`,
        `blog:views:rate:${fingerprint}`,
      ],
      []
    )
    if (Array.isArray(result) && result[0] === -1) {
      return reply({ error: 'Too many requests' }, 429)
    }
    const counts = parseViewCounts(result)
    if (!counts) return reply({ error: 'Counter unavailable' }, 503)
    return reply(counts)
  } catch {
    // Do not log credentials or replace a failed read with a misleading zero.
    return reply({ error: 'Counter unavailable' }, 503)
  }
}
