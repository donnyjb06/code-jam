import { useState } from 'react';
import './Modal.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import Dropdown from '../Dropdown/Dropdown';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { US_STATE_CODES } from '../../utils/constants';
import useRoute from '../../hooks/useRoute';
import Button from '../Button/Button';

const Modal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const {
    selectedState,
    amountOfLocations,
    handleStateChange,
    handleAmountChange,
    handleGenerateRoute,
    topNLocations,
    currentLocation,
    handleCurrentLocationChange
  } = useRoute();

  const [mode, setMode] = useState('form');

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
                <div className='modal__inputs'>
                  <Dropdown
                    selected={selectedState}
                    onChange={handleStateChange}
                    defaultSelected='Choose a state'
                    content={Object.entries(US_STATE_CODES).map(
                      ([code, state]) => {
                        return (
                          <option
                            value={code}
                            key={code}
                            className='select__option'>
                            {state}
                          </option>
                        );
                      },
                    )}
                  />
                  <Dropdown
                    selected={amountOfLocations}
                    onChange={handleAmountChange}
                    defaultSelected='Choose amount of stops'
                    content={[2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
                      return (
                        <option
                          key={number}
                          className='select__option'
                          value={number}>
                          {number}
                        </option>
                      );
                    })}
                  />
                  <Dropdown
                    selected={currentLocation.id ?? ''}
                    onChange={handleCurrentLocationChange}
                    defaultSelected='Choose starting location'
                    disabled={!amountOfLocations || !selectedState}
                    content={topNLocations.map(location => {
                      return (
                        <option key={location.id}
                        className='select__option'
                        value={location.id}
                        >{location.name}</option>
                      )
                    })}
                  />

                  <Button
                    buttonText='Generate Route'
                    disabled={!amountOfLocations || !selectedState}
                    handleClick={handleGenerateRoute}
                  />
                </div>
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
