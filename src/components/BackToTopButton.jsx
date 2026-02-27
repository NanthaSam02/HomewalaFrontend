import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6"; // Fix the icon name (FaArrowUp instead of FaArrowTop)

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[30px] right-8 bg-blue-500 text-white w-[40px] h-[40px] rounded-lg shadow-lg cursor-pointer hover:bg-blue-600 transition duration-300 flex justify-center items-center backtopbtn"
          style={{zIndex:"9999"}}
        >
          <FaArrowUp className="text-lg" />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
