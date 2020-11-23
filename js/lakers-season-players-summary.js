// define margin and svg size
var season_summary_margin = { top: 100, bottom: 20, left: 100, right: 100 }
var season_summary_width = 900
var season_summary_height = 500

// create svg
var seasonPlayersSummary = d3
  .select('#lakers-players-summary')
  .append('svg')
  .attr(
    'width',
    season_summary_width +
      season_summary_margin.left +
      season_summary_margin.right
  )
  .attr(
    'height',
    season_summary_height +
      season_summary_margin.top +
      season_summary_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      season_summary_margin.left +
      ',' +
      season_summary_margin.top +
      ')'
  )

d3.csv('./files/lakers_players_performance.csv', data => {
  var lakers_players_performance = []
  var player_names = []
  data.forEach(row => {
    var total_games = +row.W + +row.L
    lakers_players_performance.push({
      name: row.PLAYER_NAME,
      PTS: +(row.PTS / total_games).toFixed(2),
      REB: +(row.REB / total_games).toFixed(2),
      AST: +(row.AST / total_games).toFixed(2),
      STL: +(row.STL / total_games).toFixed(2),
      TOV: +(row.TOV / total_games).toFixed(2)
    })
    player_names.push(row.PLAYER_NAME)
  })

  // console.log(lakers_players_performance)

  // hardcode colors.
  first_team = [
    'LeBron James',
    'Anthony Davis',
    'Danny Green',
    'Avery Bradley',
    'JaVale McGee'
  ]
  second_team = [
    'Kentavious Caldwell-Pope',
    'Alex Caruso',
    'Dwight Howard',
    'Kyle Kuzma',
    'Rajon Rondo'
  ]
  third_team = [
    'Dion Waiters',
    'JR Smith',
    'Jared Dudley',
    'Markieff Morris',
    'Quinn Cook',
    'Troy Daniels'
  ]
  fourth_team = [
    'Devontae Cacok',
    'Kostas Antetokounmpo',
    'Talen Horton-Tucker',
    'Zach Norvell Jr.'
  ]

  var lakers_players_performance_colors = [
    COLOR.LAKERS_YELLOW,
    COLOR.RED,
    COLOR.GREEN,
    COLOR.BLUE
  ]

  // dimensions
  lakers_players_performance_dimensions = ['PTS', 'REB', 'AST', 'STL', 'TOV']
  metricsMinValues = []
  metricsMaxValues = []
  for (var i = 0; i < lakers_players_performance_dimensions.length; i++) {
    metricsMinValues.push(
      d3.min(
        lakers_players_performance,
        d => d[lakers_players_performance_dimensions[i]]
      )
    )
    metricsMaxValues.push(
      d3.max(
        lakers_players_performance,
        d => d[lakers_players_performance_dimensions[i]]
      )
    )
  }
  // console.log(metricsMinValues, metricsMaxValues)

  // for each dimension build a linear scale
  var lakers_players_performance_y = {}
  for (var i in lakers_players_performance_dimensions) {
    metric = lakers_players_performance_dimensions[i]
    lakers_players_performance_y[metric] = d3
      .scaleLinear()
      .domain([metricsMinValues[i], metricsMaxValues[i]])
      .range([season_summary_height, 30])
  }

  // x scale
  var lakers_players_performance_x = d3
    .scalePoint()
    .range([0, season_summary_width * 0.75])
    .domain(lakers_players_performance_dimensions)

  // draw axis
  seasonPlayersSummary
    .selectAll('lakers-players-summary-yaxis')
    .data(lakers_players_performance_dimensions)
    .enter()
    .append('g')
    .attr('class', 'lakers-players-summary-yaxis')
    .attr('transform', function (d) {
      return 'translate(' + lakers_players_performance_x(d) + ', 0)'
    })
    .each(function (d) {
      d3.select(this).call(
        d3
          .axisLeft()
          .ticks(5)
          .scale(lakers_players_performance_y[d])
      )
    })
    .attr('font-size', '10px')
    .append('text')
    .style('text-anchor', 'middle')
    .attr('y', 22)
    .text(d => d)
    .style('fill', 'black')
    .style('font-size', '10px')

  function path (d) {
    return d3.line()(
      lakers_players_performance_dimensions.map(function (p) {
        return [
          lakers_players_performance_x(p),
          lakers_players_performance_y[p](d[p])
        ]
      })
    )
  }

  // on hover
  const lakers_players_summary_highlight = function (d) {
    var pathClass = '.lakers-players-summary-' + d.name.split(' ')[0]
    var playerClass = '.lakers-players-summary-name'
    var ptsClass = '.lakers-players-summary-PTS'
    var rebClass = '.lakers-players-summary-REB'
    var astClass = '.lakers-players-summary-AST'
    var stlClass = '.lakers-players-summary-STL'
    var tovClass = '.lakers-players-summary-TOV'

    d3.selectAll(pathClass)
      .style('stroke-width', '3px')
      .style('opacity', '1')
    d3.selectAll(playerClass).text(d.name)
    d3.selectAll(ptsClass).text(d.PTS)
    d3.selectAll(rebClass).text(d.REB)
    d3.selectAll(astClass).text(d.AST)
    d3.selectAll(stlClass).text(d.STL)
    d3.selectAll(tovClass).text(d.TOV)
  }

  const lakers_players_summary_doNotHighlight = function (d) {
    var pathClass = '.lakers-players-summary-' + d.name.split(' ')[0]
    d3.selectAll(pathClass)
      .style('stroke-width', '1px')
      .style('opacity', '0.6')
  }

  // draw path
  seasonPlayersSummary
    .selectAll('lakers-players-summary-path')
    .data(lakers_players_performance)
    .enter()
    .append('path')
    .attr('class', d => 'lakers-players-summary-' + d.name.split(' ')[0])
    .attr('d', path)
    .style('fill', 'none')
    .style('opacity', '0.6')
    .style('stroke', d => {
      if (first_team.includes(d.name)) {
        return lakers_players_performance_colors[0]
      } else if (second_team.includes(d.name)) {
        return lakers_players_performance_colors[1]
      } else if (third_team.includes(d.name)) {
        return lakers_players_performance_colors[2]
      } else if (fourth_team.includes(d.name)) {
        return lakers_players_performance_colors[3]
      }
      return 'black'
    })
    .style('stroke-width', '1px')
    .on('mouseover', lakers_players_summary_highlight)
    .on('mouseleave', lakers_players_summary_doNotHighlight)

  // add hovering text
  seasonPlayersSummary
    .append('text')
    .attr('x', -55)
    .attr('y', -10)
    .text('Player: ')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('x', 240)
    .attr('y', -10)
    .text('PTS: ')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('x', 350)
    .attr('y', -10)
    .text('REB: ')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('x', 460)
    .attr('y', -10)
    .text('AST: ')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('x', 570)
    .attr('y', -10)
    .text('STL: ')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('x', 680)
    .attr('y', -10)
    .text('TOV: ')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('class', 'lakers-players-summary-name')
    .attr('x', 10)
    .attr('y', -10)
    .text('-.-')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('class', 'lakers-players-summary-PTS')
    .attr('x', 290)
    .attr('y', -10)
    .text('-.-')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('class', 'lakers-players-summary-REB')
    .attr('x', 400)
    .attr('y', -10)
    .text('-.-')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('class', 'lakers-players-summary-AST')
    .attr('x', 510)
    .attr('y', -10)
    .text('-.-')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('class', 'lakers-players-summary-STL')
    .attr('x', 620)
    .attr('y', -10)
    .text('-.-')
    .attr('font-size', 20)

  seasonPlayersSummary
    .append('text')
    .attr('class', 'lakers-players-summary-TOV')
    .attr('x', 730)
    .attr('y', -10)
    .text('-.-')
    .attr('font-size', 20)

  // add legends
  var lakers_players_legends = seasonPlayersSummary
    .append('g')
    .attr(
      'transform',
      'translate(' + season_summary_width * 0.78 + ', ' + 0 + ')'
    )

  lakers_players_legends
    .append('circle')
    .attr('cx', 10)
    .attr('cy', season_summary_height / 3)
    .attr('r', 4)
    .attr('fill', lakers_players_performance_colors[0])

  lakers_players_legends
    .append('text')
    .attr('x', 20)
    .attr('y', season_summary_height / 3 + 5)
    .text('starting five')

  lakers_players_legends
    .append('circle')
    .attr('cx', 10)
    .attr('cy', season_summary_height / 3 + 20)
    .attr('r', 4)
    .attr('fill', lakers_players_performance_colors[1])

  lakers_players_legends
    .append('text')
    .attr('x', 20)
    .attr('y', season_summary_height / 3 + 25)
    .text('bench players')

  lakers_players_legends
    .append('circle')
    .attr('cx', 10)
    .attr('cy', season_summary_height / 3 + 40)
    .attr('r', 4)
    .attr('fill', lakers_players_performance_colors[2])

  lakers_players_legends
    .append('text')
    .attr('x', 20)
    .attr('y', season_summary_height / 3 + 45)
    .text('third team')

  lakers_players_legends
    .append('circle')
    .attr('cx', 10)
    .attr('cy', season_summary_height / 3 + 60)
    .attr('r', 4)
    .attr('fill', lakers_players_performance_colors[3])

  lakers_players_legends
    .append('text')
    .attr('x', 20)
    .attr('y', season_summary_height / 3 + 65)
    .text('fourth team')
})
