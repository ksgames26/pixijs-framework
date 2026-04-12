/**
 * Helper function to add classList stub to DOM-like objects
 * Provides basic DOMTokenList-like interface
 */
import { noop } from './noop';

export function classList(obj: any): void {
  const stubClassList = {
    length: 0,
    value: '',
    add: noop,
    remove: noop,
    contains: (): boolean => false,
    toggle: (): boolean => false,
    item: (): string | null => null,
    replace: (): boolean => false,
    forEach: noop,
    entries: function* (): Generator<[number, string]> {},
    keys: function* (): Generator<number> {},
    values: function* (): Generator<string> {},
    [Symbol.iterator]: function* (): Generator<string> {},
  };

  obj.classList = stubClassList;
}

export default classList;
