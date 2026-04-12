export const location: Location = {
  href: 'game.js',
  protocol: 'file:',
  host: '',
  hostname: '',
  port: '',
  pathname: '/game.js',
  search: '',
  hash: '',

  reload(): void {
    // No-op in mini-game environment (matches official adapter)
  },

  replace(href: string): void {
    (location as any).href = href;
  },

  assign(url: string): void {
    (location as any).href = url;
  },

  toString(): string {
    return (location as any).href;
  },
} as Location;

export default location;
