import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import SocialTooltip from '@/components/social-icons/tooltip'
import Image from '@/components/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

export default async function Footer() {
  // const homeView= await kv.get<number>('home_view')
  // const pageView = await kv.get<number>('page_view')

  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="zhihu" href={siteMetadata.zhihu} size={6} />
          <SocialIcon kind="wechat" href={siteMetadata.wechat} size={6} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
          <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
          <SocialIcon kind="x" href={siteMetadata.x} size={6} />
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} />
          <SocialIcon kind="threads" href={siteMetadata.threads} size={6} />
          <SocialTooltip kind="wechat" image={siteMetadata.wechat_qr} href={undefined} size={6} />
          <SocialIcon kind="jianshu" href={siteMetadata.jianshu} size={6}></SocialIcon>
          <SocialIcon kind="xiaohongshu" href={siteMetadata.xiaohongshu} size={6}></SocialIcon>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <Link href="https://beian.miit.gov.cn/">浙ICP备2023051173号-2</Link>
          </div>
          <div>{` • `}</div>
          <div>
            <Image src="/static/images/beian_icon.png" width={16} height={16} alt="beian"></Image>
          </div>
          <div>
            <Link href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010202004742">
              浙公网安备33010202004742号
            </Link>
          </div>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div
            className="flex"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faEye} size="1x" style={{ height: '1em', width: '1em' }} />
          </div>
          <span id="busuanzi_container_site_pv">
            <span id="busuanzi_value_site_pv"></span>
          </span>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">
            Tailwind Nextjs Theme
          </Link>
        </div>
      </div>
    </footer>
  )
}
