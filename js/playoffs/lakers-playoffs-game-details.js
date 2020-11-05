// define margin and svg size
var playoffs_deatails_margin = { top: 10, bottom: 10, left: 10, right: 10 }
var playoffs_deatails_width = 200
var playoffs_deatails_labels_width = 60
var playoffs_deatails_height = 200

// create svg
var playoffs_deatails = d3
  .select('#lakers-playoffs-game-details')
  .append('svg')
  .attr(
    'width',
    playoffs_deatails_width +
      playoffs_deatails_margin.left +
      playoffs_deatails_margin.right
  )
  .attr(
    'height',
    playoffs_deatails_height +
      playoffs_deatails_margin.top +
      playoffs_deatails_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      playoffs_deatails_margin.left +
      ',' +
      playoffs_deatails_margin.top +
      ')'
  )

var playoffs_deatails_oppo = d3
  .select('#lakers-playoffs-game-details-oppo')
  .append('svg')
  .attr(
    'width',
    playoffs_deatails_width +
      playoffs_deatails_margin.left +
      playoffs_deatails_margin.right
  )
  .attr(
    'height',
    playoffs_deatails_height +
      playoffs_deatails_margin.top +
      playoffs_deatails_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      playoffs_deatails_margin.left +
      ',' +
      playoffs_deatails_margin.top +
      ')'
  )

var playoffs_deatails_labels = d3
  .select('#lakers-playoffs-game-details-labels')
  .append('svg')
  .attr(
    'width',
    playoffs_deatails_labels_width +
      playoffs_deatails_margin.left +
      playoffs_deatails_margin.right
  )
  .attr(
    'height',
    playoffs_deatails_height +
      playoffs_deatails_margin.top +
      playoffs_deatails_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      playoffs_deatails_margin.left +
      ',' +
      playoffs_deatails_margin.top +
      ')'
  )

const playoffs_details_game_stats = [
  'PTS',
  'REB',
  'AST',
  'BLK',
  'TOV',
  'FG_PCT',
  'FG3_PCT'
]

const playoffs_details_game_stats_max = [150, 70, 40, 15, 30, 1, 1]

// y scale
var playoffs_details_y = d3
  .scaleBand()
  .domain(d3.range(playoffs_details_game_stats.length))
  .range([0, playoffs_deatails_height])
  .padding(0.2)

// x scales
const playoffs_details_x_scales = []
for (var i = 0; i < playoffs_details_game_stats.length; i++) {
  playoffs_details_x_scales.push(
    d3
      .scaleLinear()
      .domain([playoffs_details_game_stats_max[i], 0])
      .range([10, playoffs_deatails_width])
  )
}

const playoffs_details_x_scales_oppo = []
for (var i = 0; i < playoffs_details_game_stats.length; i++) {
  playoffs_details_x_scales_oppo.push(
    d3
      .scaleLinear()
      .domain([0, playoffs_details_game_stats_max[i]])
      .range([0, playoffs_deatails_width - 10])
  )
}

const game_details_scales = {
  y_scale: playoffs_details_y,
  x_scales: playoffs_details_x_scales,
  x_scales_oppo: playoffs_details_x_scales_oppo
}

playoffs_deatails_labels
  .selectAll('playoffs_deatails_labels')
  .data(playoffs_details_game_stats)
  .enter()
  .append('text')
  .attr('x', 28)
  .attr('y', (d, i) => playoffs_details_y(i) * 1.02 + 14)
  .text(d => d)
  .attr('font-size', '12px')
  .style('text-anchor', 'middle')
