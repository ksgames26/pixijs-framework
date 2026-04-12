/**
 * Helper function to add dataset property to DOM-like objects
 */
export function dataset(obj: any): void {
  if (!('dataset' in obj)) {
    Object.defineProperty(obj, 'dataset', {
      writable: true,
      configurable: true,
      value: {},
    });
  }

  obj.dataset = obj.dataset || {};
}

export default dataset;
