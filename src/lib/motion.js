// Returns 'auto' when the visitor's OS asks for reduced motion, 'smooth' otherwise.
// Use as the `behavior` option for scrollIntoView/scrollTo so our handful of
// programmatic scrolls respect prefers-reduced-motion (CSS scroll-behavior does
// not override an explicit JS 'smooth' option, so this has to be checked in JS).
export function scrollBehavior() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  } catch {
    return 'smooth';
  }
}
