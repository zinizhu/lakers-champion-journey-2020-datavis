// pie charts
var vogel_pre_pie_margin = { top: 10, bottom: 10, left: 10, right: 10 }
var vogel_pre_pie_width = 200
var vogel_pre_pie_height = 200
var vogel_pre_pie_outer_radius = 75
var vogel_pre_pie_inner_radius = 60

// Compute the position of each group on the pie:
var vogel_pre_pie_scale = d3
  .pie()
  .value(function (d) {
    return d.value
  })
  .sort(null)

var vogel_pre_pie_color = [COLOR.LIGHT_GREY, COLOR.BLUE]

var vogel_pre_regular = { lose: 291, win: 304 }
var vogel_pre_playoff = { lose: 30, win: 31 }
var vogel_pre_exp = { lose: 0, win: 1 }

var vogel_pre_pie_labels = ['Regular Season', 'Playoffs', 'Experience']
var vogel_pre_pie_figures = ['51.1', '50.8', '7+']
var vogel_pre_figures_raw = [
  vogel_pre_regular,
  vogel_pre_playoff,
  vogel_pre_exp
]

var vogel_pre_figures = []
vogel_pre_figures_raw.forEach(row => {
  vogel_pre_figures.push(vogel_pre_pie_scale(d3.entries(row)))
})

var vogel_pre_pies = d3
  .select('#vogel-pre-pies')
  .selectAll('vogel-pre-pie-svg')
  .data(vogel_pre_figures)
  .enter()
  .append('svg')
  .attr(
    'width',
    vogel_pre_pie_width + vogel_pre_pie_margin.left + vogel_pre_pie_margin.right
  )
  .attr(
    'height',
    vogel_pre_pie_height +
      vogel_pre_pie_margin.top +
      vogel_pre_pie_margin.bottom
  )
  .append('g')
  .attr('class', (d, i) => 'vogel-pre-pie-' + i)
  .attr(
    'transform',
    'translate(' +
      vogel_pre_pie_width / 2 +
      ',' +
      vogel_pre_pie_height / 2 +
      ')'
  )

new Waypoint({
  element: document.getElementById('vogel-pre-pies'),
  handler: function (direction) {
    d3.select('.vogel-pre-pie-0')
      .selectAll('vogel_pre_fg_slice')
      .data(vogel_pre_figures[0])
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
            .innerRadius(vogel_pre_pie_inner_radius)
            .outerRadius(vogel_pre_pie_outer_radius)
          return arc(d)
        }
      })
      .attr('fill', (d, c) => vogel_pre_pie_color[c])
  },
  offset: 700
})

new Waypoint({
  element: document.getElementById('vogel-pre-pies'),
  handler: function (direction) {
    d3.select('.vogel-pre-pie-1')
      .selectAll('vogel_pre_fg_slice')
      .data(vogel_pre_figures[1])
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
            .innerRadius(vogel_pre_pie_inner_radius)
            .outerRadius(vogel_pre_pie_outer_radius)
          return arc(d)
        }
      })
      .attr('fill', (d, c) => vogel_pre_pie_color[c])
  },
  offset: 700
})

for (var i = 0; i < 2; i++) {
  var legend = 'win%'
  d3.select('.vogel-pre-pie-' + i)
    .append('text')
    .attr('x', -0)
    .attr('y', -17)
    .text(legend)
    .style('text-anchor', 'middle')
    .attr('font-size', '10px')

  // add figures
  d3.select('.vogel-pre-pie-' + i)
    .append('text')
    .attr('x', -0)
    .attr('y', 10)
    .text(vogel_pre_pie_figures[i])
    .style('text-anchor', 'middle')
    .attr('font-size', '24px')

  // add season
  d3.select('.vogel-pre-pie-' + i)
    .append('text')
    .attr('x', -0)
    .attr('y', 100)
    .text(vogel_pre_pie_labels[i])
    .style('text-anchor', 'middle')
    .attr('font-size', '12px')
}

d3.select('.vogel-pre-pie-' + 2)
  .append('text')
  .attr('x', -0)
  .attr('y', -17)
  .text('Years of Coaching')
  .style('text-anchor', 'middle')
  .attr('font-size', '16px')

d3.select('.vogel-pre-pie-' + 2)
  .append('text')
  .attr('x', -0)
  .attr('y', 30)
  .text(vogel_pre_pie_figures[2])
  .style('text-anchor', 'middle')
  .attr('font-size', '36px')
