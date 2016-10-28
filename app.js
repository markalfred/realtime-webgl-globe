var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame

var Globe = window.Globe
var Data = window.Data
var moment = window.moment

if (!Data) {
  var query = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=SELECT%20%3Fcoord%20%3Fpoint_in_time%20%3FbattleLabel%20WHERE%20%7B%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%0A%20%20%3Fbattle%20wdt%3AP276%20%3Flocation.%0A%20%20%3Flocation%20wdt%3AP625%20%3Fcoord.%0A%20%20%3Fbattle%20wdt%3AP31%20wd%3AQ178561.%0A%20%20%3Fbattle%20wdt%3AP585%20%3Fpoint_in_time.%0A%7D%0AGROUP%20BY%20%3Fpoint_in_time%20%3Fcoord%20%3FbattleLabel%0AORDER%20BY%20%3Fpoint_in_time'
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.open("GET", query, false)  // make it synchronous for now
  xmlHttp.send(null)
  Data = JSON.parse(xmlHttp.responseText)
}

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
  var label = point.battleLabel.value
  var d = {
    color: '#'+Math.floor(Math.random()*16777215).toString(16),
    size: Math.random()*10,
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
