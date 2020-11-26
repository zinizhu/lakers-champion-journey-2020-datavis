// define margin and svg size
var playoffs_records_margin = { top: 10, bottom: 10, left: 10, right: 10 }
var playoffs_records_width = 540
var playoffs_records_height = 900

var playoffs_current_selected_round = 0
var playoffs_current_selected_game = 0

// create svg
var playoffs_records = d3
  .select('#lakers-playoffs-records')
  .append('svg')
  .attr(
    'width',
    playoffs_records_width +
      playoffs_records_margin.left +
      playoffs_records_margin.right
  )
  .attr(
    'height',
    playoffs_records_height +
      playoffs_records_margin.top +
      playoffs_records_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      playoffs_records_margin.left +
      ',' +
      playoffs_records_margin.top +
      ')'
  )

var lakers_playoffs_games = []
var playoffs_oppo_abbr = ['POR', 'HOU', 'DEN', 'MIA']

d3.csv('./files/lakers_playoffs_game_logs.csv', data => {
  d3.csv('./files/lakers_playoffs_opp_logs.csv', data2 => {
    // divide the data into 4 rounds
    var playoffs_oppo_teams_title = [
      'Round 1  vs Portland Trail Blazers',
      'Round 2 vs Houston Rockets',
      'West Final vs Denver Nuggests',
      'NBA Final vs Miami Heat'
    ]
    var playoffs_games = {
      POR: [],
      HOU: [],
      DEN: [],
      MIA: []
    }

    var playoffs_oppo_games = {
      POR: [],
      HOU: [],
      DEN: [],
      MIA: []
    }

    data.forEach(row => {
      var oppo_name = row.MATCHUP.substring(row.MATCHUP.length - 3)
      playoffs_games[oppo_name].push(row)
    })

    data2.forEach(row => {
      playoffs_oppo_games[row.TEAM_ABBREVIATION].push(row)
    })

    var playoffs_games_arr = [
      playoffs_games.POR,
      playoffs_games.HOU,
      playoffs_games.DEN,
      playoffs_games.MIA
    ]

    var playoffs_oppo_games_arr = [
      playoffs_oppo_games.POR,
      playoffs_oppo_games.HOU,
      playoffs_oppo_games.DEN,
      playoffs_oppo_games.MIA
    ]

    playoffs_games_arr.forEach((arr, i) => {
      arr.sort((a, b) => a.GAME_DATE.localeCompare(b.GAME_DATE))
      arr.forEach(g => (g['index'] = i))
    })

    playoffs_oppo_games_arr.forEach((arr, i) => {
      arr.sort((a, b) => a.GAME_DATE.localeCompare(b.GAME_DATE))
      arr.forEach(g => (g['index'] = i))
    })

    lakers_playoffs_games.sort((a, b) => a.GAME_DATE.localeCompare(b.GAME_DATE))

    // scale
    var playoffs_games_y = d3
      .scaleLinear()
      .range([100, playoffs_records_height - 50])
      .domain([0, playoffs_oppo_teams_title.length])

    var playoffs_games_x = d3
      .scaleLinear()
      .range([10, playoffs_records_width - 10])
      .domain([0, 6])

    // legend
    playoffs_records
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 15)
      .attr('r', 4)
      .attr('fill', COLOR.GREEN)

    playoffs_records
      .append('text')
      .attr('x', 30)
      .attr('y', 20)
      .text('WIN')
      .attr('font-size', 12)

    playoffs_records
      .append('circle')
      .attr('cx', 80)
      .attr('cy', 15)
      .attr('r', 4)
      .attr('fill', COLOR.RED)

    playoffs_records
      .append('text')
      .attr('x', 100)
      .attr('y', 20)
      .text('LOSE')
      .attr('font-size', 12)

    // for each round, draw circles
    for (var idx = 0; idx < 4; idx++) {
      playoffs_records
        .append('text')
        .attr('x', -5)
        .attr('y', playoffs_games_y(idx) - 50)
        .text(playoffs_oppo_teams_title[idx])
        .attr('font-size', '16px')

      playoffs_records
        .selectAll('playoffs-round-' + idx)
        .data(playoffs_games_arr[idx])
        .enter()
        .append('circle')
        .attr(
          'class',
          (d, i) =>
            'playoffs-round-circle playoffs-round-circle-' + idx + '-' + i
        )
        .attr('cx', (d, i) => playoffs_games_x(i))
        .attr('cy', (d, i) => playoffs_games_y(+d['index']))
        .attr('r', 14)
        .attr('fill', d => {
          if (d['WL'] == 'W') {
            return COLOR.GREEN
          }
          return COLOR.RED
        })
        .on('click', (d, i) => selectGame(+d['index'], i))
    }

    function selectGame (idx, i) {
      playoffs_current_selected_round = idx
      playoffs_current_selected_game = i

      var gamelog = playoffs_games_arr[idx][i]
      var oppGamelog = playoffs_oppo_games_arr[idx][i]
      var gameDetails = []
      var oppoGameDetails = []
      for (var j = 0; j < playoffs_details_game_stats.length; j++) {
        gameDetails.push(gamelog[playoffs_details_game_stats[j]])
      }
      for (var j = 0; j < playoffs_details_game_stats.length; j++) {
        oppoGameDetails.push(+oppGamelog[playoffs_details_game_stats[j]])
      }

      // highlight border
      playoffs_records
        .selectAll('.playoffs-round-circle')
        .attr('stroke-width', '0px')

      // highlight border
      playoffs_records
        .selectAll('.playoffs-round-circle-' + idx + '-' + i)
        .attr('stroke-width', '10px')
        .attr('stroke', COLOR.LAKERS_YELLOW)
        .attr('stroke-opacity', 0.5)

      playoffs_deatails.selectAll('.playoffs-game-details').remove()
      playoffs_deatails_oppo.selectAll('.playoffs-oppo-game-details').remove()
      playoffs_deatails.selectAll('.playoffs-game-details-text').remove()
      playoffs_deatails_oppo
        .selectAll('.playoffs-oppo-game-details-text')
        .remove()

      playoffs_deatails
        .selectAll('playoffs-game-details-texts')
        .data(gameDetails)
        .enter()
        .append('text')
        .attr('class', 'playoffs-game-details-text')
        .attr('x', (d, i) => playoffs_details_x_scales[i](+d) - 35)
        .attr('y', (d, i) => game_details_scales.y_scale(i) + 17)
        .text(d => d)
        .attr('font-size', 12)
        .attr('fill', COLOR.DARK_GREY)

      playoffs_deatails_oppo
        .selectAll('playoffs-oppo-game-details-texts')
        .data(oppoGameDetails)
        .enter()
        .append('text')
        .attr('class', 'playoffs-oppo-game-details-text')
        .attr(
          'x',
          (d, i) =>
            game_details_scales.x_scales_oppo[i](0) +
            game_details_scales.x_scales_oppo[i](d) +
            25
        )
        .attr('y', (d, i) => game_details_scales.y_scale(i) + 17)
        .text(d => d)
        .attr('font-size', 12)
        .attr('fill', COLOR.DARK_GREY)

      playoffs_deatails
        .selectAll('playoffs-game-details')
        .data(gameDetails)
        .enter()
        .append('rect')
        .attr('class', 'playoffs-game-details')
        .attr('x', (d, i) => playoffs_details_x_scales[i](+d))
        .attr('y', (d, i) => game_details_scales.y_scale(i))
        .attr(
          'width',
          (d, i) =>
            playoffs_details_x_scales[i](0) - playoffs_details_x_scales[i](d)
        )
        .attr('height', game_details_scales.y_scale.bandwidth())
        .attr('fill', (d, i) => {
          if (+d === +oppoGameDetails[i]) return COLOR.GREEN
          var playoffs_details_bar_color = COLOR.LAKERS_YELLOW
          if (
            playoffs_details_game_stats[i] === 'TOV' &&
            +d > +oppoGameDetails[i]
          ) {
            playoffs_details_bar_color = COLOR.DARK_GREY
          }
          if (
            playoffs_details_game_stats[i] != 'TOV' &&
            +d < +oppoGameDetails[i]
          ) {
            playoffs_details_bar_color = COLOR.DARK_GREY
          }
          return playoffs_details_bar_color
        })

      playoffs_deatails_oppo
        .selectAll('playoffs-oppo-game-details')
        .data(oppoGameDetails)
        .enter()
        .append('rect')
        .attr('class', 'playoffs-oppo-game-details')
        .attr('x', (d, i) => game_details_scales.x_scales_oppo[i](0))
        .attr('y', (d, i) => game_details_scales.y_scale(i))
        .attr('width', (d, i) => {
          return game_details_scales.x_scales_oppo[i](+d)
        })
        .attr('height', game_details_scales.y_scale.bandwidth())
        .attr('fill', COLOR.BLUE)

      // update player stats
      var currentGamePlayersStats =
        playoffs_players_stats_by_game[playoffs_oppo_abbr[idx]][gamelog.GAME_ID]
      var currentGamePlayersNames =
        playoffs_players_names_by_game[playoffs_oppo_abbr[idx]][gamelog.GAME_ID]

      // update select options
      d3.select('#lakers-playoffs-players-button')
        .selectAll('.playoffs-players-option')
        .remove()

      d3.select('#lakers-playoffs-players-button')
        .selectAll('option')
        .data(currentGamePlayersNames)
        .enter()
        .append('option')
        .attr('class', 'playoffs-players-option')
        .text(d => d)
        .attr('value', d => d)

      // playername
      var selected_player_name = d3
        .select('#lakers-playoffs-players-button')
        .property('value')

      var selected_player = currentGamePlayersStats.filter(
        d => d.name === selected_player_name
      )
      var selected_player_arr = selected_player[0].log

      playoffs_players.selectAll('.playoffs-player-stats-path').remove()
      playoffs_players.selectAll('.playoffs-player-stats-circle').remove()
      playoffs_players.selectAll('.playoffs-player-stats-text').remove()

      playoffs_players
        .append('path')
        .datum(selected_player_arr) // .data vs .datum: former allows multiple append, later allows 1
        .attr('class', 'playoffs-player-stats-path')
        .attr('stroke', COLOR.LAKERS_YELLOW)
        .attr('stroke-width', 2)
        .attr('fill', COLOR.LAKERS_YELLOW)
        .attr('fill-opacity', 0.3)
        .attr(
          'd',
          d3
            .line()
            .x(d => d.x)
            .y(d => d.y)
        )

      playoffs_players
        .selectAll('playoffs-player-stats-circles')
        .data(selected_player_arr)
        .enter()
        .append('circle')
        .attr('class', 'playoffs-player-stats-circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 8)
        .attr('fill', COLOR.LAKERS_YELLOW)

      playoffs_players
        .selectAll('playoffs-player-stats-texts')
        .data(selected_player_arr)
        .enter()
        .append('text')
        .attr('class', 'playoffs-player-stats-text')
        .attr('x', d => d.text_x)
        .attr('y', d => d.text_y)
        .text(d => d.stats)
        .attr('font-size', 16)
        .attr('fill', COLOR.DARK_GREY)
    }

    d3.select('#lakers-playoffs-players-button').on('change', function (d) {
      // recover the option that has been chosen
      var selected_player_name = d3.select(this).property('value')

      var gamelog =
        playoffs_games_arr[playoffs_current_selected_round][
          playoffs_current_selected_game
        ]

      var currentGamePlayersStats =
        playoffs_players_stats_by_game[
          playoffs_oppo_abbr[playoffs_current_selected_round]
        ][gamelog.GAME_ID]

      var selected_player = currentGamePlayersStats.filter(
        d => d.name === selected_player_name
      )
      var selected_player_arr = selected_player[0].log
      console.log(selected_player_arr)
      playoffs_players.selectAll('.playoffs-player-stats-path').remove()
      playoffs_players.selectAll('.playoffs-player-stats-circle').remove()
      playoffs_players.selectAll('.playoffs-player-stats-text').remove()

      playoffs_players
        .append('path')
        .datum(selected_player_arr) // .data vs .datum: former allows multiple append, later allows 1
        .attr('class', 'playoffs-player-stats-path')
        .attr('stroke', COLOR.LAKERS_YELLOW)
        .attr('stroke-width', 2)
        .attr('fill', COLOR.LAKERS_YELLOW)
        .attr('fill-opacity', 0.3)
        .attr(
          'd',
          d3
            .line()
            .x(d => d.x)
            .y(d => d.y)
        )

      playoffs_players
        .selectAll('playoffs-player-stats-circles')
        .data(selected_player_arr)
        .enter()
        .append('circle')
        .attr('class', 'playoffs-player-stats-circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 8)
        .attr('fill', COLOR.LAKERS_YELLOW)

      playoffs_players
        .selectAll('playoffs-player-stats-texts')
        .data(selected_player_arr)
        .enter()
        .append('text')
        .attr('class', 'playoffs-player-stats-text')
        .attr('x', d => d.text_x)
        .attr('y', d => d.text_y)
        .text(d => d.stats)
        .attr('font-size', 16)
        .attr('fill', COLOR.DARK_GREY)
    })

    selectGame(0, 0)
  })
})
