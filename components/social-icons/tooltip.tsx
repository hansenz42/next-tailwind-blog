import {
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  X,
  Mastodon,
  Threads,
  Instagram,
  Zhihu,
  Wechat,
  Xiaohongshu,
} from './icons'
import Image from '@/components/Image'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
  zhihu: Zhihu,
  wechat: Wechat,
  xiaohongshu: Xiaohongshu,
}

type SocialIconProps = {
  kind: keyof typeof components
  image: string | undefined
  href: string | undefined
  size?: number
}

const SocialTooltip = ({ kind, image, href, size = 8 }: SocialIconProps) => {
  if (!image) return null

  const SocialSvg = components[kind]

  return (
    <div className="has-tooltip">
      <a
        className="text-sm text-gray-500 transition hover:text-gray-600"
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        <span className="tooltip -ml-[300px] -mt-[250px] rounded bg-gray-100 p-1 text-red-500 shadow-lg dark:bg-gray-950 dark:text-gray-200">
          <Image src={image} alt={kind} width={600} height={225} />
        </span>
        <span className="sr-only">{kind}</span>
        <SocialSvg
          className={`fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 h-${size} w-${size}`}
        />
      </a>
    </div>
  )
}

export default SocialTooltip
