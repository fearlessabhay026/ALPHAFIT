/**
 * Page-wide film grain. Kept at a very low opacity — the job is to remove the
 * sterile digital flatness, not to make the page look dirty. Static rather
 * than animated so it costs nothing per frame.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] bg-[url('/texture.svg')] opacity-[0.22] mix-blend-soft-light"
    />
  );
}
