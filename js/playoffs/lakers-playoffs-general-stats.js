// define margin and svg size
var playoffs_general_stats_margin = { top: 10, bottom: 10, left: 30, right: 10 }
var playoffs_general_stats_width = 700
var playoffs_general_stats_height = 120

// create svg
var playoffs_general_stats = d3
  .select('#lakers-playoffs-general-stats')
  .append('svg')
  .attr(
    'width',
    playoffs_general_stats_width +
      playoffs_general_stats_margin.left +
      playoffs_general_stats_margin.right
  )
  .attr(
    'height',
    playoffs_general_stats_height +
      playoffs_general_stats_margin.top +
      playoffs_general_stats_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      playoffs_general_stats_margin.left +
      ',' +
      playoffs_general_stats_margin.top +
      ')'
  )

  d3.csv('./files/lakers_playoffs_game_logs.csv', data => {
    // mean stats
    var playoffs_avg_PTS = +(d3.mean(data, d=>+d.PTS)).toFixed(1)
    var playoffs_avg_REB = +(d3.mean(data, d=>+d.REB)).toFixed(1)
    var playoffs_avg_AST = +(d3.mean(data, d=>+d.AST)).toFixed(1)
    var playoffs_avg_BLK = +(d3.mean(data, d=>+d.BLK)).toFixed(1)
    var playoffs_avg_TOV = +(d3.mean(data, d=>+d.TOV)).toFixed(1)

    var playoffs_avg_stats = [playoffs_avg_PTS, playoffs_avg_REB, playoffs_avg_AST, playoffs_avg_BLK, playoffs_avg_TOV]
    var playoffs_avg_stats_names = ["PTS", "REB", "AST", "BLK", "TOV"]

    // x axis
    var playoffs_avg_stats_x = d3.scaleLinear()
                                .domain([0, playoffs_avg_stats.length])
                                .range([0, playoffs_general_stats_width])

    playoffs_general_stats.selectAll("playoffs-general-stats-title")
      .data(playoffs_avg_stats_names)
      .enter()
      .append("text")
      .attr("x", (d, i) => playoffs_avg_stats_x(i))
      .attr("y", 10)
      .text(d => d)
      .attr("font-size", "24px")

    playoffs_general_stats.selectAll("playoffs-general-stats-figures")
      .data(playoffs_avg_stats)
      .enter()
      .append("text")
      .attr("x", (d, i) => playoffs_avg_stats_x(i) - 5)
      .attr("y", 60)
      .text(d => d)
      .attr("font-size", "40px")

  })
