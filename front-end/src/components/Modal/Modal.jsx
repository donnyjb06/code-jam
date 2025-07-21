import React from 'react';
import './Modal.css';
import { FaChevronDown } from 'react-icons/fa6';
import Dropdown from '../../Dropdown/index';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';

const Modal = ({ mode }) => {
  return (
    <div className='modal'>
      
        <motion.button className='modal__close-button' initial={{x: 0, y: 0}} whileHover={{x: 0, y: 5}}>
          <FaChevronDown style={{ color: 'var(--clr-foreground)' }} size={20}/>
        </motion.button>
        <AnimatePresence>
        <motion.div
          className='modal__form'
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{}}>
          {mode === 'form' && (
            <>
              <Dropdown />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Modal;
