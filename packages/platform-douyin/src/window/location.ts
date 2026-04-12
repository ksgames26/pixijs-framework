/**
 * Location object
 * Provides browser-like location interface
 */

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
    // No-op in mini-game environment
  },

  replace(href: string): void {
    this.href = href;
  },

  assign(url: string): void {
    this.href = url;
  },

  toString(): string {
    return this.href;
  },
} as Location;

export default location;
