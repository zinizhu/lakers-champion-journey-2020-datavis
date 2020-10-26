// define margin and svg size
var margin = { top: 30, bottom: 30, left: 30, right: 30 }
var width = 1200
var height = 700

// create svg
var svg = d3
  .select('#lakers-champ-timeline')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// read data
d3.csv('../files/lakers_champ.csv', data => {
  var years = []
  data.forEach(row => {
    // row['YEARAWARDED'] = +row['YEARAWARDED']
    years.push(+row['YEARAWARDED'])
  })
  years.sort()
  console.log(data)

  // add x-axis, time scale
  console.log(
    d3.min(data, d => d['YEARAWARDED']),
    d3.max(data, d => d['YEARAWARDED'])
  )
  var x = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d['YEARAWARDED']),
      d3.max(data, d => d['YEARAWARDED'])
    ])
    .range([0, width])

  svg
    .append('g')
    .attr('class', 'lakers-champ-axis')
    .attr('transform', 'translate(0,' + height * 0.3 + ')')
    .call(
      d3
        .axisBottom(x)
        .tickSize(2)
        .tickValues(years)
        .tickFormat(d3.format('d'))
    )
  d3.selectAll('.lakers-champ-axis .tick line')
    .attr('y2', (d, i) => {
      if (d == 2020) return -50
      if (i % 2 === 0) {
        return -20
      }
      return 20
    })
    .attr('stroke', 'darkgrey')

  d3.selectAll('.lakers-champ-axis path').attr('stroke', 'darkgrey')

  d3.selectAll('.lakers-champ-axis .tick text')
    .attr('y', (d, i) => {
      if (d == 2020) return -80
      if (i % 2 === 0) {
        return -40
      }
      return 30
    })
    .attr('font-size', '13')

  var ticks = d3.selectAll('.lakers-champ-axis .tick')
  ticks.each(function (tick, i) {
    d3.select(this)
      .append('circle')
      .attr('cy', function (d) {
        console.log(i)
        if (d == 2020) return -50
        if (i % 2 === 0) {
          return -20
        }
        return 20
      })
      .attr('r', function (d) {
        if (d === 2020) return 10
        return 5
      })
      .attr('fill', function (d) {
        if (d === 2020) return COLOR.LAKERS_YELLOW
        return COLOR.LAKERS_PURPLE
      })
  })
})
