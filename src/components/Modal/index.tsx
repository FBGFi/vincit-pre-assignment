import React from 'react';
import './Modal.scss';

type ModalProps = {
    close: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: React.FC<ModalProps> = (props) => {
    return (
        <div className='Modal'>
            <div className="container">
                {props.children}
                <button onClick={() => props.close(true)}>Close</button>
            </div>
        </div>
    );
}

export default Modal;