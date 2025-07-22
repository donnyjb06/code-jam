import { useState } from 'react';
import './Modal.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import Dropdown from '../Dropdown/Dropdown';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import { US_STATE_CODES } from '../../utils/constants';
import useRoute from '../../hooks/useRoute';
import Button from '../Button/Button';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

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
    handleCurrentLocationChange,
    mode,
    currentStop,
    totalTime,
    totalDistance,
    currentIndex,
    route,
    getNextLocation,
    getPreviousLocation,
    resetRoute
  } = useRoute();

  const isNotUndefined = !!currentStop

  const imgSrc = isNotUndefined && currentStop.image ? currentStop.image : "https://placehold.co/600x400";

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
                    content={topNLocations.map((location) => {
                      return (
                        <option
                          key={location.id}
                          className='select__option'
                          value={location.id}>
                          {location.name}
                        </option>
                      );
                    })}
                  />

                  <Button
                    buttonText='Generate Route'
                    disabled={
                      !amountOfLocations ||
                      !selectedState ||
                      !currentLocation.id
                    }
                    handleClick={handleGenerateRoute}
                  />
                </div>
              </>
            )}
            {mode === 'preview' && (
              <>
                <button className='modal__cycle modal__cycle_previous' disabled={currentIndex === 0}><FaArrowLeft size="1.5rem" style={{color: 'var(--clr-foreground)'}} onClick={getPreviousLocation}/></button>
                <button className='modal__cycle modal__cycle_next'disabled={currentIndex === route.length}><FaArrowRight size="1.5rem" style={{color: 'var(--clr-foreground)'}}onClick={getNextLocation}/></button>
                <img className='modal__image' src={imgSrc} />
                <h1 className='modal__heading'>{currentStop.name}</h1>
                <p className="modal__info">{`Stop #${currentIndex + 1}`}</p>
                <p className='modal__address'>
                  Address: <b>{currentStop.address}</b>
                </p>
                <p className='modal__info'>
                  Total Distance: <b>{totalDistance} miles</b>{' '}
                </p>
                <p className='modal__info'>
                  Estimated Driving Time:{' '}
                  <b>
                    {totalTime.hours === 0 ? '' : `${totalTime.hours} hrs`}{' '}
                    {totalTime.minutes} mins
                  </b>
                </p>
                <Button buttonText="Generate New Route" handleClick={resetRoute} disabled={false}/>
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
        <FaChevronUp style={{ color: 'var(--clr-background)' }} size={20} />
      </motion.button>
    </>
  );
};

export default Modal;
