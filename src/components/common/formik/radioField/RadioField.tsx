import type { ReactNode } from "react";
import { Form } from "react-bootstrap";
import ErrorComponent from "../errorComponent/ErrorComponent";
import "../FormControl.scss";

interface RadioOption {
  label: ReactNode;
  value: string;
}

interface RadioFieldProps {
  control?: "radio";
  label?: ReactNode;
  name: string;
  error?: string;
  className?: string;
  value?: string | boolean;
  options?: RadioOption[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  name,
  error,
  className = "",
  value,
  options,
  onChange,
  onBlur,
}) => {
  return (
    <div className={`input_group radio_handle ${className}`}>
      {label && <p className="radio_group_label">{label}</p>}

      {Array.isArray(options) && options.length > 0 ? (
        options.map((option: RadioOption, index: number) => (
          <Form.Check
            key={index}
            type="radio"
            label={option.label}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={!!error}
          />
        ))
      ) : (
        <Form.Check
          type="radio"
          label={label}
          name={name}
          checked={!!value}
          onChange={onChange}
          onBlur={onBlur}
          isInvalid={!!error}
        />
      )}

      <ErrorComponent error={error} />
    </div>
  );
};

export default RadioField;
