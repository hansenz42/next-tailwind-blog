export const getGardenUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    return hostname === 'localhost' ? 'https://garden.assen.top' : `https://garden.${hostname}`
  }
  return 'https://garden.assen.top'
}
