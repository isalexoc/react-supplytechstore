import { useRef, useState, useLayoutEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useGetCategoriesQuery } from "../slices/productsApiSlice";
import Loader from "./Loader";
import Message from "./Message";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";

const CategoriesSlider = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  const scrollRef = useRef(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (scrollOffset) => {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + scrollOffset,
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    const currentScrollRef = scrollRef.current;

    const checkScrollButtons = () => {
      if (currentScrollRef) {
        const { scrollLeft, scrollWidth, clientWidth } = currentScrollRef;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft < scrollWidth - clientWidth);
      }
    };

    // Update button visibility initially and whenever the scroll position changes
    checkScrollButtons();
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", checkScrollButtons);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", checkScrollButtons);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.toString()}</Message>;

  return (
    <div className="scrollable-container">
      <div className="scroll-container-controls">
        {showLeftButton && (
          <button
            onClick={() => scroll(-200)}
            className="btn btn-outline-dark scroll-left ms-2 opacity-75"
          >
            <SlArrowLeft size={30} />
          </button>
        )}
        <div className="scrollable-container" ref={scrollRef}>
          <div className="scrollable-row">
            {categories.map((category) => (
              <LinkContainer
                key={category._id}
                to={`/products/${category.name.toLowerCase()}/page/1`}
              >
                <div className="category-card position-relative" role="button">
                  <img
                    src={category.image || "https://via.placeholder.com/150"}
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-overlay">
                    <div className="category-text">{category.name}</div>
                  </div>
                </div>
              </LinkContainer>
            ))}
          </div>
        </div>
        {showRightButton && (
          <button
            onClick={() => scroll(200)}
            className="btn btn-outline-dark scroll-right me-2 opacity-75"
          >
            <SlArrowRight size={30} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoriesSlider;
