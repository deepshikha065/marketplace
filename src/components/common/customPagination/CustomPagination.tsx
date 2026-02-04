import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import {
  PaginationNexxtIcon,
  PaginationPrevIcon,
} from "../../../assets/images/icons/SvgIcons";
import "./CustomPagination.scss";

interface CustomPaginationProps {
  limit?: number;
  className?: string;
  handlePageChange?: (selectedItem: { selected: number }) => void;
  pageCount?: number;
  totalDocs?: number;
  page?: number
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  limit = 10,
  className,
  handlePageChange,
  pageCount,
  totalDocs,
  page
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChanged = (event: { selected: number }) => {
    setCurrentPage(event?.selected + 1);
    handlePageChange?.(event);
  };
  return (
    <div className={`custompagination ${className}`}>
      <Row className="align-items-center">
        <Col lg={6} className="custompagination_left">
          <p>{`Showing data ${(currentPage - 1) * limit + 1} to ${Math.min(
            currentPage * limit,
            totalDocs ?? 0
          )} of ${totalDocs} entries`}</p>
        </Col>
        <Col lg={6} className="custompagination_left">
          <ReactPaginate
            previousLabel={<PaginationPrevIcon />}
            nextLabel={<PaginationNexxtIcon />}
            breakLabel="..."
            pageCount={pageCount ?? 1}
            forcePage={(page ?? 1) - 1}
            onPageChange={onPageChanged}
            containerClassName="pagination"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="prevArrow"
            previousLinkClassName="page-link"
            nextClassName="nextArrow"
            nextLinkClassName="page-link"
            activeClassName="active"
          />
        </Col>
      </Row>
    </div>
  );
};

export default CustomPagination;
