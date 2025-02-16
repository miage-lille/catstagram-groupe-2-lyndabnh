import { Cmd, loop } from 'redux-loop'; 
import { Actions, FetchCatsCommit, FetchCatsRollback } from './types/actions.type';
import { fetchCatsCommit, fetchCatsRequest, fetchCatsRollback } from './actions';
import { Picture } from './types/picture.type'; 


export type State = {
  counter: number;
  pictures: Picture[];
  error?: string;
  selectedPicture?: Picture | null;
  loading: boolean;
};


export const defaultState: State = {
  counter: 0, 
  pictures: [],
  selectedPicture: null,
  loading: false,
};

export const reducer = (state: State | undefined, action: Actions): State | ReturnType<typeof loop> => {
  if (!state) return defaultState; 

  switch (action.type) {
    case 'INCREMENT':
      {const newCounter = state.counter + 1;
      return loop(
        { ...state, counter: newCounter },
        Cmd.action(fetchCatsRequest(newCounter))
      );
    }
    case 'DECREMENT':{
      if (state.counter === 3) return state;
      const newCounter = state.counter - 1;
      return loop(
        { ...state, counter: newCounter },
        Cmd.action(fetchCatsRequest(newCounter))
      );
    }
    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, loading: true },
        Cmd.run(fetchPictures, {
          args: [action.path],
          successActionCreator: fetchCatsCommit,
          failActionCreator: fetchCatsRollback,
        })
      );
    
      case 'FETCH_CATS_COMMIT':
        return { ...state, loading: false, pictures: action.payload.slice(0, state.counter), };
      

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

async function fetchPictures(path: string): Promise<Picture[]> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des images');
  }
  const data = await response.json();

  
  if (!Array.isArray(data.hits)) {
    throw new Error('Invalid response format');
  }

  
  return data.hits.map((hit: any) => ({
    previewFormat: hit.previewURL,
    webFormat: hit.webformatURL,
    largeFormat: hit.largeImageURL,
    author: hit.user,
  }));
}