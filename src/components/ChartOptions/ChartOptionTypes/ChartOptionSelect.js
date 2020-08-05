import React from "react";
import isObject from 'lodash/isObject'

const ChartOptionSelect = ({
  options = [],
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  ...props
}) => {
  
  return (
    <label className="d-block">
      <b>{label}</b>
      <br />
      <select
        className="custom-select"
        value={value}
        onChange={(e) => {
          const stringValue = e.target.value 
          const value = props.type === 'number' ? Number(stringValue) : stringValue
          onChange(value);
        }}
      >
        {options.map((option) => 
          isObject(option) ? <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option> : <option
          key={option}
          value={option}
        >
          {option}
        </option>
        )}
      </select>
      {error && (
        <small>
          <i>{error}</i>
        </small>
      )}
    </label>
  );
};

export default ChartOptionSelect;
