/**
 * Where a confirmed session lands (design Screen 5's "Go to today's prompt"
 * CTA). The daily-prompt screen itself belongs to a separate epic (RE-03);
 * this only decides the route, not the screen.
 */
export function postAuthRoute(): string {
  return "/today";
}
