import React from 'react';
import './Modal.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import Dropdown from '../Dropdown/Dropdown';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';

const Modal = ({ mode }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <>
      <div className={`modal ${isOpen ? 'modal_open' : ''}`}>
        <motion.button
          onClick={() => setIsOpen(false)}
          className='modal__button modal__close-button'
          initial={{ x: 0, y: 0 }}
          whileHover={{ x: 0, y: 5 }}>
          <FaChevronDown style={{ color: 'var(--clr-foreground)' }} size={20} />
        </motion.button>
        <AnimatePresence>
          <motion.div
            className='modal__form'
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{}}>
            {mode === 'form' && (
              <>
                <h1 className='modal__heading'>
                  Select Your State, Fuel Up & Find the Fun!
                </h1>
                <Dropdown />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`modal__button modal__open-button ${
          isOpen ? 'modal__open-button_hidden' : ''
        }`}
        initial={{ x: 0, y: 0 }}
        whileHover={{ x: 0, y: -5 }}>
        <FaChevronUp style={{ color: 'var(--clr-foreground)' }} size={20} />
      </motion.button>
    </>
  );
};

export default Modal;
