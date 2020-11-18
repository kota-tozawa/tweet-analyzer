import React from 'react'
import PropTypes from 'prop-types'
import { Label, Input } from 'reactstrap'

const PeriodInput = ({ value, options, onChange }) => (
  <div>
    <Label>期間：</Label>
    <Input
      type="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Input>
  </div>
)

PeriodInput.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PeriodInput
