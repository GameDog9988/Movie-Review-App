import React, { useEffect, useState } from "react";
import Movie from "./Movie";
import FilmReel from "./images/film_reel-min.jpg";
import "./sass/App.scss";
import { motion } from "framer-motion";

function App() {
  const API_KEY = "pkHjVPMSv0I48ATgtjYQBaDyGJGIszNk";

  const [reviews, setReviews] = useState([]);
  const [offsetNum, setOffsetNum] = useState(0);
  const [morePages, setMorePages] = useState();
  const [movieOrder, setMovieOrder] = useState("by-opening-date");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPage = () => {
    if (morePages) {
      setOffsetNum(offsetNum + 20);
    }
  };

  const prevPage = () => {
    if (offsetNum !== 0) {
      setOffsetNum(offsetNum - 20);
    }
  };

  const changeMovieOrder = (e) => {
    setMovieOrder(e.target.value);
    setOffsetNum(0);
    console.log(movieOrder);
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setOffsetNum(0);
    setQuery(search);
  };

  useEffect(() => {
    getReviews();
    // eslint-disable-next-line
  }, [offsetNum, movieOrder, query]);

  const getReviews = async () => {
    setLoading(true);
    const response = await fetch(
      `https://api.nytimes.com/svc/movies/v2/reviews/picks.json?api-key=${API_KEY}&offset=${offsetNum}&order=${movieOrder}&query=${query}`
    );
    const reviewData = await response.json();
    setReviews(reviewData.results);
    setMorePages(reviewData.has_more);
    setLoading(false);
    console.log(reviewData);
  };

  return (
    <div className="App">
      <header>
        <h1>
          The New York Times Critic's Picks
          <span aria-label="movie camera" role="img">
            &#127909;
          </span>
        </h1>
        <div className="search-container"></div>
        <div className="sort-and-search-container">
          <form onSubmit={getSearch}>
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={updateSearch}
            />
            <button>
              <i className="fa fa-search"></i>
            </button>
          </form>
          <div>
            <label htmlFor="sortBy">Sort By: </label>
            <select id="sortBy" value={movieOrder} onChange={changeMovieOrder}>
              <option value="by-opening-date">Most Recent</option>
              <option value="by-publication-date">Oldest</option>
              <option value="by-title">Title</option>
            </select>
          </div>
        </div>
        <nav>
          {offsetNum !== 0 && (
            <motion.button
              className="prev-page-btn"
              onClick={prevPage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span role="img">&#10094;</span> Previous Page
            </motion.button>
          )}
          {morePages && (
            <motion.button
              className="next-page-btn"
              onClick={nextPage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Next Page <span role="img">&#10095;</span>
            </motion.button>
          )}
        </nav>
      </header>
      {!loading && (
        <motion.div className="movie-list">
          {reviews.length === 0 && <h2>No results</h2>}
          {reviews.map((review, index) => (
            <Movie
              key={index}
              link={review.link.url}
              title={
                review.display_title === null
                  ? "No Title Found"
                  : review.display_title
              }
              description={
                review.summary_short === null
                  ? "No Summary Found"
                  : review.summary_short
              }
              image={
                review.multimedia === null ? FilmReel : review.multimedia.src
              }
              year={review.publication_date.substring(0, 4)}
              month={review.publication_date.substring(5, 7)}
              day={review.publication_date.substring(8, 10)}
            />
          ))}
        </motion.div>
      )}
      {!loading && (
        <footer>
          <nav>
            {offsetNum !== 0 && (
              <motion.button
                className="prev-page-btn"
                onClick={prevPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span role="img">&#10094;</span> Previous Page
              </motion.button>
            )}
            {morePages && (
              <motion.button
                className="next-page-btn"
                onClick={nextPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Next Page <span role="img">&#10095;</span>
              </motion.button>
            )}
          </nav>
        </footer>
      )}
    </div>
  );
}

export default App;
