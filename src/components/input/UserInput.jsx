import React from 'react';
import PropTypes from 'prop-types';
import { Label, Input } from 'reactstrap';

const UserInput = ({ value, onChange }) => (
  <div>
    <Label>Twitterユーザー名：</Label>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

UserInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default UserInput;
