'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPython,
  faLinux,
  faReact,
  faCss3Alt,
  faDocker,
  faDebian,
  faGithub,
  faKubernetes,
} from '@fortawesome/free-brands-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface TechIconProps {
  name: string
  className?: string
}

/**
 * Icon mapping for various tech stacks
 */
const iconMap: Record<string, IconDefinition> = {
  python: faPython,
  linux: faLinux,
  react: faReact,
  tailwind: faCss3Alt,
  docker: faDocker,
  github: faGithub,
  debian: faDebian,
  kubernetes: faKubernetes,
}

export default function TechIcon({ name, className = '' }: TechIconProps) {
  const icon = iconMap[name.toLowerCase()]

  if (!icon) {
    console.warn(`Icon not found for: ${name}`)
    return null
  }

  return (
    <FontAwesomeIcon
      icon={icon}
      className={`mr-2 inline-block h-4 w-4 align-text-bottom text-current dark:text-gray-300 ${className}`}
      aria-hidden="true"
    />
  )
}
