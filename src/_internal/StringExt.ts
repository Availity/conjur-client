import { SupportedEncoding } from '../interfaces/index.js';

export class StringExt extends String {
  override toString(encoding: SupportedEncoding = 'utf-8') {
    const raw = this.valueOf();
    
    switch(encoding) {
      case 'ascii':
        return raw;
      case 'base64':
        return btoa(raw);
      case 'base64url':
        return btoa(raw).replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      case 'binary':
        return Array.from(raw).map(c => c.charCodeAt(0).toString(2)).join(' ');
      case 'hex':
        return Array.from(raw).map(c => c.charCodeAt(0).toString(16)).join(' ');
      case 'utf-8':
        return raw;
      case 'utf8':
        return raw;
      default:
        throw new Error(`Unsupported encoding: ${encoding}`);
    }
  }
}
