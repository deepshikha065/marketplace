import DatePickerr from "./datepickerr/DatePickerr";
import InputField from "./inputField/InputField";
import SelectField from "./selectField/SelectField";
import TextareaField from "./textareaField/TextareaField";
import PhoneInputField from "./phone/PhoneInputField";
import CheckboxField from "./checkboxField/CheckboxField";
import RadioField from "./radioField/RadioField";
import './FormControl.scss';

interface FormControlProps {
  control?: string;
  name: string;
  error?: string;
  [key: string]: unknown;
}

const FormControl: React.FC<FormControlProps> = ({ control, error, ...props }) => {
  switch (control) {
    case 'select':
      return <SelectField {...props} error={error} />;
    case "date":
      return <DatePickerr {...props} error={error} />;
    case "textarea":
      return <TextareaField {...props} error={error} />;
    case "phone-input":
      return <PhoneInputField {...props} error={error} />;
    case "checkbox":
      return <CheckboxField {...props} error={error} />;
    case "radio":
      return <RadioField {...props} error={error} />;
    default:
      return <InputField {...props} error={error} />;
  }
};

export default FormControl;
