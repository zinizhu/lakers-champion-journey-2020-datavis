// pie charts

var davis_pre_pie_margin = { top: 10, bottom: 10, left: 10, right: 10 }
var davis_pre_pie_width = 200
var davis_pre_pie_height = 200
var davis_pre_pie_outer_radius = 75
var davis_pre_pie_inner_radius = 60

// Compute the position of each group on the pie:
var davis_pre_pie_scale = d3
  .pie()
  .value(function (d) {
    return d.value
  })
  .sort(null)

var davis_pre_pie_color = [COLOR.LAKERS_YELLOW_OP, COLOR.LAKERS_PURPLE]

var davis_pre_fg = { miss: 0.467, made: 0.533 }
var davis_pre_fg3 = { miss: 0.686, made: 0.314 }
var davis_pre_ft = { miss: 0.205, made: 0.795 }
var davis_pre_2k = { miss: 0.6, made: 94 }
var davis_pre_pie_labels = ['FG%', 'FG3%', 'FT%', '2K Rating']
var davis_pre_pie_figures = ['53.3', '31.4', '79.5', '94']
var datas_pre_figures_raw = [
  davis_pre_fg,
  davis_pre_fg3,
  davis_pre_ft,
  davis_pre_2k
]
var datas_pre_figures = []
datas_pre_figures_raw.forEach(row => {
  datas_pre_figures.push(davis_pre_pie_scale(d3.entries(row)))
})

var davis_pre_pies = d3
  .select('#davis-pre-pies')
  .selectAll('davis-pre-pie-svg')
  .data(datas_pre_figures)
  .enter()
  .append('svg')
  .attr(
    'width',
    davis_pre_pie_width + davis_pre_pie_margin.left + davis_pre_pie_margin.right
  )
  .attr(
    'height',
    davis_pre_pie_height +
      davis_pre_pie_margin.top +
      davis_pre_pie_margin.bottom
  )
  .append('g')
  .attr('class', (d, i) => 'davis-pre-pie-' + i)
  .attr(
    'transform',
    'translate(' +
      davis_pre_pie_width / 2 +
      ',' +
      davis_pre_pie_height / 2 +
      ')'
  )

new Waypoint({
  element: document.getElementById('davis-pre-stats-small-multiples'),
  handler: function (direction) {
    for (var j = 0; j < 4; j++) {
      d3.select('.davis-pre-pie-' + j)
        .selectAll('davis_pre_fg_slice')
        .data(datas_pre_figures[j])
        .enter()
        .append('path')
        .transition()
        .delay(function (d, i) {
          return i * 500
        })
        .duration(500)
        .attrTween('d', function (d) {
          var i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
          return function (t) {
            d.endAngle = i(t)
            var arc = d3
              .arc()
              .innerRadius(davis_pre_pie_inner_radius)
              .outerRadius(davis_pre_pie_outer_radius)
            return arc(d)
          }
        })
        .attr('fill', (d, c) => davis_pre_pie_color[c])
    }
  },
  offset: 800
})

for (var i = 0; i < 4; i++) {
  d3.select('.davis-pre-pie-' + i)
    .append('text')
    .attr('x', -0)
    .attr('y', -17)
    .text(davis_pre_pie_labels[i])
    .style('text-anchor', 'middle')
    .attr('font-size', '10px')

  // add figures
  d3.select('.davis-pre-pie-' + i)
    .append('text')
    .attr('x', -0)
    .attr('y', 10)
    .text(davis_pre_pie_figures[i])
    .style('text-anchor', 'middle')
    .attr('font-size', '24px')
}

// define margin and svg size
var davis_pre_stats_margin = { top: 10, bottom: 30, left: 20, right: 40 }
var davis_pre_stats_single_width = 200
var davis_pre_stats_single_height = 180

// small multiples stats
d3.csv('./files/davis-pre-la-career.csv', data => {
  var davis_pre_stats_dimensions = ['PTS', 'REB', 'BLK', 'FG']
  var davis_pre_stats_years = []
  data.forEach(row => {
    row.PTS = +row['PTS']
    row.REB = +row['DRB'] + +row['ORB']
    row.BLK = +row['BLK']
    row['FG'] = +row['FG%']
    davis_pre_stats_years.push(
      row['Season'].substring(row['Season'].length - 5)
    )
  })

  // create scales
  var davis_pre_stats_x = d3
    .scaleBand()
    .range([0, davis_pre_stats_single_width])
    .domain(davis_pre_stats_years)
    .padding(0.1)
  var davis_pre_stats_y = []
  for (var i = 0; i < davis_pre_stats_dimensions.length; i++) {
    var dimension = davis_pre_stats_dimensions[i]
    if (dimension === 'FG') {
      davis_pre_stats_y.push(
        d3
          .scaleLinear()
          .range([davis_pre_stats_single_height, 0])
          .domain([0, 1])
      )
    } else {
      davis_pre_stats_y.push(
        d3
          .scaleLinear()
          .range([davis_pre_stats_single_height, 0])
          .domain([0, d3.max(data, d => d[dimension]) * 1.2])
      )
    }
  }

  // create small multiples
  d3.select('#davis-pre-stats-small-multiples')
    .selectAll('davis-pre-svg')
    .data(davis_pre_stats_dimensions)
    .enter()
    .append('svg')
    .attr(
      'width',
      davis_pre_stats_single_width +
        davis_pre_stats_margin.left +
        davis_pre_stats_margin.right
    )
    .attr(
      'height',
      davis_pre_stats_single_height +
        davis_pre_stats_margin.top +
        davis_pre_stats_margin.bottom
    )
    .append('g')
    .attr('class', d => 'davis-pre-' + d)
    .attr(
      'transform',
      'translate(' +
        davis_pre_stats_margin.left +
        ',' +
        davis_pre_stats_margin.top +
        ')'
    )

  var davis_pre_stats_colors = [
    COLOR.LAKERS_YELLOW,
    COLOR.BLUE,
    COLOR.RED,
    COLOR.GREEN
  ]

  new Waypoint({
    element: document.getElementById('davis-pre-stats-small-multiples'),
    handler: function (direction) {
      for (var j = 0; j < 4; j++) {
        var dimension = davis_pre_stats_dimensions[j]
        var currPath = d3
          .select('.davis-pre-' + dimension)
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', davis_pre_stats_colors[j])
          .attr('stroke-width', 2)
          .attr(
            'd',
            d3
              .line()
              .x(
                d =>
                  davis_pre_stats_x(
                    d['Season'].substring(d['Season'].length - 5)
                  ) +
                  davis_pre_stats_x.bandwidth() / 2
              )
              .y(d => davis_pre_stats_y[j](d[dimension]))
          )

        var len = currPath.node().getTotalLength()

        currPath
          .attr('stroke-dasharray', len + ' ' + len)
          .attr('stroke-dashoffset', len)
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
      }
    },
    offset: 800
  })

  for (var i = 0; i < davis_pre_stats_dimensions.length; i++) {
    var dimension = davis_pre_stats_dimensions[i]
    d3.select('.davis-pre-' + dimension)
      .append('g')
      .call(
        d3
          .axisLeft(davis_pre_stats_y[i])
          .ticks(5)
          .tickSize(2)
      )

    d3.select('.davis-pre-' + dimension)
      .append('g')
      .attr('transform', 'translate(0, ' + davis_pre_stats_single_height + ')')
      .call(
        d3
          .axisBottom(davis_pre_stats_x)
          .ticks(5)
          .tickSize(2)
      )

    // add lines
    d3.select('.davis-pre-' + dimension)
      .selectAll('davis-pre-stats-line-' + dimension)
      .data(data)
      .enter()
      .append('line')
      .attr('class', d => 'davis-pre-line-circle-' + d['Season'])
      .style('stroke', COLOR.LIGHT_GREY)
      .style('stroke-width', 1)
      .attr(
        'x1',
        d =>
          davis_pre_stats_x(d['Season'].substring(d['Season'].length - 5)) +
          davis_pre_stats_x.bandwidth() / 2
      )
      .attr('y1', 0)
      .attr(
        'x2',
        d =>
          davis_pre_stats_x(d['Season'].substring(d['Season'].length - 5)) +
          davis_pre_stats_x.bandwidth() / 2
      )
      .attr('y2', davis_pre_stats_single_height)
      .attr('display', 'none')

    // add circles
    d3.select('.davis-pre-' + dimension)
      .selectAll('davis-pre-stats-circle-' + dimension)
      .data(data)
      .enter()
      .append('circle')
      .attr('class', d => 'davis-pre-line-circle-' + i)
      .attr(
        'cx',
        d =>
          davis_pre_stats_x(d['Season'].substring(d['Season'].length - 5)) +
          davis_pre_stats_x.bandwidth() / 2
      )
      .attr('cy', d => davis_pre_stats_y[i](d[dimension]))
      .attr('r', 4)
      .attr('fill', davis_pre_stats_colors[i])
      .on('mouseover', function (d) {
        var className = d3.select(this).attr('class')
        var len = d3.select(this).attr('class').length
        var lineClassName =
          '.' +
          d3
            .select(this)
            .attr('class')
            .substring(0, len - 1) +
          d['Season']
        var index = +className.substring(className.length - 1)
        var textClass =
          '.davis-pre-text-' +
          d['Season'].substring(d['Season'].length - 5)
        d3.selectAll(this).attr('fill', COLOR.LAKERS_PURPLE)
        d3.selectAll(textClass).attr('display', 'block')
        d3.selectAll(lineClassName).attr('display', 'block')
      })
      .on('mouseleave', function (d) {
        var className = d3.select(this).attr('class')
        var index = +className.substring(className.length - 1)
        var len = d3.select(this).attr('class').length
        var lineClassName =
          '.' +
          d3
            .select(this)
            .attr('class')
            .substring(0, len - 1) +
          d['Season']
        var textClass =
          '.davis-pre-text-' +
          d['Season'].substring(d['Season'].length - 5)
        d3.selectAll(this).attr('fill', davis_pre_stats_colors[index])
        d3.selectAll(textClass).attr('display', 'none')
        d3.selectAll(lineClassName).attr('display', 'none')
      })

    // add text
    d3.select('.davis-pre-' + dimension)
      .selectAll('davis-pre-text-' + dimension)
      .data(data)
      .enter()
      .append('text')
      .attr(
        'class',
        d =>
          'davis-pre-text-' +
          d['Season'].substring(d['Season'].length - 5)
      )
      .attr(
        'x',
        d =>
          davis_pre_stats_x(d['Season'].substring(d['Season'].length - 5)) +
          davis_pre_stats_x.bandwidth() / 2 -
          12
      )
      .attr('y', d => davis_pre_stats_y[i](d[dimension]) - 20)
      .text(d => {
        if (dimension === 'FG') {
          return (d[dimension] * 100).toFixed(2) + '%'
        }
        return d[dimension]
      })
      .attr('display', 'none')

    // add labels
    d3.select('.davis-pre-' + dimension)
      .append('text')
      .attr('x', davis_pre_stats_single_width / 2 - 20)
      .attr('y', davis_pre_stats_single_height + 30)
      .text(d => {
        if (d === 'FG') {
          return 'FG%'
        }
        return d
      })
      .attr('font-size', '12px')
  }
})
