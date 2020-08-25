import React from 'react';
import styled from 'styled-components';
import { Portal } from '../../utilities';

const Modal = ({ children, toggle, on }) => {
  return (
    <Portal>
      {on && (
        <ModalWrapper>
          <ModalCard>
            <div>{children}</div>
          </ModalCard>
          <Background onClick={toggle} />
        </ModalWrapper>
      )}
    </Portal>
  );
}

export default Modal;

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.div`
  max-width: 500px;
  min-width: 320px;
  z-index: 15;
  padding: 15px;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
`;