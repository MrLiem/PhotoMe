import React, { Fragment } from "react";
import { useParams } from "react-router-dom";

import PostDialog from "../../components/PostDialog/PostDialog";
import MobileHeader from "../../components/Header/MobileHeader/MobileHeader";

// PostPage component-- xem chi tiết 1 post
const PostPage = () => {
  // lấy postId từ params
  const { postId } = useParams();

  return (
    <Fragment>
      {/* Khi xem trên mobile */}
      <MobileHeader backArrow>
        <h3 className="heading-3">Post</h3>
        {/* Empty element to keep grid happy */}
        <div></div>
      </MobileHeader>
      {/* Khi xem trên laptop */}
      <main className="post-page grid">
        <PostDialog className="border-grey-2" postId={postId} />
      </main>
    </Fragment>
  );
};

export default PostPage;
