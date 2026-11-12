import type { SubjectId } from '../data/content'

export type SubjectSceneProps = {
  id: SubjectId
}

export function SubjectScene({ id }: SubjectSceneProps) {
  return (
    <div className="door-scene" aria-hidden="true">
      <span className="door-glow" />
      <svg className="door-scene-art" viewBox="0 0 120 180">
        {id === 'math' ? (
          <>
            <circle cx="78" cy="48" r="10" />
            <rect x="28" y="96" width="22" height="22" />
            <path d="M62 118h28M76 104v28" />
          </>
        ) : null}
        {id === 'english' ? (
          <>
            <path d="M24 78h32v46H24zM64 78h32v46H64z" />
            <path d="M56 78v46" />
          </>
        ) : null}
        {id === 'geography' ? (
          <>
            <circle cx="86" cy="42" r="8" />
            <path d="M14 132 42 86l22 28 16-18 26 36H14z" />
          </>
        ) : null}
        {id === 'science' ? (
          <>
            <ellipse cx="60" cy="96" rx="36" ry="14" />
            <circle cx="60" cy="96" r="6" />
            <circle cx="90" cy="88" r="4" />
          </>
        ) : null}
        {id === 'history' ? (
          <>
            <path d="M34 140V78M86 140V78M34 78h52" />
            <path d="M38 78c0-22 44-22 44 0" />
          </>
        ) : null}
      </svg>
    </div>
  )
}
