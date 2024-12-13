export const getUrlWithDomainName = (secondDomain: string): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    return hostname === 'localhost'
      ? `https://${secondDomain}.assen.top`
      : `https://${secondDomain}.${hostname}`
  }
  return `https://${secondDomain}.assen.top`
}
