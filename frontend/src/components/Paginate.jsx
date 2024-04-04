import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = "",
  screen = "",
}) => {
  let startPage, endPage;
  if (pages <= 5) {
    startPage = 1;
    endPage = pages;
  } else {
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

  const getPageLink = (pageNum, isAdmin, keyword, screen) => {
    if (isAdmin) {
      return `/admin/productlist/${pageNum}`;
    } else if (keyword) {
      return `/search/${keyword}/page/${pageNum}`;
    } else if (screen) {
      return `/${screen}/page/${pageNum}`;
    } else {
      return `/page/${pageNum}`;
    }
  };

  return (
    pages > 1 && (
      <Pagination className="my-5">
        {/* First Page Link */}
        <LinkContainer to={getPageLink(1, isAdmin, keyword, screen)}>
          <Pagination.First disabled={page === 1} />
        </LinkContainer>

        {/* Previous Page Link */}
        <LinkContainer to={getPageLink(page - 1, isAdmin, keyword, screen)}>
          <Pagination.Prev disabled={page === 1} />
        </LinkContainer>

        {/* Numbered Page Links */}
        {[...Array(endPage + 1 - startPage).keys()].map((x) => (
          <LinkContainer
            key={startPage + x}
            to={getPageLink(startPage + x, isAdmin, keyword, screen)}
          >
            <Pagination.Item active={startPage + x === page}>
              {startPage + x}
            </Pagination.Item>
          </LinkContainer>
        ))}

        {/* Next Page Link */}
        <LinkContainer to={getPageLink(page + 1, isAdmin, keyword, screen)}>
          <Pagination.Next disabled={page === pages} />
        </LinkContainer>

        {/* Last Page Link */}
        <LinkContainer to={getPageLink(pages, isAdmin, keyword, screen)}>
          <Pagination.Last disabled={page === pages} />
        </LinkContainer>
      </Pagination>
    )
  );
};

export default Paginate;
