import Pagination from "@mui/material/Pagination";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Future from "./Components";

function App() {
  const [comments, setComments] = useState([]);
  const [current, setCurrent] = useState(
    Number(localStorage.getItem("currentPage")) || 1 
  );
  const [limit, setLimit] = useState(
    Number(localStorage.getItem("itemsPerPage")) || 2 
  );

  useEffect(() => {
    axios
      .get(
        `https://jsonplaceholder.typicode.com/comments?_page=${current}&_limit=${limit}`
      )
      .then((response) => {
        if (response.status === 200) {
          setComments(response.data);
        }
      })
      .catch((error) => {
        console.error("Data fetching error:", error);
      });
  }, [current, limit]);

  function handlePaginate(event, position) {
    setCurrent(position);
    localStorage.setItem("currentPage", position); 
  }

  function handleLimitChange(event) {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);
    localStorage.setItem("itemsPerPage", newLimit);
    setCurrent(1)
    localStorage.setItem("currentPage", 1); 
  }

  return (
    <div>
      <div className="container mx-auto">
        {comments.length > 0 &&
          comments.map((comment) => (
            <div
              key={comment.id} 
              className="p-3 border rounded-md shadow-md"
            >
              <h3>{comment.name}</h3>
              <p>{comment.body}</p>
            </div>
          ))}
      </div>
      <select value={limit} onChange={handleLimitChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <Pagination
        onChange={handlePaginate}
        count={Math.ceil(500 / limit)} 
        variant="outlined"
        color="primary"
        page={current} 
      />
      <hr />
      <Future></Future>
    </div>
    
  );
}

export default App;
