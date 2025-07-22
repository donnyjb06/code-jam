import React from 'react';
import './Main.css';
import Map from '../Map/Map';
import Modal from '../Modal/Modal';

const Main = () => {
  return (
    <main className='main'>
      <Modal />
      <Map />
    </main>
  );
};

export default Main;
