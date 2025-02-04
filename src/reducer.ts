import { Cmd, loop } from 'redux-loop'; // Correction ici
import { Actions, FetchCatsCommit, FetchCatsRollback } from './types/actions.type';
import { fetchCatsCommit, fetchCatsRollback } from './actions';
import { Picture } from './types/picture.type'; // Correction de l'import

// Définition du modèle (State)
export type State = {
  counter: number;
  pictures: Picture[];
  loading: boolean;
  error?: string;
  selectedPicture?: Picture | null;
};

// État initial
export const defaultState: State = {
  counter: 3, // Ne doit pas descendre sous 3
  pictures: [],
  loading: false,
  selectedPicture: null,
};

// Reducer avec gestion des actions Redux
export const reducer = (state: State | undefined, action: Actions): State | ReturnType<typeof loop> => {
  if (!state) return defaultState; // État initial

  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };

    case 'DECREMENT':
      return state.counter > 3
        ? { ...state, counter: state.counter - 1 }
        : state; // Empêche le compteur d'aller sous 3

    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, loading: true, error: undefined },
        Cmd.run(
          async (): Promise<FetchCatsCommit | FetchCatsRollback> => {
            try {
              const response = await fetch(action.path, { method: action.method });
              const data = await response.json();
              return fetchCatsCommit(data.hits as Picture[]); // Correction ici
            } catch (error) {
              return fetchCatsRollback(error as Error);
            }
          },
          {
            successActionCreator: fetchCatsCommit, // Il faut que ça retourne une action
            failActionCreator: fetchCatsRollback,
          }
        )
      );

    case 'FETCH_CATS_COMMIT':
      return { ...state, loading: false, pictures: action.payload };

    case 'FETCH_CATS_ROLLBACK':
      return { ...state, loading: false, error: action.error.message };

    case 'SELECT_PICTURE':
      return { ...state, selectedPicture: action.picture };

    case 'CLOSE_MODAL':
      return { ...state, selectedPicture: null };

    default:
      return state;
  }
};

// Sélecteurs
export const counterSelector = (state: State) => state.counter;
export const picturesSelector = (state: State) => state.pictures;
export const getSelectedPicture = (state: State) => state.selectedPicture;

export default reducer;
