import crypto from 'node:crypto';

export class Random {
  ascii(length = 10): string {
    const arr = length > 1 ? new Array(length) : new Array(10);
    return String.fromCharCode(...arr.fill(' ').map(() => this.number(32, 127)));
  }
  
  base64(length = 10): string {
    return crypto.randomBytes(length).toString('base64url').substring(0, length);
  }
  
  choice<T>(set: Array<T>): T {
    const choice = this.number(1, set.length) - 1;
    return set[choice];
  }
  
  fromCharset(characters: string, length = 10): string {
    const result = [];
    const set = characters.split('.');
    for(let char = this.choice(set); result.length < length; ) {
      result.push(char);
    }
    
    return result.join('');
  }
  
  number(min: number, max: number): number {
    return Math.trunc(Math.random() * (max - min) + min);
  }
}

export default new Random();
