import Image from 'next/image'

export default function CreativeCommonsLicense() {
  return (
    <p className="flex items-center gap-1">
      This work is licensed under{' '}
      <a
        href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
        target="_blank"
        rel="license noopener noreferrer"
        className="inline-flex items-center gap-1"
      >
        Creative Commons Attribution-NonCommercial 4.0 International
        <Image
          src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
          alt=""
          width={22}
          height={22}
          className="inline-block"
        />
        <Image
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
          alt=""
          width={22}
          height={22}
          className="inline-block"
        />
        <Image
          src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
          alt=""
          width={22}
          height={22}
          className="inline-block"
        />
      </a>
    </p>
  )
}