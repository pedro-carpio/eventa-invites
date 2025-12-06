import { Include } from './includes/includes';

export interface Event {
  title: string;
  templateTitles: string[];
  includes: Include[];
}
