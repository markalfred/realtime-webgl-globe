var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame

var Globe = window.Globe
var Data = window.Data
var moment = window.moment

var globeContainer = document.getElementById('globe-container')
var labelsContainer = document.getElementById('labels-container')
var dateEl = document.getElementById('date')
var spinEl = document.getElementById('spin-earth')

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
  setTimeout(function() { el.style.opacity = 0 }, 1000)
}

var draw = function(point) {
  var [lat, lon] = getLatLon(point)
  var label = point.locationLabel.value
  var d = {
    color: '#'+Math.floor(Math.random()*16777215).toString(16),
    size: 50,
    lat: lat,
    lon: lon
  }

  addLabel(label)

  if (spinEl.checked) {
    globe.center({ lat: lat - 20, lon: lon })
  }

  globe.addLevitatingBlock(d)
}

function getDate(dateString) {
  if (dateString[0] === '-') {
    var absYear = dateString.split('-')[1]
    var date = new Date(dateString.substr(1, Infinity))
    date.setYear(absYear * -1)
    return moment(date)
  } else {
    return moment(dateString)
  }
}

var tick = function(date) {
  var point = dataset[i]
  if (!point) { return }

  var pointDate = getDate(point.point_in_time.value)
  if (date.isAfter(pointDate)) {
    dateEl.textContent = pointDate.format('MM YYYY')
    draw(point)
    i = i + 1
  } else {
    dateEl.textContent = date.format('MM YYYY')
    date.add(1, 'month')
  }

  requestAnimationFrame(function() { tick(date) })
}

var i = 0
var startDate = '-500-01-01T00:00:00Z'

tick(getDate(startDate))
