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

var vogel_pre_pie_labels = ['Regular Season', 'Playoffs']
var vogel_pre_pie_figures = ['51.1', '50.8']
var vogel_pre_figures_raw = [
  vogel_pre_regular,
  vogel_pre_playoff
]
var vogel_pre_figures = []
vogel_pre_figures_raw.forEach(row => {
  vogel_pre_figures.push(vogel_pre_pie_scale(d3.entries(row)))
})
console.log(vogel_pre_figures)

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
    'translate(' + vogel_pre_pie_width / 2 + ',' + vogel_pre_pie_height / 2 + ')'
  )

for (var i = 0; i < 2; i++) {
  d3.select('.vogel-pre-pie-' + i)
    .selectAll('vogel_pre_fg_slice')
    .data(vogel_pre_figures[i])
    .enter()
    .append('path')
    .attr(
      'd',
      d3
        .arc()
        .innerRadius(vogel_pre_pie_inner_radius)
        .outerRadius(vogel_pre_pie_outer_radius)
    )
    .attr('fill', (d, c) => vogel_pre_pie_color[c])

    d3.select('.vogel-pre-pie-' + i)
    .append('text')
    .attr('x', -0)
    .attr('y', -17)
    .text('win%')
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
    .attr('y', 90)
    .text(vogel_pre_pie_labels[i])
    .style('text-anchor', 'middle')
    .attr('font-size', '12px')
   
}