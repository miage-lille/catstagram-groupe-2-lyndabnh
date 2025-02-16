import { Cmd, loop } from 'redux-loop'; // Correction ici
import { Actions, FetchCatsCommit, FetchCatsRollback } from './types/actions.type';
import { fetchCatsCommit, fetchCatsRollback } from './actions';
import { Picture } from './types/picture.type'; // Correction de l'import
import fakePictures from './fake-datas.json'; 


export type State = {
  counter: number;
  pictures: Picture[];
  error?: string;
  selectedPicture?: Picture | null;
};


export const defaultState: State = {
  counter: 3, 
  pictures: fakePictures.slice(0, 3),
};

export const reducer = (state: State | undefined, action: Actions): State | ReturnType<typeof loop> => {
  if (!state) return defaultState; 

  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        counter: state.counter + 1,
        pictures: fakePictures.slice(0, state.counter + 1),
      };
    case 'DECREMENT':
      return state.counter > 3
      ? {
        ...state,
        counter: state.counter - 1,
        pictures: fakePictures.slice(0, state.counter - 1), // Mettre à jour les images en fonction du compteur
      }
    : state;

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
