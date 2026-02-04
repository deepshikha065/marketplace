import { useState } from "react";
import type { ReactNode } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-clock/dist/Clock.css";
import "react-calendar/dist/Calendar.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import ErrorComponent from "../errorComponent/ErrorComponent";
import { CalendarSolidIcon } from "../../../../assets/images/icons/SvgIcons";
import "./DatePickerr.scss";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DatePickerrProps {
  defaultValue?: Value;
  label?: string;
  name?: string;
  required?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onCalendarClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
  isClockOpen?: boolean;
  isCalendarOpen?: boolean;
  className?: string;
  parentClass?: string;
  error?: ReactNode;
  onChange?: (value: Value) => void;
  format?: string;
  showClock?: boolean;
  dayPlaceholder?: string;
  monthPlaceholder?: string;
  yearPlaceholder?: string;
}

const DatePickerr = ({
  defaultValue = null,
  label,
  name,
  required,
  onFocus,
  onCalendarClose,
  minDate,
  maxDate,
  isClockOpen,
  isCalendarOpen,
  className,
  parentClass,
  error,
  onChange,
  format = "dd MM  y",
  showClock = false,
  dayPlaceholder,
  monthPlaceholder,
  yearPlaceholder,
}: DatePickerrProps) => {
  const [value, setValue] = useState<Value>(defaultValue);

  const handleChange = (newValue: Value) => {
    setValue(newValue);
    onChange?.(newValue);
  };
  const dateTimeFormat = showClock ? "MM/dd/yyyy hh:mm:s a" : format;

  return (
    <div className={`common_datetime input_group ${parentClass || ""}`}>
      {label && <label>{label}</label>}
      <div className="common_datetime_wrapper">
        <DateTimePicker
          clearAriaLabel="Clear value"
          dayAriaLabel="Day"
          monthAriaLabel="Month"
          yearAriaLabel="Year"
          dayPlaceholder={dayPlaceholder || "DD"}
          monthPlaceholder={monthPlaceholder || "MM"}
          yearPlaceholder={yearPlaceholder || "YYYY"}
          nativeInputAriaLabel="Date"
          name={name}
          onChange={handleChange}
          value={value}
          format={dateTimeFormat}
          className={className}
          calendarIcon={<CalendarSolidIcon />}
          clearIcon={value && <span style={{ fontSize: 18 }}>✖</span>}
          required={required}
          onFocus={onFocus}
          onCalendarClose={onCalendarClose}
          minDate={minDate}
          maxDate={maxDate}
          isClockOpen={isClockOpen}
          isCalendarOpen={isCalendarOpen}
          hourPlaceholder="hh"
          minutePlaceholder="mm"
          secondPlaceholder="ss"
        />

      </div>
      <ErrorComponent error={error} />
    </div>
  );
};

export default DatePickerr;
