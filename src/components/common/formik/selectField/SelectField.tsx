import { useState } from "react";
import Select, { components } from "react-select";
import type { GroupBase, OptionProps, SingleValueProps } from "react-select";
import ErrorComponent from "../errorComponent/ErrorComponent";
import "../FormControl.scss";
import "./SelectField.scss";
import type { ReactNode } from "react";

interface Option {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectFieldProps {
  name?: string;
  label?: ReactNode;
  value?: string;
  options?: Option[];
  error?: ReactNode;
  placeholder?: string;
  className?: string;
  menuIsOpen?: boolean;
  isClearable?: boolean;
  onChange?: (e: any) => void;
}

const CustomOption = (props: OptionProps<Option, false, GroupBase<Option>>) => {
  return (
    <components.Option {...props}>
      {props.data.icon && (
        <span className="option-icon">{props.data.icon}</span>
      )}
      {props.children}
    </components.Option>
  );
};

const CustomSingleValue = (
  props: SingleValueProps<Option, false, GroupBase<Option>>
) => {
  return (
    <components.SingleValue {...props}>
      {props.data.icon && <span className="icon">{props.data.icon}</span>}
      {props.children}
    </components.SingleValue>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  value,
  options = [],
  error,
  placeholder,
  className = "",
  menuIsOpen,
  isClearable = false,
  onChange,
}) => {
  const initialSelected =
    options.find((option) => option.value === value) || null;
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    initialSelected
  );

  const handleChange = (selected: Option | null) => {
    setSelectedOption(selected);
    onChange?.(selected?.value);
  };

  return (
    <div className={`input_group common_select ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <Select<Option, false, GroupBase<Option>>
        name={name}
        options={options}
        classNamePrefix="form"
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder || `Select ${label}`}
        isClearable={isClearable}
        menuIsOpen={menuIsOpen}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
        }}
        styles={{
          indicatorSeparator: (base: any) => ({
            ...base,
            display: "none",
          }),
        }}
        isSearchable={false}
      />
      <ErrorComponent error={error} />
    </div>
  );
};

export default SelectField;
