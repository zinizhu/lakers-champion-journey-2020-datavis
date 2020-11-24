var shooting_dist_margin = { top: 10, bottom: 30, left: 30, right: 30 }
var shooting_dist_width = 220
var shooting_dist_height = 220

var james_shooting_dist_svg = d3
  .select('#james-shooting-dist')
  .append('svg')
  .attr(
    'width',
    shooting_dist_width + shooting_dist_margin.left + shooting_dist_margin.right
  )
  .attr(
    'height',
    shooting_dist_height +
      shooting_dist_margin.top +
      shooting_dist_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      shooting_dist_margin.left +
      ',' +
      shooting_dist_margin.top +
      ')'
  )

var davis_shooting_dist_svg = d3
  .select('#davis-shooting-dist')
  .append('svg')
  .attr(
    'width',
    shooting_dist_width + shooting_dist_margin.left + shooting_dist_margin.right
  )
  .attr(
    'height',
    shooting_dist_height +
      shooting_dist_margin.top +
      shooting_dist_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      shooting_dist_margin.left +
      ',' +
      shooting_dist_margin.top +
      ')'
  )

d3.csv('./files/james_davis_shooting_dist.csv', data => {
  var james_shooting_dist = []
  var davis_shooting_dist = []
  var shooting_dist_dimensions = []
  data.forEach(row => {
    if (row.name === 'James') {
      james_shooting_dist.push(row)
      shooting_dist_dimensions.push(row.type)
    } else {
      davis_shooting_dist.push(row)
    }
  })
  // console.log(james_shooting_dist)

  // create scale
  var shooting_dist_x = d3
    .scaleBand()
    .domain(shooting_dist_dimensions)
    .range([0, shooting_dist_width])
    .padding(0.2)
  var shooting_dist_y = d3
    .scaleLinear()
    .domain([0, d3.max(james_shooting_dist, d => +d.FGA) * 1.1])
    .range([shooting_dist_height, 0])
  var shooting_dist_pct_y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([shooting_dist_height, 0])

  // draw axis
  james_shooting_dist_svg.append('g').call(d3.axisLeft(shooting_dist_y))
  james_shooting_dist_svg
    .append('g')
    .attr('transform', 'translate(' + shooting_dist_width + ',' + 0 + ')')
    .call(d3.axisRight(shooting_dist_pct_y))
  james_shooting_dist_svg
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + shooting_dist_height + ')')
    .call(d3.axisBottom(shooting_dist_x))

  davis_shooting_dist_svg.append('g').call(d3.axisLeft(shooting_dist_y))
  davis_shooting_dist_svg
    .append('g')
    .attr('transform', 'translate(' + shooting_dist_width + ',' + 0 + ')')
    .call(d3.axisRight(shooting_dist_pct_y))
  davis_shooting_dist_svg
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + shooting_dist_height + ')')
    .call(d3.axisBottom(shooting_dist_x))

  // append FGA rect
  james_shooting_dist_svg
    .selectAll('james-FGA-rect')
    .data(james_shooting_dist)
    .enter()
    .append('rect')
    .attr('x', d => shooting_dist_x(d.type))
    .attr('y', d => shooting_dist_y(d.FGA))
    .attr('width', d => shooting_dist_x.bandwidth())
    .attr('height', d => shooting_dist_y(0) - shooting_dist_y(d.FGA))
    .attr('fill', COLOR.LIGHT_GREY)

  // append FG_PCT
  james_shooting_dist_svg
    .append('path')
    .datum(james_shooting_dist) // .data vs .datum: former allows multiple append, later allows 1
    .attr('fill', 'none')
    .attr('stroke', COLOR.LAKERS_YELLOW)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x(d => shooting_dist_x(d.type) + shooting_dist_x.bandwidth() / 2)
        .y(d => shooting_dist_pct_y(d.FG_PCT))
    )

  james_shooting_dist_svg
    .selectAll('james-FGPCT-circle')
    .data(james_shooting_dist)
    .enter()
    .append('circle')
    .attr('class', (d, i) => 'shooting-dist-' + i)
    .attr('cx', d => shooting_dist_x(d.type) + shooting_dist_x.bandwidth() / 2)
    .attr('cy', d => shooting_dist_pct_y(d.FG_PCT))
    .attr('r', 4)
    .attr('fill', COLOR.LAKERS_YELLOW)
    .on('mouseover', function() {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_PURPLE)
      d3.selectAll(className + '-text').attr('display', 'block')
    })
    .on('mouseleave', function() {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      d3.selectAll(className + '-text').attr('display', 'none')
    })

  james_shooting_dist_svg
    .selectAll('james-FGPCT-text')
    .data(james_shooting_dist)
    .enter()
    .append('text')
    .attr('class', (d, i) => 'shooting-dist-' + i + '-text')
    .attr(
      'x',
      d => shooting_dist_x(d.type) + shooting_dist_x.bandwidth() / 2 - 15
    )
    .attr('y', d => shooting_dist_pct_y(d.FG_PCT) - 15)
    .text(d => (d.FG_PCT * 100).toFixed(2) + '%')
    .style('font-size', 13)
    .attr('display', 'none')

  james_shooting_dist_svg
    .append('text')
    .attr('x', 10)
    .attr('y', 10)
    .text('FGA')
    .attr('font-size', '14px')
  james_shooting_dist_svg
    .append('text')
    .attr('x', shooting_dist_width - 35)
    .attr('y', 10)
    .text('FG%')
    .attr('font-size', '14px')

  // append FGA rect
  davis_shooting_dist_svg
    .selectAll('davis-FGA-rect')
    .data(davis_shooting_dist)
    .enter()
    .append('rect')
    .attr('x', d => shooting_dist_x(d.type))
    .attr('y', d => shooting_dist_y(d.FGA))
    .attr('width', d => shooting_dist_x.bandwidth())
    .attr('height', d => shooting_dist_y(0) - shooting_dist_y(d.FGA))
    .attr('fill', COLOR.LIGHT_GREY)

  // append FG_PCT
  davis_shooting_dist_svg
    .append('path')
    .datum(davis_shooting_dist) // .data vs .datum: former allows multiple append, later allows 1
    .attr('fill', 'none')
    .attr('stroke', COLOR.LAKERS_YELLOW)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x(d => shooting_dist_x(d.type) + shooting_dist_x.bandwidth() / 2)
        .y(d => shooting_dist_pct_y(d.FG_PCT))
    )

  davis_shooting_dist_svg
    .selectAll('davis-FGPCT-circle')
    .data(davis_shooting_dist)
    .enter()
    .append('circle')
    .attr('class', (d, i) => 'shooting-dist-' + i)
    .attr('cx', d => shooting_dist_x(d.type) + shooting_dist_x.bandwidth() / 2)
    .attr('cy', d => shooting_dist_pct_y(d.FG_PCT))
    .attr('r', 4)
    .attr('fill', COLOR.LAKERS_YELLOW)
    .on('mouseover', function() {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_PURPLE)
      d3.selectAll(className + '-text').attr('display', 'block')
    })
    .on('mouseleave', function() {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      d3.selectAll(className + '-text').attr('display', 'none')
    })

  davis_shooting_dist_svg
    .selectAll('davis-FGPCT-text')
    .data(davis_shooting_dist)
    .enter()
    .append('text')
    .attr('class', (d, i) => 'shooting-dist-' + i + '-text')
    .attr(
      'x',
      d => shooting_dist_x(d.type) + shooting_dist_x.bandwidth() / 2 - 15
    )
    .attr('y', d => shooting_dist_pct_y(d.FG_PCT) - 15)
    .text(d => (d.FG_PCT * 100).toFixed(2) + '%')
    .style('font-size', 13)
    .attr('display', 'none')

  davis_shooting_dist_svg
    .append('text')
    .attr('x', 10)
    .attr('y', 10)
    .text('FGA')
    .attr('font-size', '14px')
  davis_shooting_dist_svg
    .append('text')
    .attr('x', shooting_dist_width - 35)
    .attr('y', 10)
    .text('FG%')
    .attr('font-size', '14px')
})
