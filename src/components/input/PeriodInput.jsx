import React from 'react';
import { Label, Input } from 'reactstrap';

const PeriodInput = ({ value, options, onChange }) => (
  <div>
    <Label>期間：</Label>
    <Input
      type="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.key}>{option.label}</option>
      ))}
    </Input>
  </div>
);

export default PeriodInput;
