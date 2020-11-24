// define margin and svg size
var small_multiples_margin = { top: 10, bottom: 10, left: 50, right: 10 }
var small_multiples_width = 500
var small_multiples_height = 600

var small_multiples_single_width = 220
var small_multiples_single_height = 130

d3.csv('./files/james_stats_summary.csv', data => {
  var small_multiples_dimensions = ['MIN', 'PTS', 'AST', 'REB', 'BLK', 'TOV']
  var small_multiples_y_scales = []
  for (var i = 0; i < small_multiples_dimensions.length; i++) {
    small_multiples_y_scales.push(
      d3
        .scaleLinear()
        .domain([0, +d3.max(data, d => +d[small_multiples_dimensions[i]])])
        .range([
          (small_multiples_single_height / 4) * 3,
          small_multiples_single_height / 4
        ])
    )
  }

  d3.select('#james-small-multiples')
    .selectAll('svg')
    .data(small_multiples_dimensions)
    .enter()
    .append('svg')
    .attr('width', small_multiples_single_width)
    .attr('height', small_multiples_single_height)
    .append('g')
    .attr('class', d => 'james-bar-' + d)
    .attr(
      'transform',
      'translate(' +
        small_multiples_margin.left +
        ',' +
        small_multiples_margin.top +
        ')'
    )

  for (var i = 0; i < small_multiples_dimensions.length; i++) {
    var dimension = small_multiples_dimensions[i]
    d3.select('.james-bar-' + dimension)
      .selectAll('james-bars-' + dimension)
      .data(data)
      .enter()
      .append('rect')
      .attr('class', d => 'player-playoffs-rect-' + d.SEASON + '-' + dimension)
      .attr('x', (d, c) => 60 * c + 10)
      .attr('y', d => small_multiples_y_scales[i](+d[dimension]))
      .attr('width', 45)
      .attr(
        'height',
        d =>
          small_multiples_y_scales[i](0) -
          small_multiples_y_scales[i](+d[dimension])
      )
      .attr('fill', (d, i) => {
        if (i === 0) {
          return COLOR.LAKERS_PURPLE
        }
        return COLOR.LIGHT_GREY
      })
      .on('mouseover', function () {
        var className = '.' + d3.select(this).attr('class')
        d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      })
      .on('mouseleave', function (d) {
        var className = '.' + d3.select(this).attr('class')
        var color =
          d.SEASON === 'playoffs' ? COLOR.LAKERS_PURPLE : COLOR.LIGHT_GREY
        d3.selectAll(className).attr('fill', color)
      })

    d3.select('.james-bar-' + dimension)
      .selectAll('james-text-' + dimension)
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d, c) => 60 * c + 23)
      .attr('y', d => small_multiples_y_scales[i](+d[dimension]) - 10)
      .attr('width', 45)
      .text(d => d[dimension])
      .attr('font-size', '12px')

    d3.select('.james-bar-' + dimension)
      .append('text')
      .attr('x', 50)
      .attr('y', small_multiples_single_height - 15)
      .text(dimension)
      .attr('font-size', '14px')
  }

  // legends
  var james_small_multiples_legends = d3
    .select('#james-small-multiples-legends')
    .append('svg')
    .attr(
      'width',
      playoffs_records_width +
        playoffs_records_margin.left +
        playoffs_records_margin.right
    )
    .attr('height', 30)
    .append('g')
    .attr(
      'transform',
      'translate(' + playoffs_records_width / 3 + ',' + 0 + ')'
    )

  james_small_multiples_legends
    .append('rect')
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', COLOR.LAKERS_PURPLE)

  james_small_multiples_legends
    .append('text')
    .attr('x', 40)
    .attr('y', 23)
    .text('Playoffs')

  james_small_multiples_legends
    .append('rect')
    .attr('x', 120)
    .attr('y', 10)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', COLOR.LIGHT_GREY)

  james_small_multiples_legends
    .append('text')
    .attr('x', 150)
    .attr('y', 23)
    .text('Regular Season')
})

// davis stats
d3.csv('./files/davis_stats_summary.csv', data => {
  var small_multiples_dimensions = ['MIN', 'PTS', 'AST', 'REB', 'BLK', 'TOV']
  var small_multiples_y_scales = []
  for (var i = 0; i < small_multiples_dimensions.length; i++) {
    small_multiples_y_scales.push(
      d3
        .scaleLinear()
        .domain([0, +d3.max(data, d => +d[small_multiples_dimensions[i]])])
        .range([
          (small_multiples_single_height / 4) * 3,
          small_multiples_single_height / 4
        ])
    )
  }

  d3.select('#davis-small-multiples')
    .selectAll('svg')
    .data(small_multiples_dimensions)
    .enter()
    .append('svg')
    .attr('width', small_multiples_single_width)
    .attr('height', small_multiples_single_height)
    .append('g')
    .attr('class', d => 'davis-bar-' + d)
    .attr(
      'transform',
      'translate(' +
        small_multiples_margin.left +
        ',' +
        small_multiples_margin.top +
        ')'
    )

  var temp = data[0]
  data[0] = data[1]
  data[1] = temp
  for (var i = 0; i < small_multiples_dimensions.length; i++) {
    var dimension = small_multiples_dimensions[i]
    d3.select('.davis-bar-' + dimension)
      .selectAll('davis-bars-' + dimension)
      .data(data)
      .enter()
      .append('rect')
      .attr('class', d => 'player-playoffs-rect-' + d.SEASON + '-' + dimension)
      .attr('x', (d, c) => 60 * c + 10)
      .attr('y', d => small_multiples_y_scales[i](+d[dimension]))
      .attr('width', 45)
      .attr(
        'height',
        d =>
          small_multiples_y_scales[i](0) -
          small_multiples_y_scales[i](+d[dimension])
      )
      .attr('fill', (d, i) => {
        if (i === 0) {
          return COLOR.LAKERS_PURPLE
        }
        return COLOR.LIGHT_GREY
      })
      .on('mouseover', function () {
        var className = '.' + d3.select(this).attr('class')
        d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      })
      .on('mouseleave', function (d) {
        var className = '.' + d3.select(this).attr('class')
        var color =
          d.SEASON === 'playoffs' ? COLOR.LAKERS_PURPLE : COLOR.LIGHT_GREY
        d3.selectAll(className).attr('fill', color)
      })

    d3.select('.davis-bar-' + dimension)
      .selectAll('davis-text-' + dimension)
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d, c) => 60 * c + 23)
      .attr('y', d => small_multiples_y_scales[i](+d[dimension]) - 10)
      .attr('width', 45)
      .text(d => d[dimension])
      .attr('font-size', '12px')

    d3.select('.davis-bar-' + dimension)
      // .selectAll('james-bar-label-' + dimension)
      .append('text')
      .attr('x', 50)
      .attr('y', small_multiples_single_height - 15)
      .text(dimension)
      .attr('font-size', '14px')
  }

  // legends
  var davis_small_multiples_legends = d3
    .select('#davis-small-multiples-legends')
    .append('svg')
    .attr(
      'width',
      playoffs_records_width +
        playoffs_records_margin.left +
        playoffs_records_margin.right
    )
    .attr('height', 30)
    .append('g')
    .attr(
      'transform',
      'translate(' + playoffs_records_width / 3 + ',' + 0 + ')'
    )

  davis_small_multiples_legends
    .append('rect')
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', COLOR.LAKERS_PURPLE)

  davis_small_multiples_legends
    .append('text')
    .attr('x', 40)
    .attr('y', 23)
    .text('Playoffs')

  davis_small_multiples_legends
    .append('rect')
    .attr('x', 120)
    .attr('y', 10)
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', COLOR.LIGHT_GREY)

  davis_small_multiples_legends
    .append('text')
    .attr('x', 150)
    .attr('y', 23)
    .text('Regular Season')
})
