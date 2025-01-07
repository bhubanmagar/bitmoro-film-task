"use client";
import React, { useEffect, useState, useRef } from "react";

interface Movie {
  id: number;
  title: string;
  description: string;
  rating: number;
  release: string;
  backdrop: string;
  poster: string;
}

export default function Home() {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]); // New state for search results
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollSpeed = 3; // Pixels per frame

  const startScrolling = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (!isPaused) {
        scrollContainer.scrollLeft += scrollSpeed;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId.current = requestAnimationFrame(scroll);
    };

    animationFrameId.current = requestAnimationFrame(scroll);
  };

  const stopScrolling = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/discover/movie", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2ViYTE1YzhlOTMwNmExNGMxZWQ3ZDUyYTRlNGFhMCIsIm5iZiI6MTczMjYxMjEwNC4xMTAzNDA0LCJzdWIiOiI2NzQ1OGRkMzgwYjQ0YTg5MzdiN2MzNDUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.f5pYhZOw9kt_ZFyPzWay-D1seZ2dOGJ43W7Mb5-a-A0",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const data = res.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          rating: movie.vote_average,
          release: movie.release_date,
          description: movie.overview,
          backdrop: `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`,
          poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        }));
        setMovieData(data);
        setFilteredMovies(data);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  useEffect(() => {
    if (movieData.length > 0) {
      startScrolling();
    }
    return () => stopScrolling();
  }, [movieData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Fetch movies based on search term
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        searchTerm
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2ViYTE1YzhlOTMwNmExNGMxZWQ3ZDUyYTRlNGFhMCIsIm5iZiI6MTczMjYxMjEwNC4xMTAzNDA0LCJzdWIiOiI2NzQ1OGRkMzgwYjQ0YTg5MzdiN2MzNDUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.f5pYhZOw9kt_ZFyPzWay-D1seZ2dOGJ43W7Mb5-a-A0",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        const results = res.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          rating: movie.vote_average,
          release: movie.release_date,
          description: movie.overview,
          backdrop: `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`,
          poster: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
        }));
        setSearchResults(results);
      })
      .catch((err) => console.error("Error searching movies:", err));
  };

  const handleMovieSelect = (movie: Movie) => {
    setCurrentMovie(movie);
    setSearchTerm(""); // Clear search input
    setSearchResults([]); // Clear search results
  };

  const formatReleaseDate = (releaseDate: string) => {
    const date = new Date(releaseDate);
    const options: Object = { month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (movieData.length > 0) {
      const randomMovie =
        movieData[Math.floor(Math.random() * movieData.length)];
      setCurrentMovie(randomMovie);
    }
  }, [movieData]);

  return (
    <div className="relative h-screen bg-black p-2 mb-0">
      {/* Background Image */}
      <div className="absolute inset-0 m-3 mt-0">
        {currentMovie && (
          <img
            src={currentMovie.backdrop}
            alt={currentMovie.title}
            className="object-cover w-full h-4/5 rounded-xl"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Search Bar */}
      <div className="w-full z-20 mb-3 flex justify-center absolute top-6">
        <div className="flex flex-col w-lg max-w-lg">
          <div className="flex items-center bg-transparent text-white font-bold bg-opacity-60  rounded-full border-white border-2 px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
              />
            </svg>
            <input
              type="text"
              placeholder="Search Movie/Show..."
              className="bg-transparent text-white font-bold placeholder-gray-300 focus:outline-none ml-2 w-full rounded-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Search Results Dropdown */}
          <div className="bg-gray-950 bg-opacity-80 text-white mt-2 rounded-lg max-h-72  overflow-y-auto">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="p-2 cursor-pointer hover:bg-black flex gap-4 max-w-60 items-center"
                onClick={() => handleMovieSelect(movie)}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-12 w-8 object-cover rounded-md"
                />
                <span className="font-semibold text-sm">{movie.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-5/6 px-6 md:px-12 lg:px-5 text-white">
        {currentMovie && (
          <>
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {currentMovie.title}
              </h1>
              <p className="text-sm md:text-md mb-6 max-w-md box-borderw-full sm:pr-0 pr-2 sm:w-[400px] md:w-[550px] font-semibold text-[0.9rem] md:text-[1.3rem] text-secondary line-clamp-3 pl-2">
                {currentMovie.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500 text-black text-sm md:text-base px-4 py-1 rounded-full font-semibold">
                  IMDB: {currentMovie.rating}
                </div>
                <div className="bg-white text-black text-sm md:text-base px-4 py-1 rounded-full font-semibold">
                  Released On:{" "}
                  {currentMovie && formatReleaseDate(currentMovie.release)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Upcoming Movies Section */}
      <div className="relative z-10 px-6 md:px-12 lg:px-4 text-white ">
        <h2 className="text-xl md:text-xl font-bold m-2 mt-4">
          Upcoming Movies
        </h2>
        <div className="relative h-8 bg-black">
          <div
            className="relative w-full overflow-hidden no-scrollbar p-5"
            onMouseEnter={stopScrolling} // Pause on hover
            onMouseLeave={startScrolling} // Resume on leave
            ref={scrollContainerRef}
          >
            <div className="flex gap-4 w-max items-center">
              {filteredMovies.concat(filteredMovies).map((movie, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-36 h-60 bg-gray-200 rounded-lg"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

