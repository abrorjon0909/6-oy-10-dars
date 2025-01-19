import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import './index.css'
function App() {
  const [comments, setComments] = useState([]); // Ma'lumotlarni saqlash
  const [currentPage, setCurrentPage] = useState(1); // Joriy sahifa
  const [loading, setLoading] = useState(false); // Yuklanish holati
  const observerRef = useRef(null); // Intersection Observer uchun

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/comments?_page=${currentPage}&_limit=10`
        );
        if (response.status === 200) {
          setComments((prevComments) => [...prevComments, ...response.data]); // Ma'lumotlarni qo'shish
        }
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [currentPage]);

  useEffect(() => {
    // Intersection Observer o'rnatish
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setCurrentPage((prevPage) => prevPage + 1); // Keyingi sahifaga o'tish
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);

  return (
    <div style={{ padding: "20px" }}>
      <div className="container">
        {comments.map((comment) => (
          <div key={comment.id} className="card">
            <h3>{comment.name}</h3>
            <p>{comment.body}</p>
          </div>
        ))}
      </div>
      <div ref={observerRef} style={{ height: "50px" }} />
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
    </div>
  );
}

export default App;
