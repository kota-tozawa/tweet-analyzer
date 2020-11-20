import React from 'react'
import { Label, Input } from 'reactstrap'

const UserInput = ({ value, onChange }) => (
  <div>
    <Label>Twitterユーザー名：</Label>
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

export default UserInput
