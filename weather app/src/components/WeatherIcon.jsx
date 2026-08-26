import { iconKind } from '../utils/weatherTheme'

function SvgWrap({ children, className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function WeatherIcon({ weather, className = 'h-16 w-16' }) {
  const kind = iconKind(weather)

  if (kind === 'clear-day') {
    return (
      <SvgWrap className={className}>
        <circle cx="32" cy="32" r="12" fill="#FBBF24" />
        <g stroke="#FDE68A" strokeWidth="3" strokeLinecap="round">
          <path d="M32 8v6M32 50v6M8 32h6M50 32h6M14 14l4 4M46 46l4 4M14 50l4-4M46 18l4-4" />
        </g>
      </SvgWrap>
    )
  }

  if (kind === 'clear-night') {
    return (
      <SvgWrap className={className}>
        <path d="M38 14a18 18 0 1 0 12 28A16 16 0 0 1 38 14Z" fill="#E2E8F0" />
        <circle cx="46" cy="18" r="1.6" fill="#FDE68A" />
        <circle cx="52" cy="28" r="1.2" fill="#FDE68A" />
      </SvgWrap>
    )
  }

  if (kind === 'partly-day') {
    return (
      <SvgWrap className={className}>
        <circle cx="24" cy="22" r="9" fill="#FBBF24" />
        <path
          d="M22 44h22a10 10 0 0 0 1-20 13 13 0 0 0-25 4A8 8 0 0 0 22 44Z"
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
      </SvgWrap>
    )
  }

  if (kind === 'partly-night') {
    return (
      <SvgWrap className={className}>
        <path d="M28 16a12 12 0 1 0 8 18A11 11 0 0 1 28 16Z" fill="#E2E8F0" />
        <path
          d="M22 46h22a10 10 0 0 0 1-20 13 13 0 0 0-25 4A8 8 0 0 0 22 46Z"
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
      </SvgWrap>
    )
  }

  if (kind === 'rain' || kind === 'drizzle') {
    return (
      <SvgWrap className={className}>
        <path
          d="M20 36h24a10 10 0 0 0 1-20 13 13 0 0 0-25 4A8 8 0 0 0 20 36Z"
          fill="#E2E8F0"
        />
        <g stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round">
          <path d="M24 42v8M32 44v8M40 42v8" />
        </g>
      </SvgWrap>
    )
  }

  if (kind === 'thunder') {
    return (
      <SvgWrap className={className}>
        <path
          d="M20 34h24a10 10 0 0 0 1-20 13 13 0 0 0-25 4A8 8 0 0 0 20 34Z"
          fill="#CBD5E1"
        />
        <path d="M30 34l-4 12h6l-2 10 12-14h-7l5-8H30Z" fill="#FBBF24" />
      </SvgWrap>
    )
  }

  if (kind === 'snow') {
    return (
      <SvgWrap className={className}>
        <path
          d="M20 34h24a10 10 0 0 0 1-20 13 13 0 0 0-25 4A8 8 0 0 0 20 34Z"
          fill="#F8FAFC"
        />
        <g fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1.4">
          <circle cx="24" cy="44" r="2.2" />
          <circle cx="32" cy="48" r="2.2" />
          <circle cx="40" cy="44" r="2.2" />
        </g>
      </SvgWrap>
    )
  }

  if (kind === 'mist') {
    return (
      <SvgWrap className={className}>
        <g stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round">
          <path d="M14 24h36M12 32h40M16 40h32" />
        </g>
      </SvgWrap>
    )
  }

  return (
    <SvgWrap className={className}>
      <path
        d="M18 40h28a11 11 0 0 0 1.2-22 15 15 0 0 0-29 5A9 9 0 0 0 18 40Z"
        fill="#F1F5F9"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      <path
        d="M28 22a12 12 0 0 1 16 10"
        stroke="#94A3B8"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </SvgWrap>
  )
}
