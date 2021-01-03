import { useState, useRef } from "react";
import debounce from "lodash/debounce";

import { searchUsers } from "../services/userService";

/**
 * 1 memoized debounced hook để tìm kiếm users with a given offset
 * @function useSearchUsersDebounced
 * @returns {object} Search function và search result
 */

//  Function để tìm kiếm user dc tag
const useSearchUsersDebounced = () => {
  const [result, setResult] = useState([]);
  const [fetching, setFetching] = useState(false);

  const handleSearch = async (string, offset) => {
    if (!string) {
      setFetching(false);
      return setResult([]);
    }

    try {
      // search users với string dc nhập vào
      const response = await searchUsers(string, offset);
      setResult(response ? response : []);
      setFetching(false);
    } catch (err) {
      setFetching(false);
      throw new Error(err);
    }
  };
  // Delay 500ms rồi mới thực hiện function handleSearch
  const handleSearchDebounced = debounce(handleSearch, 500);
  // hàm handleSearchDebouncedRef để trả về component cha
  const handleSearchDebouncedRef = useRef((string, offset) =>
    handleSearchDebounced(string, offset)
  ).current;
  return {
    handleSearchDebouncedRef,
    result,
    setResult,
    fetching,
    setFetching,
  };
};

export default useSearchUsersDebounced;
