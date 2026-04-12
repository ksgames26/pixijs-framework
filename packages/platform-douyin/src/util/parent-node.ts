/**
 * Helper functions to add parentNode/parentElement/ownerDocument properties
 * to DOM-like objects based on their level in the document hierarchy
 *
 * @param obj - The object to add parent properties to
 * @param level - 0 = null parent (document), 1 = documentElement, 2+ = body or normal elements
 */

// Reference to the document object - set after injection
let _document: any = null;

export function setDocumentReference(doc: any): void {
  _document = doc;
}

export function parentNode(obj: any, level: number): void {
  if (!('parentNode' in obj)) {
    Object.defineProperty(obj, 'parentNode', {
      enumerable: true,
      get: () => {
        const doc = _document || (globalThis as any).document;
        if (level === 0) return null;
        if (level === 1) return doc?.documentElement;
        return doc?.body;
      },
    });
  }

  if (!('parentElement' in obj)) {
    Object.defineProperty(obj, 'parentElement', {
      enumerable: true,
      get: () => {
        const doc = _document || (globalThis as any).document;
        if (level === 0) return null;
        if (level === 1) return doc?.documentElement;
        return doc?.body;
      },
    });
  }

  if (!('ownerDocument' in obj)) {
    Object.defineProperty(obj, 'ownerDocument', {
      enumerable: true,
      get: () => {
        if (level === 0) return null;
        return _document || (globalThis as any).document;
      },
    });
  }
}

export default parentNode;
