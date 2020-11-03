// define margin and svg size
var season_summary_margin = { top: 30, bottom: 20, left: 100, right: 10 }
var season_summary_width = 700
var season_summary_height = 380

// create svg
var seasonPlayersSummary = d3
  .select('#lakers-players-summary')
  .append('svg')
  .attr('width', season_summary_width + season_summary_margin.left + season_summary_margin.right)
  .attr('height', season_summary_height + season_summary_margin.top + season_summary_margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + season_summary_margin.left + ',' + season_summary_margin.top + ')')

d3.csv(('./files/lakers_players_performance.csv'), data => {
  
  var lakers_players_performance = []
  var player_names = []
  data.forEach(row => {
    var total_games = +row.W + +row.L
    lakers_players_performance.push({
      'name': row.PLAYER_NAME,
      'PTS': +(row.PTS / total_games).toFixed(2),
      'REB': +(row.REB / total_games).toFixed(2),
      'AST': +(row.AST / total_games).toFixed(2),
      'STL': +(row.STL / total_games).toFixed(2),
      'TOV': +(row.TOV / total_games).toFixed(2)
    })
    player_names.push(row.PLAYER_NAME)
  });

  console.log(lakers_players_performance)

  // dimensions
  lakers_players_performance_dimensions = ['PTS', 'REB', 'AST', 'STL', 'TOV']
  metricsMinValues = []
  metricsMaxValues = []
  for (var i = 0; i < lakers_players_performance_dimensions.length; i++) {
    metricsMinValues.push(d3.min(lakers_players_performance, d => d[lakers_players_performance_dimensions[i]]))
    metricsMaxValues.push(d3.max(lakers_players_performance, d => d[lakers_players_performance_dimensions[i]]))
  }
  console.log(metricsMinValues, metricsMaxValues)

  // for each dimension build a linear scale
  var lakers_players_performance_y = {}
  for (var i in lakers_players_performance_dimensions) {
    metric = lakers_players_performance_dimensions[i]
    lakers_players_performance_y[metric] = d3.scaleLinear()
                  .domain([metricsMinValues[i], metricsMaxValues[i]])
                  .range([season_summary_height, 0])
  }

  // x scale
  var lakers_players_performance_x = d3
                                      .scalePoint()
                                      .range([0, season_summary_width])
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
    .attr('y', -5)
    .text(d => d)
    .style('fill', 'black')
    .style('font-size', '10px')

})