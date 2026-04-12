import { HTMLElement } from './HTMLElement';

/**
 * DocumentElement class
 * Represents the document.documentElement (root html element)
 */
export class DocumentElement extends HTMLElement {
  constructor() {
    super('html', 0);
  }
}

export default DocumentElement;
