/**
 * URL class with createObjectURL support
 */

const urlStore = new Map<string, Blob>();

export class URL {
  public href: string;
  public protocol: string;
  public host: string;
  public pathname: string;
  public search: string;
  public hash: string;
  public readonly searchParams: URLSearchParams;

  constructor(url: string | URL, base?: string | URL) {
    const parsed = this._parseURL(url.toString(), base?.toString());
    this.href = parsed.href;
    this.protocol = parsed.protocol;
    this.host = parsed.host;
    this.pathname = parsed.pathname;
    this.search = parsed.search;
    this.hash = parsed.hash;
    this.searchParams = new URLSearchParams(parsed.search);
  }

  static createObjectURL(obj: Blob): string {
    if (obj instanceof Blob) {
      const url = `blob:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      urlStore.set(url, obj);
      return url;
    }
    return '';
  }

  static revokeObjectURL(url: string): void {
    if (urlStore.has(url)) {
      urlStore.delete(url);
    }
  }

  private _parseURL(url: string, _base?: string): {
    href: string;
    protocol: string;
    host: string;
    pathname: string;
    search: string;
    hash: string;
  } {
    // Simple URL parsing - in production, use a proper URL parser
    const protocolMatch = url.match(/^([^:]+):\/\//);
    const protocol = protocolMatch ? protocolMatch[1] : '';

    const rest = protocolMatch ? url.slice(protocolMatch[0].length) : url;
    const hashIndex = rest.indexOf('#');
    const hash = hashIndex > -1 ? rest.slice(hashIndex) : '';
    const withoutHash = hashIndex > -1 ? rest.slice(0, hashIndex) : rest;

    const searchIndex = withoutHash.indexOf('?');
    const search = searchIndex > -1 ? withoutHash.slice(searchIndex) : '';
    const pathname = searchIndex > -1 ? withoutHash.slice(0, searchIndex) : withoutHash;

    const hostMatch = pathname.match(/^([^\/]+)/);
    const host = hostMatch ? hostMatch[1] : '';

    return {
      href: url,
      protocol: protocol ? `${protocol}:` : '',
      host,
      pathname: host ? pathname.slice(host.length) : pathname,
      search,
      hash,
    };
  }

  toString(): string {
    return this.href;
  }

  toJSON(): string {
    return this.href;
  }
}

export default URL;
