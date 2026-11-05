'use client'

import { usePathname } from 'next/navigation'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from './Header'
import Footer from './Footer'
import SectionContainer from './SectionContainer'
import siteMetadata from '@/data/siteMetadata'

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <main>{children}</main>
  return (
    <SectionContainer>
      <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
        <Header />
        <main className="mb-auto">{children}</main>
      </SearchProvider>
      <Footer />
    </SectionContainer>
  )
}
