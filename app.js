var Globe = window.Globe
var Data = window.Data
var div = document.getElementById('globe')
var dataset = Data.results.bindings
var urls = {
  earth: 'img/world.jpg',
  bump: 'img/bump.jpg',
  specular: 'img/specular.jpg'
}

// create a globe
var globe = new Globe(div, urls)

// start it
globe.init()

var draw = function(i) {
  var point = dataset[i]
  var [lat, lon] = point.coord.value.replace('Point(', '').replace(')', '').split(' ')
  var d = {
    color: '#'+Math.floor(Math.random()*16777215).toString(16),
    size: 5,
    lat: lat,
    lon: lon
  }

  globe.center(d)

  setTimeout(function() {
    // offset the lat/long so you can actually
    // see the block levitating

    d.lat += 10
    d.lon += 10

    globe.addLevitatingBlock(d)
  }, 30)

  setTimeout(function() { return draw(i+1) }, 100)
}

draw(0)
