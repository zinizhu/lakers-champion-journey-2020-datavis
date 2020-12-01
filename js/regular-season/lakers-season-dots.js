// define margin and svg size
var season_dots_margin = { top: 10, bottom: 20, left: 20, right: 10 }
var season_dots_width = 200
var season_dots_height = 400

// create svg
var seasonPTSDots = d3
  .select('#lakers-season-pts-dots')
  .append('svg')
  .attr(
    'width',
    season_dots_width + season_dots_margin.left + season_dots_margin.right
  )
  .attr(
    'height',
    season_dots_height + season_dots_margin.top + season_dots_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' + season_dots_margin.left + ',' + season_dots_margin.top + ')'
  )

// read all team's logs
var all_teams_regular_logs = {}
d3.csv('./files/all_game_logs.csv', data => {
  data.forEach(row => {
    if (!(row.TEAM_ABBREVIATION in all_teams_regular_logs)) {
      all_teams_regular_logs[row.TEAM_ABBREVIATION] = []
    }
    all_teams_regular_logs[row.TEAM_ABBREVIATION].push({
      wl: row.WL,
      PTS: +row.PTS,
      id: row.GAME_ID
    })
  })
})

var seasonPTSDots_random = d3.randomUniform(30, season_dots_width - 30)
var seasonPTSDots_x
var seasonPTSDots_y

// read data
d3.csv('./files/lakers_game_logs.csv', data => {
  var lakersAllGames = []
  data.forEach(row => {
    lakersAllGames.push({ wl: row.WL, PTS: +row.PTS, id: row.GAME_ID })
  })

  // axis
  seasonPTSDots_x = d3
    .scaleLinear()
    .domain([0, season_dots_width])
    .range([0, season_dots_width])
  seasonPTSDots_y = d3
    .scaleLinear()
    .domain([
      // d3.min(lakersAllGames, d => d.PTS) * 0.95,
      // d3.max(lakersAllGames, d => d.PTS)
      60,
      160
    ])
    .range([season_dots_height, 50])

  // add title and legends
  seasonPTSDots
    .append('text')
    .attr('class', 'all-team-dots-legend')
    .attr('x', 0)
    .attr('y', 30)
    .text('LAL PPG')

  seasonPTSDots
    .append('circle')
    .attr('cx', 100)
    .attr('cy', 25)
    .attr('r', 4)
    .attr('fill', COLOR.LAKERS_PURPLE)

  seasonPTSDots
    .append('text')
    .attr('x', 110)
    .attr('y', 30)
    .text('WIN')

  seasonPTSDots
    .append('circle')
    .attr('cx', 160)
    .attr('cy', 25)
    .attr('r', 4)
    .attr('fill', COLOR.RED)

  seasonPTSDots
    .append('text')
    .attr('x', 170)
    .attr('y', 30)
    .text('LOSE')

  // draw axis
  seasonPTSDots.append('g').call(d3.axisLeft(seasonPTSDots_y).tickSize(2))
  seasonPTSDots
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + season_dots_height + ')')
    .call(
      d3
        .axisBottom(seasonPTSDots_x)
        .tickSize(0)
        .tickValues([])
    )

  // draw points
  seasonPTSDots
    .selectAll('lakers-game-dots')
    .data(lakersAllGames)
    .enter()
    .append('circle')
    .attr('class', d => 'lakers-game-dots lakers-season-pts-' + d.id)
    .attr('cx', d => {
      return seasonPTSDots_random()
    })
    .attr('cy', d => seasonPTSDots_y(d.PTS))
    .attr('r', 4)
    .attr('fill', d => {
      if (d.wl === 'W') {
        return COLOR.LAKERS_PURPLE
      }
      return COLOR.RED
    })
})
