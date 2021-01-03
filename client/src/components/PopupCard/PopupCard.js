import React, { useEffect } from "react";
import classNames from "classnames";

import Card from "../Card/Card";

// PopupCard component
const PopupCard = ({ children, hide, leftAlign }) => {
  useEffect(() => {
    if (hide) {
      // hide popup card khi click vào vùng window
      window.addEventListener("click", hide);
    }

    return () => {
      window.removeEventListener("click", hide);
    };
  }, [hide]);

  return (
    <Card
      className={classNames({
        "popup-card": true,
        "popup-card--left-align": leftAlign,
      })}
    >
      <ul
        style={{
          listStyleType: "none",
          maxHeight: "30rem",
          overflowY: "auto",
          backgroundColor: "white",
        }}
        // ngăn ngừa hiding  component khi clicking bên trong component
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </ul>
    </Card>
  );
};

export default PopupCard;
