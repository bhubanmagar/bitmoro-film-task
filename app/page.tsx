"use client";
import React, { useEffect, useState, useRef } from "react";

interface Movie {
  id: number;
  title: string;
  backdrop: string;
}

export default function Home() {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  let scrollInterval: NodeJS.Timeout;

  const startScrolling = () => {
    if (scrollRef.current) {
      scrollInterval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += 1;
          if (
            scrollRef.current.scrollLeft >=
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          ) {
            scrollRef.current.scrollLeft = 0;
          }
        }
      }, 10); // Speed of scrolling
    }
  };

  const stopScrolling = () => {
    clearInterval(scrollInterval);
  };

  useEffect(() => {
    // Fetch movie data from the API
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
          backdrop: `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`,
        }));
        setMovieData(data);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  useEffect(() => {
    startScrolling();
    return () => {
      clearInterval(scrollInterval);
    };
  }, []);

  return (
    <div className="relative h-screen bg-black p-2">
      {/* Background Image */}
      <div className="absolute inset-0 m-3 mt-0">
        <img
          src="https://as1.ftcdn.net/jpg/07/30/86/54/1000_F_730865405_KyZxfhhimHGzHdo4XYCXKjTFOxZrYWNx.webp"
          alt="Mufasa"
          className="object-cover w-full h-full rounded-xl"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-5 flex justify-center absolute top-6">
        <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
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
            className="bg-transparent text-white placeholder-gray-300 focus:outline-none ml-2 w-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-6 md:px-12 lg:px-5 text-white">
        {/* Movie Title and Description */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Mufasa: The Lion King
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Mufasa, a cub lost and alone, meets a sympathetic lion named Taka,
            the heir to a royal bloodline. The chance meeting sets in motion an
            expansive...
          </p>

          {/* IMDB and Release Date */}
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 text-black text-sm md:text-base px-4 py-2 rounded-full font-semibold">
              IMDB: 7.4
            </div>
            <div className="bg-white text-black text-sm md:text-base px-4 py-2 rounded-full font-semibold">
              Released On: Dec 18
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Movies Section */}
      <div className="relative z-10 px-6 md:px-12 lg:px-4 text-white">
        <h2 className="text-xl md:text-xl font-bold">Upcoming Movies</h2>
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={stopScrolling}
          onMouseLeave={startScrolling}
        >
          <div
            className="flex gap-4 w-full items-center whitespace-nowrap"
            ref={scrollRef}
            style={{
              scrollBehavior: "smooth",
            }}
          >
            {/* Movie Cards */}
            {movieData.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-36 h-60 bg-transparent rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-4/5 object-cover "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

