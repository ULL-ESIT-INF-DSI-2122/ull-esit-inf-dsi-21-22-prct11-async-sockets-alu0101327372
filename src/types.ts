import {Color} from './app/Color';

/**
 * Type that represents the elements that a request message must include.
 */
export type RequestType = {
  type: 'add' | 'modify' | 'remove' | 'list' | 'read';
  usuario: string;
  titulo?: string;
  cuerpo?: string;
  color?: Color;
}

/**
* Type that represents the elements that a response message should include.
*/
export type ResponseType = {
  type: 'add' | 'modify' | 'remove' | 'read' | 'list';
  success: boolean;
  notes?: string;
}
