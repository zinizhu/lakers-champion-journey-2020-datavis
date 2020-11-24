var shooting_quarter_margin = { top: 10, bottom: 30, left: 30, right: 30 }
var shooting_quarter_width = 220
var shooting_quarter_height = 220

var james_shooting_quarter_svg = d3
  .select('#james-shooting-quarter')
  .append('svg')
  .attr(
    'width',
    shooting_quarter_width +
      shooting_quarter_margin.left +
      shooting_quarter_margin.right
  )
  .attr(
    'height',
    shooting_quarter_height +
      shooting_quarter_margin.top +
      shooting_quarter_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      shooting_quarter_margin.left +
      ',' +
      shooting_quarter_margin.top +
      ')'
  )

var davis_shooting_quarter_svg = d3
  .select('#davis-shooting-quarter')
  .append('svg')
  .attr(
    'width',
    shooting_quarter_width +
      shooting_quarter_margin.left +
      shooting_quarter_margin.right
  )
  .attr(
    'height',
    shooting_quarter_height +
      shooting_quarter_margin.top +
      shooting_quarter_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      shooting_quarter_margin.left +
      ',' +
      shooting_quarter_margin.top +
      ')'
  )

d3.csv('./files/james_davis_shooting_quarter.csv', data => {
  var james_shooting_quarter = []
  var davis_shooting_quarter = []
  var shooting_quarter_dimensions = []
  data.forEach(row => {
    if (row.name === 'James') {
      james_shooting_quarter.push(row)
      shooting_quarter_dimensions.push(row.type)
    } else {
      davis_shooting_quarter.push(row)
    }
  })

  // create scale
  var shooting_quarter_x = d3
    .scaleBand()
    .domain(shooting_quarter_dimensions)
    .range([0, shooting_quarter_width])
    .padding(0.2)
  var shooting_quarter_y = d3
    .scaleLinear()
    .domain([0, d3.max(davis_shooting_quarter, d => +d.FGA) * 1.1])
    .range([shooting_quarter_height, 0])
  var shooting_quarter_pct_y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([shooting_quarter_height, 0])

  // draw axis
  james_shooting_quarter_svg.append('g').call(d3.axisLeft(shooting_quarter_y))
  james_shooting_quarter_svg
    .append('g')
    .attr('transform', 'translate(' + shooting_quarter_width + ',' + 0 + ')')
    .call(d3.axisRight(shooting_quarter_pct_y))
  james_shooting_quarter_svg
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + shooting_quarter_height + ')')
    .call(d3.axisBottom(shooting_quarter_x))

  davis_shooting_quarter_svg.append('g').call(d3.axisLeft(shooting_quarter_y))
  davis_shooting_quarter_svg
    .append('g')
    .attr('transform', 'translate(' + shooting_quarter_width + ',' + 0 + ')')
    .call(d3.axisRight(shooting_quarter_pct_y))
  davis_shooting_quarter_svg
    .append('g')
    .attr('transform', 'translate(' + 0 + ',' + shooting_quarter_height + ')')
    .call(d3.axisBottom(shooting_quarter_x))

  // append FGA rect
  james_shooting_quarter_svg
    .selectAll('james-FGA-rect-quarter')
    .data(james_shooting_quarter)
    .enter()
    .append('rect')
    .attr('x', d => shooting_quarter_x(d.type))
    .attr('y', d => shooting_quarter_y(d.FGA))
    .attr('width', d => shooting_quarter_x.bandwidth())
    .attr('height', d => shooting_quarter_y(0) - shooting_quarter_y(d.FGA))
    .attr('fill', COLOR.LIGHT_GREY)

  // append FG_PCT
  james_shooting_quarter_svg
    .append('path')
    .datum(james_shooting_quarter) // .data vs .datum: former allows multiple append, later allows 1
    .attr('fill', 'none')
    .attr('stroke', COLOR.LAKERS_PURPLE)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x(d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2)
        .y(d => shooting_quarter_pct_y(d.FG_PCT))
    )

  james_shooting_quarter_svg
    .selectAll('james-FGPCT-circle')
    .data(james_shooting_quarter)
    .enter()
    .append('circle')
    .attr('class', (d, i) => 'shooting-quarter-FG-' + i)
    .attr(
      'cx',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2
    )
    .attr('cy', d => shooting_quarter_pct_y(d.FG_PCT))
    .attr('r', 4)
    .attr('fill', COLOR.LAKERS_PURPLE)
    .on('mouseover', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      d3.selectAll(className + '-text').attr('display', 'block')
    })
    .on('mouseleave', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_PURPLE)
      d3.selectAll(className + '-text').attr('display', 'none')
    })

  james_shooting_quarter_svg
    .selectAll('james-FGPCT-text')
    .data(james_shooting_quarter)
    .enter()
    .append('text')
    .attr('class', (d, i) => 'shooting-quarter-FG-' + i + '-text')
    .attr(
      'x',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2 - 15
    )
    .attr('y', d => shooting_quarter_pct_y(d.FG_PCT) - 15)
    .text(d => (d.FG_PCT * 100).toFixed(2) + '%')
    .attr('font-size', 14)
    .attr('display', 'none')

  // append FG3_PCT
  james_shooting_quarter_svg
    .append('path')
    .datum(james_shooting_quarter)
    .attr('fill', 'none')
    .attr('stroke', COLOR.RED)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x(d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2)
        .y(d => shooting_quarter_pct_y(d.FG3_PCT))
    )

  james_shooting_quarter_svg
    .selectAll('james-FG3PCT-circle')
    .data(james_shooting_quarter)
    .enter()
    .append('circle')
    .attr('class', (d, i) => 'shooting-quarter-FG3-' + i)
    .attr(
      'cx',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2
    )
    .attr('cy', d => shooting_quarter_pct_y(d.FG3_PCT))
    .attr('r', 4)
    .attr('fill', COLOR.RED)
    .on('mouseover', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      d3.selectAll(className + '-text').attr('display', 'block')
    })
    .on('mouseleave', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.RED)
      d3.selectAll(className + '-text').attr('display', 'none')
    })

  james_shooting_quarter_svg
    .selectAll('james-FG3PCT-text')
    .data(james_shooting_quarter)
    .enter()
    .append('text')
    .attr('class', (d, i) => 'shooting-quarter-FG3-' + i + '-text')
    .attr(
      'x',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2 - 25
    )
    .attr('y', d => shooting_quarter_pct_y(d.FG3_PCT) + 20)
    .text(d => (d.FG3_PCT * 100).toFixed(2) + '%')
    .attr('font-size', 14)
    .attr('display', 'none')

  james_shooting_quarter_svg
    .append('text')
    .attr('x', 10)
    .attr('y', 10)
    .text('FGA')
    .attr('font-size', '14px')

  james_shooting_quarter_svg
    .append('text')
    .attr('x', shooting_quarter_width - 40)
    .attr('y', 10)
    .text('FG%')
    .attr('font-size', '12px')
    .attr('fill', COLOR.LAKERS_PURPLE)

  james_shooting_quarter_svg
    .append('text')
    .attr('x', shooting_quarter_width - 40)
    .attr('y', 30)
    .text('FG3%')
    .attr('font-size', '12px')
    .attr('fill', COLOR.RED)

  // append FGA rect
  davis_shooting_quarter_svg
    .selectAll('davis-FGA-rect-quarter')
    .data(davis_shooting_quarter)
    .enter()
    .append('rect')
    .attr('x', d => shooting_quarter_x(d.type))
    .attr('y', d => shooting_quarter_y(d.FGA))
    .attr('width', d => shooting_quarter_x.bandwidth())
    .attr('height', d => shooting_quarter_y(0) - shooting_quarter_y(d.FGA))
    .attr('fill', COLOR.LIGHT_GREY)

  // append FG_PCT
  davis_shooting_quarter_svg
    .append('path')
    .datum(davis_shooting_quarter)
    .attr('fill', 'none')
    .attr('stroke', COLOR.LAKERS_PURPLE)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x(d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2)
        .y(d => shooting_quarter_pct_y(d.FG_PCT))
    )

  davis_shooting_quarter_svg
    .selectAll('davis-FGPCT-circle-quarter')
    .data(davis_shooting_quarter)
    .enter()
    .append('circle')
    .attr('class', (d, i) => 'shooting-quarter-FG-' + i)
    .attr(
      'cx',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2
    )
    .attr('cy', d => shooting_quarter_pct_y(d.FG_PCT))
    .attr('r', 4)
    .attr('fill', COLOR.LAKERS_PURPLE)
    .on('mouseover', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      d3.selectAll(className + '-text').attr('display', 'block')
    })
    .on('mouseleave', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_PURPLE)
      d3.selectAll(className + '-text').attr('display', 'none')
    })

  davis_shooting_quarter_svg
    .selectAll('davis-FGPCT-text')
    .data(davis_shooting_quarter)
    .enter()
    .append('text')
    .attr('class', (d, i) => 'shooting-quarter-FG-' + i + '-text')
    .attr(
      'x',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2 - 15
    )
    .attr('y', d => shooting_quarter_pct_y(d.FG_PCT) - 15)
    .text(d => (d.FG_PCT * 100).toFixed(2) + '%')
    .attr('font-size', 14)
    .attr('display', 'none')

  // FG3
  davis_shooting_quarter_svg
    .append('path')
    .datum(davis_shooting_quarter)
    .attr('fill', 'none')
    .attr('stroke', COLOR.RED)
    .attr('stroke-width', 2)
    .attr(
      'd',
      d3
        .line()
        .x(d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2)
        .y(d => shooting_quarter_pct_y(d.FG3_PCT))
    )

  davis_shooting_quarter_svg
    .selectAll('davis-FG3PCT-circle-quarter')
    .data(davis_shooting_quarter)
    .enter()
    .append('circle')
    .attr('class', (d, i) => 'shooting-quarter-FG3-' + i)
    .attr(
      'cx',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2
    )
    .attr('cy', d => shooting_quarter_pct_y(d.FG3_PCT))
    .attr('r', 4)
    .attr('fill', COLOR.RED)
    .on('mouseover', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.LAKERS_YELLOW)
      d3.selectAll(className + '-text').attr('display', 'block')
    })
    .on('mouseleave', function () {
      var className = '.' + d3.select(this).attr('class')
      d3.selectAll(className).attr('fill', COLOR.RED)
      d3.selectAll(className + '-text').attr('display', 'none')
    })

  davis_shooting_quarter_svg
    .selectAll('davis-FG3PCT-text')
    .data(davis_shooting_quarter)
    .enter()
    .append('text')
    .attr('class', (d, i) => 'shooting-quarter-FG3-' + i + '-text')
    .attr(
      'x',
      d => shooting_quarter_x(d.type) + shooting_quarter_x.bandwidth() / 2 - 25
    )
    .attr('y', d => shooting_quarter_pct_y(d.FG3_PCT) + 20)
    .text(d => (d.FG3_PCT * 100).toFixed(2) + '%')
    .attr('font-size', 14)
    .attr('display', 'none')

  davis_shooting_quarter_svg
    .append('text')
    .attr('x', 10)
    .attr('y', 10)
    .text('FGA')
    .attr('font-size', '14px')

  davis_shooting_quarter_svg
    .append('text')
    .attr('x', shooting_quarter_width - 40)
    .attr('y', 10)
    .text('FG%')
    .attr('font-size', '12px')
    .attr('fill', COLOR.LAKERS_PURPLE)

  davis_shooting_quarter_svg
    .append('text')
    .attr('x', shooting_quarter_width - 40)
    .attr('y', 30)
    .text('FG3%')
    .attr('font-size', '12px')
    .attr('fill', COLOR.RED)
})
