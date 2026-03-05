'use client'

import { useEffect, useId, useRef } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'next-themes'

export default function Mermaid({ chart }: { chart: string }) {
  const rawId = useId()
  const id = `mermaid-${rawId.replace(/:/g, '')}`
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const definition = chart.trim()
    if (!definition || !ref.current) return

    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
    })

    // React Strict Mode runs effects twice; the first pass leaves an SVG with
    // this id in the DOM, which causes mermaid to produce an empty <g> on the
    // second pass. Remove it before each render to guarantee a clean slate.
    document.getElementById(id)?.remove()
    ref.current.innerHTML = ''

    mermaid
      .render(id, definition)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch((err) => {
        console.error('Mermaid render error:', err)
        if (ref.current)
          ref.current.innerHTML = `<pre class="text-sm text-red-500">${String(err)}</pre>`
      })
  }, [chart, id, resolvedTheme])

  return <div ref={ref} className="my-4 flex justify-center overflow-auto" />
}
