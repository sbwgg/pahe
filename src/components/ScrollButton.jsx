import React, { useState, useEffect } from "react";
import { BsArrowUpCircle } from "react-icons/bs";
const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const show = () => {
    if (window.pageYOffset > 800) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", show);
    return () => window.removeEventListener("scroll", show);
  }, []);
  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="bg-[var(--lighttt)]  z-30 hidden md:flex rounded-full p-[11px] fixed bottom-[4%] right-[1%]"
      >
        <BsArrowUpCircle size={25} className={"text-white/[0.9]"} />
        {/* <span className="hidden hover:flex items-center">Scroll to Top</span> */}
      </button>
    )
  );
};

export default ScrollButton;
