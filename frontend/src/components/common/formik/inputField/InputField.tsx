import { useState, type ReactNode } from "react";
import { Form } from "react-bootstrap";
import ErrorComponent from "../errorComponent/ErrorComponent";
import "../FormControl.scss";
import { CloseEyeIcon, OpenEyeIcon } from "../../../../assets/images/icons/SvgIcons";

interface InputFieldProps {
  label?: ReactNode;
  name?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  value?: string;
  disabled?: boolean;
  righttext?: ReactNode;
  maxLength?: number;
  disableDecimal?: boolean;
  righttextOnclick?: () => void;
  bottomTitle?: ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
  onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  maxLength,
  label,
  name,
  type,
  placeholder,
  error,
  className,
  value,
  bottomTitle,
  righttext,
  righttextOnclick,
  disabled = false,
  onChange,
  onBlur,
  onWheel,
  onPaste,
  disableDecimal,
}) => {
  const [active, setActive] = useState(true);
  const handleTogglePassword = () => {
    setActive(!active);
  };
  const inputType =
    type === "password" ? (active ? "password" : "text") : type || "text";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" && ["e", "-"].includes(e.key)) {
      e.preventDefault();
    }
    if (disableDecimal && e.key === ".") {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`input_group ${className} ${type === "password" ? "passfield" : ""
        }`}
    >
      {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
      <div className={`input_group_inner ${righttext ? "rightpadding" : ""}`}>
        <Form.Control
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          isInvalid={!!error}
          disabled={disabled}
          maxLength={maxLength}
          onWheel={onWheel}
          onPaste={onPaste}
          onKeyDown={handleKeyDown}
        />
        {type === "password" ? (
          <button
            type="button"
            className="input_group_passbtn"
            onClick={handleTogglePassword}
          >
            {active ? <CloseEyeIcon /> : <OpenEyeIcon />}
          </button>
        ) : (
          ""
        )}
        {righttext && (
          <div
            className="input_group_inner_righttext"
            onClick={righttextOnclick}
          >
            {righttext}
          </div>
        )}
      </div>
      <ErrorComponent error={error} />
      {bottomTitle && (
        <div className="input_group_btm_title">{bottomTitle}</div>
      )}
    </div>
  );
};

export default InputField;
