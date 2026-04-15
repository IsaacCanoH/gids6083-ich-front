export function blockSpace(event: KeyboardEvent): void {
  if (event.key === ' ') {
    event.preventDefault();
  }
}
