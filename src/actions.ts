import { Picture } from './types/picture.type';

// Actions pour le compteur
export type Increment = { type: 'INCREMENT' };
export type Decrement = { type: 'DECREMENT' };

// Actions pour la gestion des images
export type SelectPicture = { type: 'SELECT_PICTURE'; picture: Picture };
export type CloseModal = { type: 'CLOSE_MODAL' };

// Actions pour récupérer les images de l'API
export type FetchCatsRequest = { type: 'FETCH_CATS_REQUEST'; method: 'GET'; path: string };
export type FetchCatsCommit = { type: 'FETCH_CATS_COMMIT'; payload: Picture[] }; // Correction ici
export type FetchCatsRollback = { type: 'FETCH_CATS_ROLLBACK'; error: Error };

// Liste des actions disponibles
export type Actions =
  | Increment
  | Decrement
  | SelectPicture
  | CloseModal
  | FetchCatsRequest
  | FetchCatsCommit
  | FetchCatsRollback;

// Création des actions
export const increment = (): Increment => ({ type: 'INCREMENT' });
export const decrement = (): Decrement => ({ type: 'DECREMENT' });

export const fetchCatsRequest = (): FetchCatsRequest => ({
  type: 'FETCH_CATS_REQUEST',
  method: 'GET',
  path: 'https://pixabay.com/api/?key=YOUR_API_KEY&per_page=10&q=cat', // Remplace "YOUR_API_KEY" par ta clé API
});

export const fetchCatsCommit = (payload: Picture[]): FetchCatsCommit => ({ type: 'FETCH_CATS_COMMIT', payload });

export const fetchCatsRollback = (error: Error): FetchCatsRollback => ({ type: 'FETCH_CATS_ROLLBACK', error });

export const selectPicture = (picture: Picture): SelectPicture => ({ type: 'SELECT_PICTURE', picture });

export const closeModal = (): CloseModal => ({ type: 'CLOSE_MODAL' });
