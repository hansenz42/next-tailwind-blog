import {
  faCode,
  faPython,
  faDatabase,
  faLinux,
  faReact,
  faCss3Alt,
  faDocker,
} from '@fortawesome/free-brands-svg-icons'
import { faTerminal } from '@fortawesome/free-solid-svg-icons'
import type { TechStackItem } from '@/components/TechStack'

/**
 * Tech stack items with icons
 * Matches the items in data/authors/default.mdx
 */
export const defaultTechStack: TechStackItem[] = [
  {
    name: 'VSCode - Github Copilot',
    icon: faCode,
  },
  {
    name: 'Python - FastAPI',
    icon: faPython,
  },
  {
    name: 'PostgreSQL',
    icon: faDatabase,
  },
  {
    name: 'Linux - Debian',
    icon: faLinux,
  },
  {
    name: 'React - Next.js',
    icon: faReact,
  },
  {
    name: 'Tailwind CSS',
    icon: faCss3Alt,
  },
  {
    name: 'Docker - Kubernetes',
    icon: faDocker,
  },
]
