import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  let startPage, endPage;
  if (pages <= 5) {
    // less than 5 total pages so show all
    startPage = 1;
    endPage = pages;
  } else {
    // more than 5 total pages so calculate start and end pages
    if (page <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (page + 2 >= pages) {
      startPage = pages - 4;
      endPage = pages;
    } else {
      startPage = page - 2;
      endPage = page + 2;
    }
  }

  return (
    pages > 1 && (
      <Pagination className="my-5">
        <LinkContainer to={getPageLink(1, isAdmin, keyword)}>
          <Pagination.First disabled={page === 1} />
        </LinkContainer>
        <LinkContainer to={getPageLink(page - 1, isAdmin, keyword)}>
          <Pagination.Prev disabled={page === 1} />
        </LinkContainer>
        {[...Array(endPage + 1 - startPage).keys()].map((x) => (
          <LinkContainer
            key={startPage + x}
            to={getPageLink(startPage + x, isAdmin, keyword)}
          >
            <Pagination.Item active={startPage + x === page}>
              {startPage + x}
            </Pagination.Item>
          </LinkContainer>
        ))}
        <LinkContainer to={getPageLink(page + 1, isAdmin, keyword)}>
          <Pagination.Next disabled={page === pages} />
        </LinkContainer>
        <LinkContainer to={getPageLink(pages, isAdmin, keyword)}>
          <Pagination.Last disabled={page === pages} />
        </LinkContainer>
      </Pagination>
    )
  );
};

// Utility function to get the page link
const getPageLink = (pageNum, isAdmin, keyword) => {
  return !isAdmin
    ? keyword
      ? `/search/${keyword}/page/${pageNum}`
      : `/page/${pageNum}`
    : `/admin/productlist/${pageNum}`;
};

export default Paginate;
