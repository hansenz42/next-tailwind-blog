import Image from 'next/image'

export default function CreativeCommonsLicense() {
  return (
    <p>
      This work is licensed under{' '}
      <a
        href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
        target="_blank"
        rel="license noopener noreferrer"
        style={{ display: 'inline-block' }}
      >
        Creative Commons Attribution-NonCommercial 4.0 International
        <Image
          src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
          alt=""
          width={22}
          height={22}
          style={{ marginLeft: '3px', verticalAlign: 'text-bottom' }}
        />
        <Image
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
          alt=""
          width={22}
          height={22}
          style={{ marginLeft: '3px', verticalAlign: 'text-bottom' }}
        />
        <Image
          src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
          alt=""
          width={22}
          height={22}
          style={{ marginLeft: '3px', verticalAlign: 'text-bottom' }}
        />
      </a>
    </p>
  )
}