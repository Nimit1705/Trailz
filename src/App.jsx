import React, { useEffect, useState } from 'react'
import axios from 'axios';
import YouTube from 'react-youtube';
import MovieCard from "./components/MovieCard";
import './App.css';



const App = () => {
  const API_URL = "https://api.themoviedb.org/3/"
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original"
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [selectMovie, setSelectMovie] = useState({})
  const [playTrailer, setPlayTrailer] = useState(false);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover"
    const {data: {results}} = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: import.meta.env.VITE_MOVIE_API_KEY,
        query: searchKey
      }
    })

    await clickMovie(results[0])
    setMovies(results)
  }

  const fetchMovie = async (id) => {
    const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: import.meta.env.VITE_MOVIE_API_KEY,
        append_to_response: 'videos'
      }
    })

    return data
  }

  const clickMovie = async (movie) => {
    const data = await fetchMovie(movie.id)
    setSelectMovie(data)
    setPlayTrailer(false)
  }

  useEffect(() => {
    fetchMovies();
  },[])

  const renderMovies = () => {
    return movies.map(movie => (
       <MovieCard 
        key={movie.id}
        movie = {movie}
        selectedMovie = {clickMovie}
      />
    ))
  }

  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  const renderTrailer = () => {
    const trailer = selectMovie.videos.results.find(vid => vid.name === 'Official Trailer')
    const key = trailer ? trailer.key : selectMovie.videos.results[1].key
    return (
      <>
      <YouTube 
        videoId= {key}
        className = {"youtube-container"}
        opts = {{
          height:"100%",
          width:"100%",
          playerVars:{
            autoplay: 1,
          }
        }}
      />
      </>
    )
  }

  return (
    <div className ='App'>
      <header className={'header'}>
        <span>Trailz</span>
        <form onSubmit={searchMovies}>
          <input type="text" placeholder='Search Movies' onChange={e => setSearchKey(e.target.value)}/>
          <button type="submit"><svg fill="#c987ff" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-43.96 -43.96 576.32 576.32" xml:space="preserve" stroke="#c987ff" stroke-width="42.0024"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"></path> </g> </g> </g></svg></button>
        </form>
      </header>

      <div className="hero" style={{backgroundImage:`url("${IMAGE_PATH}${selectMovie.backdrop_path}")`}}>
        <div className="hero-content">
          {selectMovie.videos && playTrailer ? renderTrailer() :  null}
          <button onClick={() => setPlayTrailer(true)} className="button">Play Trailer</button>
          <h1 className={'hero-title'}>{selectMovie.title}</h1>
          {selectMovie.overview ? <p className={'hero-overview'}>{selectMovie.overview}</p> : null}
        </div>
        <div className='black-grad'></div>
      </div>
      {playTrailer ? <button onClick={() => setPlayTrailer(false)} className=" button close">close</button> : null}
      

      <div className="container">
        {renderMovies()}
      </div>
    </div>
  )
}

export default App
