import type { ReactNode, Ref } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CommonButton.scss";

type CommonButtonProps = {
  title?: string;
  className?: string;
  svgIcon?: ReactNode;
  imageIcon?: string;
  onClick?: (() => void) | string;
  to?: string;
  id?: string;
  role?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  fluid?: boolean;
  text?: string;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
  target?: string;
};

const CommonButton = ({
  title,
  className = "",
  svgIcon,
  imageIcon,
  onClick,
  to,
  role,
  type = "button",
  disabled,
  isLoading,
  fluid,
  text,
  children,
  ref,
  target,
}: CommonButtonProps) => {
  const buttonClass = `common_btn ${fluid ? "full" : ""} ${isLoading ? "spinner_loader" : ""} ${className}`;

  if (role === "link" && to) {
    return (
      <Link
        to={to}
        className={buttonClass}
        onClick={typeof onClick === "function" ? onClick : undefined}
        target={target}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {svgIcon && <span className="common_btn_icon">{svgIcon}</span>}
        {imageIcon && (
          <span className="common_btn_icon">
            <img fetchPriority="high" src={imageIcon} alt="" />
          </span>
        )}
        <div className="title">{title}</div>
        {isLoading ? <span className="spin_handle"><Spinner /></span> : text}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClass}
      onClick={typeof onClick === "function" ? onClick : undefined}
      disabled={disabled}
      type={type}
      ref={ref as Ref<HTMLButtonElement>}
    >
      {svgIcon && <span className="common_btn_icon">{svgIcon}</span>}
      {imageIcon && (
        <span className="common_btn_icon">
          <img fetchPriority="high" src={imageIcon} alt="" />
        </span>
      )}
      <div className="title">{title}</div>
      {isLoading ? <span className="spin_handle"><Spinner /></span> : text}
      {children}
    </button>
  );
};

export default CommonButton;
