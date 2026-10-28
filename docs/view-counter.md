# 博客访问计数

使用 Vercel 服务端接口与 Upstash Redis，替代不蒜子。页脚展示全站访问量；文章页同时展示本文阅读量。按页面访问累计 PV，刷新和再次进入页面都会计数，不代表独立访客人数。

## 云端配置

- Vercel 项目：`next-tailwind-blog`
- Upstash：`assen-blog-views`，免费方案，Singapore (`sin1`)
- 已连接 Production 环境，关闭自动升级和数据淘汰。
- 服务端读取 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`，兼容 Marketplace 注入的 `KV_REST_API_URL` / `KV_REST_API_TOKEN`。
- 凭据仅供服务端使用，不要加 `NEXT_PUBLIC_`，不要提交环境文件。

代码提交并触发正式部署后生效，历史计数不迁移。Redis 中 `blog:views:site` 与 `blog:views:page:<路径>` 长期保存；不要清空或将其设为缓存淘汰对象。

## 行为和限制

浏览器在页面访问时发送请求；服务端验证来源、已发布页面路径和请求 ID。相同请求 ID 在五分钟内只计一次，原子脚本避免并发丢数。每个 IP 每分钟最多接受 60 次请求，仅存储每日变更的 HMAC 摘要，不保存原始 IP。此机制是基础限流，并不能完全防止伪造访问。

Preview 和本地环境不访问计数数据库。加载中、超时、额度耗尽或数据库不可用时隐藏计数，文章仍可正常阅读。免费额度耗尽不会自动升级付费方案。

## 验证

- `yarn build`：生产构建、类型与代码检查。
- `node --experimental-strip-types scripts/test-view-counter.mjs`：路径、响应及接口访问规则回归检查（Node 22.17+）。
- 可选增加 `--live`：从被忽略的 `.vercel/.env.counter.local` 读取配置，使用独立随机测试键验证去重、并发、持久化和限流，随后清理测试数据，不修改正式计数。
