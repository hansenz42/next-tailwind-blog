'use client'

import Pre from 'pliny/ui/Pre'
import { isValidElement } from 'react'
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import dynamic from 'next/dynamic'

const Mermaid = dynamic(() => import('./Mermaid'), { ssr: false })

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  if (isValidElement(node)) return getTextContent((node.props as { children?: ReactNode }).children)
  return ''
}

export default function MermaidPre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const code = children as ReactElement<{ className?: string; children?: ReactNode }>
  if (code?.props?.className?.includes('language-mermaid')) {
    return <Mermaid chart={getTextContent(code.props.children)} />
  }
  return <Pre {...(props as Parameters<typeof Pre>[0])}>{children}</Pre>
}
