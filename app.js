var Globe = window.Globe
var Data = window.Data
var globeContainer = document.getElementById('globe-container')
var labelsContainer = document.getElementById('labels-container')
var dataset = Data.results.bindings
var urls = {
  earth: 'img/world.jpg',
  bump: 'img/bump.jpg',
  specular: 'img/specular.jpg'
}

// create a globe
var globe = new Globe(globeContainer, urls)

// start it
globe.init()

function getLatLon(point) {
  var [lon, lat] = point
    .coord
    .value
    .replace('Point(', '')
    .replace(')', '')
    .split(' ')
    .map(parseFloat)

  return [lat, lon]
}

function addLabel(label) {
  var el = document.createElement('p')
  el.textContent = label
  labelsContainer.prepend(el)
}

var draw = function(i) {
  var point = dataset[i]
  var [lat, lon] = getLatLon(point)
  var label = point.locationLabel.value
  var d = {
    color: '#'+Math.floor(Math.random()*16777215).toString(16),
    size: 50,
    lat: lat,
    lon: lon
  }

  // console.log(i, point.locationLabel.value, d)
  globe.center(d)
  addLabel(label)

  setTimeout(function() {
    // offset the lat/long so you can actually
    // see the block levitating

    d.lat += 10
    d.lon += 10

    globe.addLevitatingBlock(d)
  }, 10)

  setTimeout(function() { return draw(i+1) }, 500)
}

draw(0)
