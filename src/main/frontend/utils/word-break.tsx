import { Fragment, ReactNode } from "react";

// Combining marks belong to the character they follow, so an accent is never
// mistaken for a separator and split off its base letter.
const separators = /([^\p{L}\p{N}\p{M}\s]+)/u;

/**
 * Lets a name like `org.team.app` wrap, which browsers otherwise treat as one
 * unbreakable word because they only break at spaces and hyphens.
 */
export function withWordBreaks(text: string): ReactNode[] {
  // Splitting on a capturing group keeps the separators, at every odd index.
  // `<wbr/>` adds nothing to textContent, so the name stays one string.
  return text.split(separators).map((part, index) =>
    index % 2 === 0 ? (
      part
    ) : (
      <Fragment key={index}>
        {part}
        <wbr />
      </Fragment>
    ),
  );
}
