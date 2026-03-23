import TOCInline from 'pliny/ui/TOCInline'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import MermaidPre from './MermaidPre'
import TechIcon from './TechIcon'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: MermaidPre,
  table: TableWrapper,
  BlogNewsletterForm,
  TechIcon: TechIcon,
}
