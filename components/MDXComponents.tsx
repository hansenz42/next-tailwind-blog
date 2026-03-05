import TOCInline from 'pliny/ui/TOCInline'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import MermaidPre from './MermaidPre'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: MermaidPre,
  table: TableWrapper,
  BlogNewsletterForm,
}
