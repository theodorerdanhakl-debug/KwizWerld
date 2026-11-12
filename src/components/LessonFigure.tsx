export type LessonFigureProps = {
  name: string
}

export function LessonFigure({ name }: LessonFigureProps) {
  return (
    <svg className="lesson-figure" viewBox="0 0 160 72" aria-hidden="true">
      {name === 'fraction-bars' ? (
        <>
          <rect x="8" y="16" width="28" height="40" />
          <rect x="44" y="16" width="28" height="40" />
          <rect x="80" y="16" width="28" height="40" className="lesson-figure-fill" />
          <rect x="116" y="16" width="28" height="40" className="lesson-figure-fill" />
        </>
      ) : null}
      {name === 'plus-blocks' ? (
        <>
          <rect x="16" y="20" width="24" height="24" className="lesson-figure-fill" />
          <rect x="46" y="20" width="24" height="24" className="lesson-figure-fill" />
          <path d="M86 32h16M118 20v24M106 32h24" />
        </>
      ) : null}
      {name === 'poem' ? (
        <path d="M28 18h70M40 34h80M28 50h60" />
      ) : null}
      {name === 'paragraph' ? (
        <path d="M20 16h120M20 30h120M20 44h90M20 58h70" />
      ) : null}
      {name === 'neighborhood' ? (
        <>
          <path d="M16 50h128M40 50V28h24v22M96 50V22h28v28" />
          <circle cx="78" cy="24" r="6" />
        </>
      ) : null}
      {name === 'states' ? (
        <>
          <rect x="18" y="16" width="36" height="24" />
          <rect x="58" y="16" width="36" height="24" />
          <rect x="98" y="16" width="40" height="24" />
          <rect x="30" y="44" width="48" height="16" />
          <rect x="82" y="44" width="44" height="16" />
        </>
      ) : null}
      {name === 'senses' ? (
        <>
          <path d="M16 36s14-14 32-14 32 14 32 14-14 14-32 14-32-14-32-14z" />
          <circle cx="48" cy="36" r="6" />
          <path d="M112 24v24M100 30h24M104 48h16" />
        </>
      ) : null}
      {name === 'cell' ? (
        <>
          <ellipse cx="80" cy="36" rx="58" ry="24" />
          <circle cx="80" cy="36" r="10" className="lesson-figure-fill" />
        </>
      ) : null}
      {name === 'columns' ? (
        <path d="M36 58V24M80 58V24M124 58V24M36 24h88M42 24c0-12 76-12 76 0" />
      ) : null}
      {name === 'flag' ? (
        <path d="M36 14v46M36 16h78l-14 12 14 12H36" />
      ) : null}
    </svg>
  )
}
