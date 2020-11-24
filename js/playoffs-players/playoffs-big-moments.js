// define margin and svg size
var big_moments_margin = { top: 50, bottom: 50, left: 50, right: 50 }
var big_moments_width = 1300
var big_moments_height = 5000

// create svg
var big_moments_svg = d3
  .select('#lakers-playoffs-big-moments')
  .append('svg')
  .attr(
    'width',
    big_moments_width + big_moments_margin.left + big_moments_margin.right
  )
  .attr(
    'height',
    big_moments_height + big_moments_margin.top + big_moments_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' + big_moments_width / 2 + ',' + big_moments_margin.top + ')'
  )

d3.csv('./files/lakers_playoffs_game_logs.csv', data => {
  console.log(data)
  data.sort((a, b) => a.GAME_ID.localeCompare(b.GAME_ID))

  // y axis
  var big_moments_y_scale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, big_moments_height])

  var big_moments_axis = big_moments_svg
    .append('g')
    .attr('class', 'big-moments-axis')
    .call(d3.axisLeft(big_moments_y_scale).tickSize(0))

  d3.selectAll('.big-moments-axis path')
    .attr('stroke', COLOR.LIGHT_GREY)
    .attr('stroke-width', 3)

  var momentIds = [1, 5, 9, 15, 16, 20]
  big_moments_svg
    .selectAll('big-moments-circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', (d, i) => {
      if (momentIds.includes(i)) {
        return 'big-moments-active-' + i
      }
      return 'big-moments'
    })
    .attr('cx', 0)
    .attr('cy', (d, i) => big_moments_y_scale(i))
    .attr('r', 12)
    .attr('fill', 'white')
    .attr('stroke', d => {
      if (d.WL === 'W') {
        return COLOR.LAKERS_YELLOW
      }
      return COLOR.RED
    })
    .attr('stroke-width', 5)

  for (var i = 0, length = momentIds.length; i < length; i++) {
    new Waypoint({
      element: document.getElementsByClassName(
        'big-moments-active-' + momentIds[i]
      )[0],
      handler: function (direction) {
        var className = '.' + this.element.getAttribute('class')

        if (direction === 'down') {
          d3.select(className)
            .transition()
            .attr('r', 50)
            .attr('stroke-width', 10)
            .duration(500)
        } else {
          d3.select(className)
            .transition()
            .attr('r', 12)
            .attr('stroke-width', 5)
            .duration(500)
        }
      },
      offset: '45%'
    })

    new Waypoint({
      element: document.getElementsByClassName(
        'big-moments-active-' + momentIds[i]
      )[0],
      handler: function (direction) {
        var className = '.' + this.element.getAttribute('class')

        if (direction === 'down') {
          d3.select(className)
            .transition()
            .attr('r', 12)
            .attr('stroke-width', 5)
            .duration(500)
        } else {
          d3.select(className)
            .transition()
            .attr('r', 50)
            .attr('stroke-width', 10)
            .duration(500)
        }
      },
      offset: '20%'
    })
  }
})
