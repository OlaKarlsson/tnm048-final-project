queue()
.defer(d3.csv,'static/data/IMDB_movies/imdb_movie_metadata.csv')
.defer(d3.csv,'static/data/Bechdel_dataset/bechdel_allmovies.csv')
.defer(d3.csv,'static/data/data.csv')
.await(draw);

var bar;
var stackedBar;
var pc;

function draw(error, imdb, bechdel, pcData){
  if (error) throw error;
  bar = new bar(imdb, bechdel);
  pc = new pc(imdb, bechdel, pcData);
  

}
