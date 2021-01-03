import React, { useRef, useState, Fragment } from "react";
import classNames from "classnames";

import Loader from "../Loader/Loader";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

// FilterSelector component--- Chọn filter thích hợp cho image
const FilterSelector = ({ setFilter, filters, previewImage }) => {
  const filterSelectorRef = useRef();
  const [selectedFilter, setSelectedFilter] = useState("Normal");

  const handleClick = (name, filter) => {
    setSelectedFilter(name);
    // setFilter gồm tên filter và các xử lý css về cho NewPostFilter Component
    setFilter(filter, name);
  };

  // Show skeleton cho các filter khi chưa xử lý kịp
  const renderSkeleton = (amount) => {
    const skeleton = [];
    for (let i = 0; i < amount; i++) {
      skeleton.push(
        <li
          className="filter-selector__item"
          style={{ width: "12rem", height: "8rem" }}
          key={i}
        >
          <SkeletonLoader animated />
        </li>
      );
    }
    return skeleton;
  };

  return (
    <ul ref={filterSelectorRef} className="filter-selector">
      {/* Nếu ko có filters gì thì hiện loader  */}
      {filters.length === 0 ? (
        <Loader />
      ) : previewImage ? (
        // Nếu có previewImage show filter selector, default là normal
        <Fragment>
          <li
            className={classNames({
              "filter-selector__item": true,
              "filter-selector__item--active font-bold":
                selectedFilter === "Normal",
            })}
            onClick={() => handleClick("Normal", "")}
          >
            <span className="filter-selector__filter-name heading-5">
              Normal
            </span>
            <img src={previewImage} alt="Filter preview" />
          </li>
          {/* Show các filter khác */}
          {filters.map(({ name, filter }, idx) => (
            <li
              className={classNames({
                "filter-selector__item": true,
                "filter-selector__item--active font-bold":
                  selectedFilter === name,
              })}
              onClick={() => handleClick(name, filter)}
              key={idx}
            >
              <span className="filter-selector__filter-name heading-5">
                {name}
              </span>
              {/* Styling image tương ứng vs từng filter */}
              <img src={previewImage} style={{ filter }} alt="Filter preview" />
            </li>
          ))}
        </Fragment>
      ) : (
        // TH chưa có previewImage thì show skeleton cho các filter selector
        renderSkeleton(10)
      )}
    </ul>
  );
};

export default FilterSelector;
