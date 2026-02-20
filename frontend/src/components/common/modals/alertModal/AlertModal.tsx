import NiceModal from "@ebay/nice-modal-react";
import CommonButton from "../../ui/commonButton/CommonButton";
import CommonModal from "../CommonModal";
import { memo, type ReactNode, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./AlertModal.scss";

const AlertModal = NiceModal.create(
  ({
    closeAlertModal,
    icon,
    onClickLeftBtn,
    rightBtnTitle,
    onClickRightBtn,
    heading,
    subheading,
    leftBtnTitle,
    className,
    rightBtnClassName,
  }: {
    closeAlertModal: () => void;
    icon: ReactNode;
    leftBtnTitle: string;
    onClickLeftBtn: () => void;
    rightBtnTitle: string;
    onClickRightBtn: () => Promise<void>;
    heading: string;
    subheading: string;
    className: string;
    rightBtnClassName?: string;
  }) => {
    const [loading, setLoading] = useState(false);
    const handleClickRightBtn = async () => {
      try {
        setLoading(true);
        await onClickRightBtn();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    };
    return (
      <CommonModal
        className={`alertmodal ${className}`}
        show
        onHide={closeAlertModal}
        noCross={false}
      >
        {icon && icon}
        {heading && <h4>{heading}</h4>}
        {subheading && <p>{subheading}</p>}

        <Row>
          {leftBtnTitle && (
            <Col>
              <CommonButton
                className="secondarybtn small_btn"
                title={leftBtnTitle}
                onClick={onClickLeftBtn}
                fluid
              />
            </Col>
          )}
          {rightBtnTitle && (
            <Col>
              <CommonButton
                className={rightBtnClassName || "primarybtn small_btn"}
                isLoading={loading}
                title={rightBtnTitle}
                onClick={handleClickRightBtn}
                fluid
              />
            </Col>
          )}
        </Row>
      </CommonModal>
    );
  }
);
export default memo(AlertModal);
