import './Dropdown.css';
import { FaAngleDown } from 'react-icons/fa';

const Dropdown = ({ content, selected, onChange, defaultSelected }) => {
  return (
    <div className='select-custom-wrapper'>
      <FaAngleDown
        size='1.3rem'
        style={{ color: 'var(--clr-background)' }}
        className='select__arrow'
      />
      <select value={selected} onChange={onChange} className='select'>
        <option value='' disabled>
          {defaultSelected}
        </option>
        {content}
      </select>
    </div>
  );
};

export default Dropdown;
