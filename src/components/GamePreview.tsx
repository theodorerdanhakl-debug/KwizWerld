import type { ReactNode } from 'react'
import type { ArcadeId } from '../games/core/result'

export function GamePreview({ id }: { id: ArcadeId | string }) {
  if (id === 'sum-sprint') return <SumPreview />
  if (id === 'word-trail') return <WordPreview />
  if (id === 'map-hop') return <MapPreview />
  if (id === 'lab-notes') return <LabPreview />
  if (id === 'time-post') return <TimePreview />
  return <SumPreview />
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg className="game-preview-svg" viewBox="0 0 320 160" aria-hidden="true">
      {children}
    </svg>
  )
}

function SumPreview() {
  return (
    <Frame>
      <rect className="preview-piece" x="34" y="52" width="72" height="56" rx="16" />
      <rect className="preview-piece preview-lead preview-delay" x="124" y="34" width="72" height="92" rx="16" />
      <rect className="preview-piece preview-delay-2" x="214" y="52" width="72" height="56" rx="16" />
    </Frame>
  )
}

function WordPreview() {
  return (
    <Frame>
      <circle className="preview-piece" cx="58" cy="80" r="26" />
      <circle className="preview-piece preview-lead preview-delay" cx="126" cy="80" r="26" />
      <circle className="preview-piece preview-delay-2" cx="194" cy="80" r="26" />
      <circle className="preview-piece preview-delay-3" cx="262" cy="80" r="26" />
    </Frame>
  )
}

function MapPreview() {
  return (
    <Frame>
      <circle className="preview-piece preview-lead" cx="160" cy="36" r="16" />
      <circle className="preview-piece preview-delay" cx="96" cy="108" r="16" />
      <circle className="preview-piece preview-delay-2" cx="224" cy="108" r="16" />
      <path className="preview-line" d="M160 52 L104 96 M160 52 L216 96 M112 108 L208 108" />
    </Frame>
  )
}

function LabPreview() {
  return (
    <Frame>
      <circle className="preview-piece" cx="160" cy="80" r="46" />
      <circle className="preview-piece preview-lead preview-delay" cx="176" cy="68" r="14" />
      <circle className="preview-piece preview-delay-2" cx="142" cy="96" r="8" />
    </Frame>
  )
}

function TimePreview() {
  return (
    <Frame>
      <rect className="preview-piece preview-lead" x="108" y="36" width="36" height="96" rx="12" />
      <rect className="preview-piece preview-grow preview-delay" x="176" y="68" width="36" height="64" rx="12" />
    </Frame>
  )
}
