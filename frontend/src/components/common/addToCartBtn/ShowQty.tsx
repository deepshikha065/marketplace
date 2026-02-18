import React from "react";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max,
  onChange,
}) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (!max || value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="qty-controls">
      <button
        className="qty-btn"
        disabled={value <= min}
        onClick={handleDecrease}
      >
        -
      </button>

      <span className="qty-value">{value}</span>

      <button
        className="qty-btn"
        disabled={max ? value >= max : false}
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
