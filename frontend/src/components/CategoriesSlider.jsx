import { useRef, useState, useEffect } from "react";
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
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };
  const checkButtonsVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    // Directly calling the function to handle initial render case
    checkButtonsVisibility();

    // This function handles the scroll event
    const handleScroll = () => {
      checkButtonsVisibility();
    };

    // Safely adding event listener
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll);
    }

    // Cleanup function to remove event listener
    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [categories]);

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
