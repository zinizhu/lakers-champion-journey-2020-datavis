// define margin and svg size
var season_percentage_margin = { top: 30, bottom: 20, left: 50, right: 30 }
var season_percentage_width = 1000
var season_percentage_height = 120

// create svg
var seasonPercentage = d3
  .select('#lakers-season-percentage')
  .append('svg')
  .attr(
    'width',
    season_percentage_width +
      season_percentage_margin.left +
      season_percentage_margin.right
  )
  .attr(
    'height',
    season_percentage_height +
      season_percentage_margin.top +
      season_percentage_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      season_percentage_margin.left +
      ',' +
      season_percentage_margin.top +
      ')'
  )

// read data
d3.csv('./files/lakers_game_logs.csv', data => {
  data.forEach(row => {
    row.PTS = +row['PTS']
    row.OPP_PTS = +row['OPP_PTS']
    row['DIFF'] = row.PTS - row.OPP_PTS
  })

  data.sort((a, b) => a['GAME_DATE'].localeCompare(b['GAME_DATE']))
  // console.log(data)

  // define linear scales
  var len = data.length
  var x = d3
    .scaleBand()
    .domain(d3.range(len))
    .range([0, season_percentage_width])
    .padding(0.1)

  var y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([season_percentage_height, 0])

  seasonPercentage
    .append('g')
    .attr('transform', 'translate(' + -10 + ', ' + 0 + ')')
    .call(d3.axisLeft(y).ticks(4).tickFormat((d) => d * 100 + '%'))

  seasonPercentage
    .append('path')
    .datum(data)
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
    .datum(data)
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

  // append circle text
  seasonPercentage
    .selectAll('fg-circle-text')
    .data(data)
    .enter()
    .append('text')
    .attr('class', d => 'season-percentage-FG-text-' + d.GAME_ID)
    .attr('x', (d, i) => x(i) - 10)
    .attr('y', d => y(d.FG_PCT) - 15)
    .text(d => (d.FG_PCT * 100).toFixed(1) + '%')
    .attr('display', 'none')

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

  // append circle text
  seasonPercentage
    .selectAll('fg3-circle-text')
    .data(data)
    .enter()
    .append('text')
    .attr('class', d => 'season-percentage-FG3-text-' + d.GAME_ID)
    .attr('x', (d, i) => x(i) - 10)
    .attr('y', d => y(d.FG3_PCT) + 25)
    .text(d => (d.FG3_PCT * 100).toFixed(1) + '%')
    .attr('display', 'none')

  // append labels
  seasonPercentage
    .append('text')
    .attr('x', x(data.length - 1) + 5)
    .attr('y', y(data[data.length - 1].FG_PCT))
    .text('FG%')

  seasonPercentage
    .append('text')
    .attr('x', x(data.length - 1) - 2)
    .attr('y', y(data[data.length - 1].FG3_PCT) + 20)
    .text('FG3%')
})
