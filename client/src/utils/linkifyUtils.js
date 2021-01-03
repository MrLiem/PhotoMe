// Phân loại link là tag hay mention
export const linkifyOptions = {
  formatHref: function (href, type) {
    if (type === "hashtag") {
      // Bỏ #
      href = "/explore/tags/" + href.substring(1);
    }
    if (type === "mention") {
      // Bỏ @
      href = "/" + href.substring(1);
    }
    return href;
  },
  className: "styled-link",
  attributes: {
    target: {
      url: "_blank",
    },
  },
};
