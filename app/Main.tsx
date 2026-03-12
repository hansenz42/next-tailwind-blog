import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Image from '@/components/Image'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { allAuthors, Authors } from 'contentlayer/generated'
import { coreContent } from 'pliny/utils/contentlayer'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)
  const avatar = author.avatar

  return (
    <>
      <div className="my-20 space-y-2 pt-6 md:space-y-5">
        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-center xl:space-y-0">
          <div className="mx-auto max-w-3xl space-y-4 text-center xl:col-span-4">
            <div className="mx-auto">
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                <Image
                  src="/static/images/avatar.png"
                  alt={mainContent.name}
                  width={92}
                  height={92}
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 dark:text-gray-100">
              I am {mainContent.name}
            </h1>
            <h2 className="prose text-lg text-gray-600 dark:text-gray-400">
              {siteMetadata.description}
            </h2>
            <h2 className="prose text-lg text-gray-600 dark:text-gray-400">
              我是一名全栈开发者。
              <br />
              目前正在开发
              <span className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                <Link href="https://www.miremoapp.com">🤔 Agentic 知识管理工具</Link>
              </span>
              <br />
              另外还有
              <span className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                <Link href="https://garden.assen.top">🗄️知识库</Link>
              </span>
              ，记录计算机、算法、AI等的思考。
            </h2>
            <h2 className="prose text-lg text-gray-600 dark:text-gray-400">
              I am a full-stack developer.
              <br />
              currently building an
              <span className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                <Link href="https://www.miremoapp.com">🤔 Agentic Knowledge Management WebApp</Link>
              </span>
              <br />I also maintain a
              <span className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                <Link href="https://garden.assen.top">🗄️ Knowledge Base</Link>
              </span>
              , where I record my thoughts on computer science, algorithms, and AI.
            </h2>
          </div>
        </div>
      </div>
      <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
