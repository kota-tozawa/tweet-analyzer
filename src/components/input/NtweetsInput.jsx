import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';

const NtweetsInput = ({ value, options, onChange }) => (
  <div>
    <Label>取得するツイート数：</Label>
    <Input
      type="select"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Input>
  </div>
);

NtweetsInput.propTypes = {
  value: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NtweetsInput;
