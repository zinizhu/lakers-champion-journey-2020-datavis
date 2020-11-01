// define margin and svg size
var margin = { top: 30, bottom: 30, left: 30, right: 30 }
var width = 1000
var height = 200

// create svg
var seasonPercentage = d3
  .select('#lakers-season-percentage')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// read data
d3.csv('./files/lakers_game_logs.csv', data => {
  data.forEach(row => {
    row.PTS = +row['PTS']
    row.OPP_PTS = +row['OPP_PTS']
    row['DIFF'] = row.PTS - row.OPP_PTS
  })

  data.sort((a, b) => a['GAME_DATE'].localeCompare(b['GAME_DATE']))
  console.log(data)

  // define linear scales
  var len = data.length
  var x = d3
    .scaleBand()
    .domain(d3.range(len))
    .range([0, width])
    .padding(0.1)

  var y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([height, 0])

  console.log(x.bandwidth())

  // on hover
  // const highlight = function (d) {
  //   var rectClass = '.season-log-' + d.GAME_ID
  //   var textClass = '.season-log-text-' + d.GAME_ID
  //   var color = d.DIFF < 0 ? COLOR.LAKERS_BLACK : COLOR.ORANGE
  //   d3.selectAll(rectClass).style('fill', color)
  //   d3.selectAll(textClass).style('display', 'block')
  // }

  // const doNotHighlight = function (d) {
  //   var rectClass = '.season-log-' + d.GAME_ID
  //   var textClass = '.season-log-text-' + d.GAME_ID
  //   var color = d.DIFF < 0 ? COLOR.DARK_GREY : COLOR.LAKERS_YELLOW
  //   d3.selectAll(rectClass).style('fill', color)
  //   d3.selectAll(textClass).style('display', 'none')
  // }
  seasonPercentage
    .append('path')
    .datum(data) // .data vs .datum: former allows multiple append, later allows 1
    .attr('fill', 'none')
    .attr('stroke', COLOR.LAKERS_PURPLE)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x((d, i) => x(i))
        .y(d => y(d.FG_PCT))
    )

  seasonPercentage
    .append('path')
    .datum(data) // .data vs .datum: former allows multiple append, later allows 1
    .attr('fill', 'none')
    .attr('stroke', COLOR.RED)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x((d, i) => x(i))
        .y(d => y(d.FG3_PCT))
    )

  // apend cicles
  seasonPercentage
    .selectAll('fg-circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', d => 'season-percentage-FG-' + d.GAME_ID)
    .attr('cx', (d, i) => x(i))
    .attr('cy', d => y(d.FG_PCT))
    .attr('r', 3)
    .attr('fill', COLOR.LAKERS_PURPLE)

  seasonPercentage
    .selectAll('fg3-circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', d => 'season-percentage-FG3-' + d.GAME_ID)
    .attr('cx', (d, i) => x(i))
    .attr('cy', d => y(d.FG3_PCT))
    .attr('r', 3)
    .attr('fill', COLOR.RED)

  // append labels
  seasonPercentage
    .append('text')
    .attr('x', x(data.length - 1) + 5)
    .attr('y', y(data[data.length - 1].FG_PCT))
    .text('FG%')

  seasonPercentage
    .append('text')
    .attr('x', x(data.length - 1) + 5)
    .attr('y', y(data[data.length - 1].FG3_PCT) + 5)
    .text('FG3%')
})
