// define margin and svg size
var season_logs_margin = { top: 20, bottom: 10, left: 30, right: 30 }
var season_logs_width = 1000
var season_logs_height = 200

// create svg
var seasonLogs = d3
  .select('#lakers-season-logs')
  .append('svg')
  .attr(
    'width',
    season_logs_width + season_logs_margin.left + season_logs_margin.right
  )
  .attr(
    'height',
    season_logs_height + season_logs_margin.top + season_logs_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' + season_logs_margin.left + ',' + season_logs_margin.top + ')'
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
    .range([0, season_logs_width])
    .padding(0.1)

  var y = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.DIFF) * 1.4, d3.max(data, d => d.DIFF) * 1.4])
    .range([season_logs_height - 50, 0])

  // on hover
  const highlight = function (d) {
    var rectClass = '.season-log-' + d.GAME_ID
    var textClass = '.season-log-text-' + d.GAME_ID
    var fgPctClass = '.season-percentage-FG-' + d.GAME_ID
    var fgPctTextClass = '.season-percentage-FG-text-' + d.GAME_ID
    var fg3PctClass = '.season-percentage-FG3-' + d.GAME_ID
    var fg3PctTextClass = '.season-percentage-FG3-text-' + d.GAME_ID
    var color = d.DIFF < 0 ? COLOR.LAKERS_BLACK : COLOR.ORANGE

    var originalColor = d3.select(rectClass).style('fill')
    if (originalColor !== 'red') {
      d3.selectAll(rectClass).style('fill', color)
    }

    d3.selectAll(textClass).style('display', 'block')
    d3.selectAll(fgPctClass)
      .attr('r', 4)
      .style('fill', COLOR.LAKERS_YELLOW)
    d3.selectAll(fgPctTextClass).style('display', 'block')
    d3.selectAll(fg3PctClass)
      .attr('r', 4)
      .style('fill', COLOR.LAKERS_YELLOW)
    d3.selectAll(fg3PctTextClass).style('display', 'block')
  }

  const doNotHighlight = function (d) {
    var rectClass = '.season-log-' + d.GAME_ID
    var textClass = '.season-log-text-' + d.GAME_ID
    var fgPctClass = '.season-percentage-FG-' + d.GAME_ID
    var fgPctTextClass = '.season-percentage-FG-text-' + d.GAME_ID
    var fg3PctClass = '.season-percentage-FG3-' + d.GAME_ID
    var fg3PctTextClass = '.season-percentage-FG3-text-' + d.GAME_ID
    var color = d.DIFF < 0 ? COLOR.DARK_GREY : COLOR.LAKERS_YELLOW

    var originalColor = d3.select(rectClass).style('fill')
    if (originalColor !== 'red') {
      d3.selectAll(rectClass).style('fill', color)
    }

    d3.selectAll(textClass).style('display', 'none')
    d3.selectAll(fgPctClass)
      .attr('r', 3)
      .style('fill', COLOR.LAKERS_PURPLE)
    d3.selectAll(fg3PctClass)
      .attr('r', 3)
      .style('fill', COLOR.RED)
    d3.selectAll(fgPctTextClass).style('display', 'none')
    d3.selectAll(fg3PctTextClass).style('display', 'none')
  }

  new Waypoint({
    element: document.getElementById('lakers-season-logs'),
    handler: function (direction) {
      if (direction === 'down') {
        var logs = seasonLogs
          .selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', d => 'season-log-' + d.GAME_ID)
          .attr('x', (d, i) => x(i))
          .attr('y', d => {
            if (d.DIFF < 0) {
              return y(0)
            }
            return y(d.DIFF)
          })

        logs
          .transition()
          .duration(1000)
          .attr('width', x.bandwidth())
          .attr('height', d => Math.abs(y(d.DIFF) - y(0)))
          .attr('fill', d => {
            if (d.DIFF < 0) {
              return COLOR.DARK_GREY
            }
            return COLOR.LAKERS_YELLOW
          })

        logs.on('mouseover', highlight).on('mouseleave', doNotHighlight)

        // draw text
        var texts = seasonLogs
          .selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('class', d => 'season-log-text-' + d.GAME_ID)
          .attr('x', (d, i) => x(i))
          .attr('y', d => {
            if (d.DIFF < 0) {
              return y(d.DIFF) + 20
            }
            return y(d.DIFF) - 8
          })

        texts
          .append('tspan')
          .attr('class', d => 'season-log-text-' + d.GAME_ID)
          .attr('dx', -20)
          .attr('dy', d => {
            if (d.DIFF < 0) return -5
            return -15
          })
          .text(d => d.MATCHUP)
          .style('font-size', '10')
          .style('text-color', COLOR.DARK_GREY)
          .style('display', 'none')

        texts
          .append('tspan')
          .attr('class', d => 'season-log-text-' + d.GAME_ID)
          .attr('dx', -45)
          .attr('dy', 15)
          .text(d => d.PTS + ':' + d.OPP_PTS)
          .style('font-size', '10')
          .style('text-color', COLOR.DARK_GREY)
          .style('display', 'none')
      }
    },
    offset: 800
  })
})
