import { Include } from './includes/includes';
import { template } from './templates/templates';

export interface Event {
  title: string;
  type: string;
  templates: template[];
  includes: Include[];
}
