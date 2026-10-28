// Run: node --experimental-strip-types scripts/test-view-counter.mjs
// Optional isolated live Redis check: add --live (requires .vercel/.env.counter.local).
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { Redis } from '@upstash/redis'
import {
  countViewScript,
  normalizeViewPath,
  isViewRequestId,
  parseViewCounts,
} from '../lib/view-counter.ts'

assert.equal(normalizeViewPath('/blog/example/'), '/blog/example')
assert.equal(normalizeViewPath('/tags/%E7%AC%94%E8%AE%B0/'), '/tags/笔记')
for (const path of [
  '//',
  '/blog//bad',
  '/%2e%2e/x',
  '/x?y',
  '/x%00',
  '/%zz',
  'https://example.com',
]) {
  assert.equal(normalizeViewPath(path), null)
}
assert.equal(isViewRequestId(randomUUID()), true)
assert.equal(isViewRequestId('bad'), false)
assert.deepEqual(parseViewCounts([20, 3]), { site: 20, page: 3 })
for (const value of [[-1, -1], [NaN, 0], ['2', 1], [1], [Infinity, 0]]) {
  assert.equal(parseViewCounts(value), null)
}
console.log('Path and response validation passed')

// Exercise request guards without contacting Redis.
const { build } = await import('esbuild')
const bundle = await build({
  entryPoints: ['app/api/views/route.ts'],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  plugins: [
    {
      name: 'counter-fixtures',
      setup(builder) {
        builder.onResolve(
          { filter: /^(contentlayer\/generated|@\/data\/siteMetadata|@upstash\/redis)$/ },
          (args) => ({ path: args.path, namespace: 'fixture' })
        )
        builder.onLoad({ filter: /.*/, namespace: 'fixture' }, (args) => ({
          contents:
            args.path === 'contentlayer/generated'
              ? 'export const allBlogs = [{slug:"example",tags:[],draft:false},{slug:"draft",tags:[],draft:true}]'
              : args.path === '@/data/siteMetadata'
                ? 'export default {siteUrl:"https://www.assen.top"}'
                : 'export class Redis { async eval() { return [7,2] } }',
        }))
      },
    },
  ],
})
const { POST } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
)
const savedEnv = { ...process.env }
const request = (body, headers = {}) =>
  new Request('https://www.assen.top/api/views', {
    method: 'POST',
    headers: { origin: 'https://www.assen.top', 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
try {
  process.env.VERCEL_ENV = 'preview'
  assert.equal((await POST(request({}))).status, 204)
  process.env.VERCEL_ENV = 'production'
  process.env.UPSTASH_REDIS_REST_URL = 'https://fixture.invalid'
  process.env.UPSTASH_REDIS_REST_TOKEN = 'fixture-token'
  const valid = { path: '/blog/example/', requestId: randomUUID() }
  assert.equal((await POST(request(valid, { origin: 'https://other.invalid' }))).status, 403)
  assert.equal((await POST(request(valid, { 'content-type': 'text/plain' }))).status, 415)
  assert.equal((await POST(request({ ...valid, path: '/blog/draft' }))).status, 400)
  assert.equal((await POST(request({ ...valid, requestId: 'invalid' }))).status, 400)
  assert.deepEqual(await (await POST(request(valid))).json(), { site: 7, page: 2 })
  console.log('API: preview isolation, origin, payload and published-page guards passed')
} finally {
  for (const name of Object.keys(process.env)) if (!(name in savedEnv)) delete process.env[name]
  Object.assign(process.env, savedEnv)
}

if (process.argv.includes('--live')) {
  process.loadEnvFile('.vercel/.env.counter.local')
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  })
  const prefix = `test:views:${randomUUID()}`
  const keys = new Set()
  const key = (name) => {
    const value = `${prefix}:${name}`
    keys.add(value)
    return value
  }
  const site = key('site'),
    page = key('page'),
    rate = key('rate'),
    event = key('event')
  const count = (eventKey) => redis.eval(countViewScript, [site, page, eventKey, rate], [])
  try {
    assert.deepEqual(await count(event), [1, 1])
    assert.deepEqual(await count(event), [1, 1])
    await Promise.all(Array.from({ length: 8 }, (_, i) => count(key(`event-${i}`))))
    assert.equal(await redis.get(site), 9)
    assert.equal(await redis.get(page), 9)
    assert.equal(await redis.ttl(site), -1)
    assert.ok((await redis.ttl(event)) > 0)
    await redis.set(rate, 60, { ex: 60 })
    assert.deepEqual(await count(key('blocked')), [-1, -1])
    assert.equal(await redis.get(site), 9)
    console.log('Live Redis: deduplication, concurrency, persistence and rate limit passed')
  } finally {
    await redis.del(...keys)
    console.log('Isolated test keys removed; production counters untouched')
  }
}
