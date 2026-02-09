import NiceModal from "@ebay/nice-modal-react";
import CommonButton from "../../ui/commonButton/CommonButton";
import CommonModal from "../CommonModal";
import { memo, type ReactNode, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { InfoIcon } from "../../../../assets/images/icons/SvgIcons";
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
    encryption,
    rightBtnClassName,
    reminder,
  }: {
    closeAlertModal: () => void;
    icon: ReactNode;
    leftBtnTitle: string;
    onClickLeftBtn: () => void;
    rightBtnTitle: string;
    onClickRightBtn: () => Promise<void>;
    heading: string;
    subheading: string;
    encryption: boolean;
    className: string;
    rightBtnClassName?: string;
    reminder?: boolean;
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
      // size={"lg"}
      >
        {icon && icon}
        {heading && <h4>{heading}</h4>}
        {subheading && <p>{subheading}</p>}
        {reminder && (
          <div className="alertmodal_reminder">
            <div className="text">INV-2025-001 is due on 18-Aug-2025.</div>
            <div>
              <p>Kindly arrange payment at the earliest to avoid delays.</p>
              <span>Thank you.</span>
            </div>
          </div>
        )}
        <Row>
          {leftBtnTitle && (
            <Col>
              <CommonButton
                className="secondarybtn"
                title={leftBtnTitle}
                onClick={onClickLeftBtn}
                fluid
              />
            </Col>
          )}
          {rightBtnTitle && (
            <Col>
              <CommonButton
                className={rightBtnClassName}
                isLoading={loading}
                title={rightBtnTitle}
                onClick={handleClickRightBtn}
                fluid
              />
            </Col>
          )}
          {encryption && (
            <Col>
              <div className="alertmodal_info">
                <span className="alertmodal_info_icon">
                  <InfoIcon />
                </span>
                <span>Your data is protected with bank-level encryption</span>
              </div>
            </Col>
          )}
        </Row>
      </CommonModal>
    );
  }
);
export default memo(AlertModal);
