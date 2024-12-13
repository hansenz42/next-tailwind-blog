import { getUrlWithDomainName } from '@/components/siteconfig'

const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/blog', title: 'Blog' },
  { href: '/tags', title: 'Tags' },
  { href: '/projects', title: 'Projects' },
  { href: '/about', title: 'About' },
  { href: '/feed.xml', title: 'RSS' },
  { href: getUrlWithDomainName('garden'), title: '👉🏻 知识库' },
]

export default headerNavLinks
