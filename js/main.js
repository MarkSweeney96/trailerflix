
  // Author: Mark Sweeney
  // Date: 05/11/20

  // !!! NB: ADD YOUR TMDB API KEY TO LINE 27 AND 70 IN REPLACE OF 'YOUR_API_KEY'  


$(document).ready(() => {
  $('#searchForm').on('submit', (e) =>{

    //variable created with search input text
    let searchText = $('#searchText').val();
    // searchText passed into getMovies function;
    getMovies(searchText);

    // stops form from submitting to a file
    e.preventDefault();
  });
});


function getMovies(searchText) {
  // logs search box text input to console
  console.log('search text: '+searchText);

  //tmdb api request: search query for page 1 of search text input
  axios.get('https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&language=en-US&query='+ searchText)
    .then((response) => {
      console.log(response);
      // api request results put into movies variable
      let movies = response.data.results;
      //console.log(movies);
      let output = '';
      // loop though movies array and output title and poster
      $.each(movies, (index, movie) => {
        //append output
        output += `
        <div class="col-md-3">
          <div class="movie-data">

          <ul class="list-group">
            <li class="list-group-item"><img class="movie-poster" src="https://image.tmdb.org/t/p/w1280${movie.poster_path}"></li>
            <li class="list-group-item"><h5>${movie.original_title}</h5></li>
            <li class="list-group-item"><a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">View Movie</a></li>
        </ul>
          </div>
        </div>
        `;
      });

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });

}


function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie_view.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');

  //tmdb api request: view movie by id
  axios.get('https://api.themoviedb.org/3/movie/'+movieId+'?api_key=YOUR_API_KEY&language=en-US&append_to_response=videos')
    .then((response) => {
      //console.log(response);
      let movie = response.data;
      console.log(movie);
      console.log(movie.original_title);

      //genres
      let genre_names = movie.genres.map(function(item) {
        return item['name'];
      });
      console.log(genre_names);
      let genre_list = genre_names.toString();
      console.log("genres are " +genre_list);

      //production_companies
      let production_names = movie.production_companies.map(function(item) {
        return item['name'];
      });
      console.log(production_names);
       let production_list = production_names.toString();
       console.log("production companies are " +production_list);

       //spoken_languages
       let language_names = movie.spoken_languages.map(function(item) {
         return item['name'];
       });
       console.log(language_names);
        let languages = language_names.toString();
        console.log("languages are " +languages);

        //videos
        let video_list = movie.videos.results.map(function(item) {
          return item['key'];
        });
        console.log(video_list);
        let trailer = video_list.toString();
        console.log("trailers are " +trailer);
        console.log(trailer);
        let official_trailer = trailer.substring(0, 11);
        console.log(official_trailer);


      let output = `
      <div class ="row">
        <div class="col-md-4">
        <img src="https://image.tmdb.org/t/p/w1280${movie.poster_path}" class="movie-view-poster">
        </div>
        <div class="col-md-8">
        <style>
          body {
            background: url("https://image.tmdb.org/t/p/w1280${movie.backdrop_path}");
            background-repeat: no-repeat;
            background-size: 100%;
          }
        </style>

        <ul class="list-group movie-details">
        <li class="list-group-item"><h2 class="movie-view-title">${movie.original_title}</h2></li>
        <li class="list-group-item"><text class="movie-view-details">Tagline:</text> "${movie.tagline}"</li>
          <li class="list-group-item"><text class="movie-view-details">Genre(s):</text> ${genre_list}</li>
          <li class="list-group-item"><text class="movie-view-details">Release Date:</text> ${movie.release_date}</li>
          <li class="list-group-item"><text class="movie-view-details">Runtime:</text> ${movie.runtime} mins</li>
          <li class="list-group-item"><text class="movie-view-details">Produced by:</text> ${production_list}</li>
          <li class="list-group-item"><text class="movie-view-details">Spoken Language(s):</text> ${languages}</li>
          <li class="list-group-item"><text class="movie-view-details">Storyline:</text> ${movie.overview}</li>
      </ul>

      <ul class="list-group movie-trailer">
      <li class="list-group-item"><text class="movie-view-details">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${official_trailer}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </li>
        <li class="list-group-item"><a href="index.html" class="btn btn-primary" href="#">Back to search</a></li>
      </ul>

        </div>
      </div>

      `;

      $('#movies_view').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
