import React, { memo, type ReactNode } from "react";
import { Col, Placeholder, Row, Table } from "react-bootstrap";
import { NoRecordIcon } from "../../../assets/images/icons/SvgIcons";
import CustomPagination from "../customPagination/CustomPagination";
import "./CommonTable.scss";

type TProps = {
  children?: ReactNode;
  fields: string[];
  loader?: boolean;
  tableTitle?: ReactNode;
  tableRightContent?: ReactNode;
  lastColumnWidth?: string;
  className?: string;
  filterBtn?: boolean;
  pagination?: boolean;
  onPageChange?: (event: unknown) => void;
  totalPages?: number;
  totalDocs?: number;
  tabsRightContent?: ReactNode;
  showCheckbox?: boolean;
  rowCheckbox?: boolean;
  page?: number
};

const CommonTable = (props: TProps) => {
  return (
    <>
      <div
        className={`table_box ${props.tableTitle ? "table_title" : ""} ${props.className ?? ""
          }`}
      >
        {props.tableTitle && (
          <div className="table_box_head">
            <Row className="align-items-center">
              <Col>
                <h4 className="table_heading">{props.tableTitle}</h4>
              </Col>
              {props.tableRightContent && (
                <Col className="text-end">{props.tableRightContent}</Col>
              )}
            </Row>
          </div>
        )}

        <Table responsive>
          {props.fields && (
            <thead
              className={
                props.tableTitle || props.tableRightContent ? "radius_zero" : ""
              }
            >
              <tr>
                {props.fields?.map((item: string, index: number) => {
                  const isLast = index === props.fields?.length - 1;
                  return (
                    <th
                      key={item}
                      style={
                        isLast
                          ? {
                            width: props.lastColumnWidth,
                            minWidth: props.lastColumnWidth,
                          }
                          : {}
                      }
                    >
                      {item}
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {props?.loader ? (
              <>
                {[...Array(4)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {props.fields.map((_, colIndex) => (
                      <td key={colIndex}>
                        <Placeholder as="p" animation="glow">
                          <Placeholder xs={12} />
                        </Placeholder>
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : (
              React.Children.map(props.children, (childRow, rowIndex) => {
                if (!React.isValidElement(childRow) || childRow.type !== "tr") {
                  return childRow;
                }

                return React.cloneElement(childRow as React.ReactElement, {
                  key: childRow.key ?? rowIndex,
                });
              }) || (
                <tr>
                  <td colSpan={props.fields?.length} className="no_record_box">
                    <NoRecordIcon />
                    <p>No Record Found</p>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
        {props.pagination && (
          <>
            <CustomPagination
              pageCount={props?.totalPages ?? 1}
              handlePageChange={props?.onPageChange}
              totalDocs={props?.totalDocs ?? 0}
              page={props?.page ?? 0}
            />
          </>
        )}
      </div>
    </>
  );
};
export default memo(CommonTable);
