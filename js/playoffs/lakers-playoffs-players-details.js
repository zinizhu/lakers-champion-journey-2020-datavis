// define margin and svg size
var playoffs_players_margin = { top: 10, bottom: 10, left: 10, right: 100 }
var playoffs_players_width = 500
var playoffs_players_height = 500
var playoffs_players_axis_length = 180
var playoffs_players_ceter_x = 250
var playoffs_players_ceter_y = 250

// create svg
var playoffs_players = d3
  .select('#lakers-playoffs-players-stats')
  .append('svg')
  .attr(
    'width',
    playoffs_players_width +
      playoffs_players_margin.left +
      playoffs_players_margin.right
  )
  .attr(
    'height',
    playoffs_players_height +
      playoffs_players_margin.top +
      playoffs_players_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      playoffs_players_margin.left +
      ',' +
      playoffs_players_margin.top +
      ')'
  )

var playoffs_players_stats_by_game = { POR: {}, HOU: {}, DEN: {}, MIA: {} }
var playoffs_players_names_by_game = { POR: {}, HOU: {}, DEN: {}, MIA: {} }

d3.csv('./files/lakers_playoffs_players_logs.csv', data => {
  // generate axes
  var playoffs_players_axis_end = []
  var playoffs_players_label_end = []
  var playoffs_players_stats_dimension = [
    'AST',
    'BLK',
    'FG_PCT',
    'FG3_PCT',
    'PTS',
    'REB'
  ]
  for (var i = 0; i < 6; i++) {
    var arc = ((2 * Math.PI) / 6) * i
    playoffs_players_axis_end.push({
      x:
        Math.cos(arc) * playoffs_players_axis_length + playoffs_players_ceter_x,
      y: Math.sin(arc) * playoffs_players_axis_length + playoffs_players_ceter_y
    })
    playoffs_players_label_end.push({
      x:
        Math.cos(arc) * playoffs_players_axis_length * 1.2 +
        playoffs_players_ceter_x -
        15,
      y:
        Math.sin(arc) * playoffs_players_axis_length * 1.2 +
        playoffs_players_ceter_y +
        3
    })
  }

  playoffs_players
    .selectAll('playoffs-players-axis')
    .data(playoffs_players_axis_end)
    .enter()
    .append('line')
    .attr('x1', playoffs_players_ceter_x)
    .attr('y1', playoffs_players_ceter_y)
    .attr('x2', d => d.x)
    .attr('y2', d => d.y)
    .attr('stroke', COLOR.LIGHT_GREY)

  // generate levels
  var playoffs_players_level_radius = [
    playoffs_players_axis_length,
    (playoffs_players_axis_length / 3) * 2,
    playoffs_players_axis_length / 3
  ]
  playoffs_players
    .selectAll('playoffs-players-level')
    .data(playoffs_players_level_radius)
    .enter()
    .append('circle')
    .attr('cx', playoffs_players_ceter_x)
    .attr('cy', playoffs_players_ceter_y)
    .attr('r', d => d)
    .attr('stroke', COLOR.LIGHT_GREY)
    .attr('fill', 'none')

  // generate scales for all axes
  var playoffs_players_stats_scales_x = []
  var playoffs_players_stats_scales_y = []
  var playoffs_players_stats_scales_max = [20, 10, 1, 1, 50, 20]
  for (var i = 0; i < playoffs_players_stats_dimension.length; i++) {
    playoffs_players_stats_scales_x.push(
      d3
        .scaleLinear()
        .domain([0, playoffs_players_stats_scales_max[i]])
        .range([playoffs_players_ceter_x, playoffs_players_axis_end[i].x])
    )
    playoffs_players_stats_scales_y.push(
      d3
        .scaleLinear()
        .domain([0, playoffs_players_stats_scales_max[i]])
        .range([playoffs_players_ceter_y, playoffs_players_axis_end[i].y])
    )
  }

  // generate labels
  playoffs_players
    .selectAll('playoffs-players-labels')
    .data(playoffs_players_label_end)
    .enter()
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .text((d, i) => {
      var t = playoffs_players_stats_dimension[i]
      if (t === 'FG_PCT') {
        return 'FG%'
      } else if (t === 'FG3_PCT') {
        return 'FG3%'
      }
      return t
    })

  // for each game log, generate a path
  var playoffs_players_game_logs = []
  var player_names_set = new Set()

  data.forEach(row => {
    player_names_set.add(row.Name)
    var game_id = row.Game_ID
    var oppo_team = row.MATCHUP.substring(row.MATCHUP.length - 3)
    var game_name = row.Name + '-' + row.Game_ID
    var current_game_log_arr = []
    for (var i = 0; i < playoffs_players_stats_dimension.length + 1; i++) {
      var j = i % playoffs_players_stats_dimension.length
      var stat = +row[playoffs_players_stats_dimension[j]]
      current_game_log_arr.push({
        x: playoffs_players_stats_scales_x[j](stat),
        y: playoffs_players_stats_scales_y[j](stat),
        text_x: playoffs_players_stats_scales_x[j](
          Math.min(
            stat + playoffs_players_stats_scales_max[i % 6] / 8,
            playoffs_players_stats_scales_max[i % 6]
          )
        ),
        text_y: playoffs_players_stats_scales_y[j](
          Math.min(
            stat + playoffs_players_stats_scales_max[i % 6] / 8,
            playoffs_players_stats_scales_max[i % 6]
          )
        ),
        stats: stat
      })
    }

    playoffs_players_game_logs.push({
      game: game_name,
      log: current_game_log_arr
    })

    if (!(oppo_team in playoffs_players_stats_by_game)) {
      playoffs_players_stats_by_game[oppo_team] = {}
    }
    if (!(game_id in playoffs_players_stats_by_game[oppo_team])) {
      playoffs_players_stats_by_game[oppo_team][game_id] = []
    }
    playoffs_players_stats_by_game[oppo_team][game_id].push({
      name: row.Name,
      log: current_game_log_arr
    })

    if (!(oppo_team in playoffs_players_names_by_game)) {
      playoffs_players_names_by_game[oppo_team] = {}
    }
    if (!(game_id in playoffs_players_names_by_game[oppo_team])) {
      playoffs_players_names_by_game[oppo_team][game_id] = []
    }
    playoffs_players_names_by_game[oppo_team][game_id].push(row.Name)
  })
})
