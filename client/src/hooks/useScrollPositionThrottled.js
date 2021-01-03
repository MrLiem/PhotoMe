import { useEffect, useRef } from "react";
// Giới hạn số lần thực thi function
import throttle from "lodash/throttle";

/**
 *  Lấy Vị trí scroll hiện tại
 * @function getCurrentScrollPosition
 * @param {HTMLElement} element  element để lấy scroll position
 */
const getCurrentScrollPosition = (element) => {
  const { scrollTop } = element;
  return scrollTop;
};

/**
 * A throttled hook để thực thi 1 function khi scroll
 * @function useScrollPositionThrottled
 * @param {function} callback Callback function được gọi khi user  scrolls
 * @param {HTMLElement} element  element dùng để tính toán scroll position,  default là document
 * @param {array} deps Dependency array
 */
const useScrollPositionThrottled = (callback, element, deps = []) => {
  const currentElement = element ? element : document.documentElement;
  const scrollPosition = useRef(getCurrentScrollPosition(currentElement));

  /**
   * Handles xác định giá trị position khi scrolling
   * @function handleScroll
   */
  useEffect(() => {
    const handleScroll = () => {
      scrollPosition.current = getCurrentScrollPosition(currentElement);
      callback({
        currentScrollPosition: scrollPosition.current,
        // Tính điểm cuối khi scroll
        atBottom:
          currentElement.scrollHeight -
            currentElement.scrollTop -
            currentElement.clientHeight <
          1000,
      });
    };
    // Throttle the function thực thi tối đa 1 lần trong mỗi 200ms
    const handleScrollThrottled = throttle(handleScroll, 200);
    element
      ? element.addEventListener("scroll", handleScrollThrottled)
      : window.addEventListener("scroll", handleScrollThrottled);

    return () => {
      element
        ? element.removeEventListener("scroll", handleScrollThrottled)
        : window.removeEventListener("scroll", handleScrollThrottled);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, element, currentElement, callback]);
};

export default useScrollPositionThrottled;
