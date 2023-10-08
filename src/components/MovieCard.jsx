import React from 'react'

const MovieCard = ({movie}) => {
    const IMAGE_PATH = "https://image.tmdb.org/t/p/w500"
  return (
    <div className='movie-card'>
        {movie.poster_path? <img className={'movie-cover'} src = {`${IMAGE_PATH}${movie.poster_path}`} /> 
        : <div className={'movie-placeholder'}>No Image Found</div>}
      <h5>{movie.title}</h5>
    </div>
  )
}

export default MovieCard
