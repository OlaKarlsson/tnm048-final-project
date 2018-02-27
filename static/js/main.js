queue()
.defer(d3.csv,'static/data/IMDB_movies/imdb_movie_metadata.csv')
.defer(d3.csv,'static/data/Bechdel_dataset/bechdel_allmovies.csv')
.await(draw);

var bar;
var pc;

function draw(error, imdb, bechdel){
  if (error) throw error;
  
  bar = new bar(imdb, bechdel);
  

}
