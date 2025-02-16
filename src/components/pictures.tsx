import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { picturesSelector, getSelectedPicture, State } from '../reducer';
import ModalPortal from './modal';
import { closeModal, selectPicture } from '../actions';

const Container = styled.div`
  padding: 1rem;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 1s;
  max-width: fit-content;
  &:hover {
    transform: scale(1.2);
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 10px;
`;

const Pictures = () => {
  const pictures = useSelector(picturesSelector);
  const selectedPicture = useSelector(getSelectedPicture);
  const dispatch = useDispatch();
  const error = useSelector((state: State) => state.error);
  const loading = useSelector((state: State) => state.loading);

  if (loading) {
    return <div>Chargement des images...</div>;
  }

  if (error) {
    return <ErrorMessage>Erreur : {error}</ErrorMessage>;
  }
  return (
    <Container>
      {pictures.map((picture, index) => (
        <Image 
        key={index} 
        src={picture.previewFormat} 
        alt={`Cat ${index}`}
        onClick={() => dispatch(selectPicture(picture))} 
        />

      ))}
       {selectedPicture && (
        <ModalPortal
          largeFormat={selectedPicture.largeFormat}
          close={() => dispatch(closeModal())}
        />
      )}
    </Container>
  );
};

export default Pictures;
