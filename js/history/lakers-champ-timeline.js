// define margin and svg size
var margin = { top: 150, bottom: 30, left: 50, right: 30 }
var width = 1300
var height = 300

// create svg
var svg = d3
  .select('#lakers-champ-timeline')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// read data
d3.csv('./files/lakers_champ.csv', data => {
  var years = []
  data.forEach(row => {
    years.push(+row['YEARAWARDED'])
  })
  years.sort()

  var x = d3
    .scaleLinear()
    .domain([
      d3.min(data, d => d['YEARAWARDED']),
      d3.max(data, d => d['YEARAWARDED'])
    ])
    .range([0, width])

  svg
    .append('g')
    .attr('class', 'lakers-champ-axis')
    .attr('transform', 'translate(0,' + height * 0.3 + ')')
    .call(
      d3
        .axisBottom(x)
        .tickSize(2)
        .tickValues(years)
        .tickFormat(d3.format('d'))
    )

  // scrolling effects
  new Waypoint({
    element: document.getElementById('lakers-champ-timeline'),
    handler: function (direction) {
      if (this.element.getAttribute('done') != 1 && direction == 'down') {
        this.element.setAttribute('done', 1)
        d3.selectAll('.lakers-champ-axis .tick line')
          .transition()
          .duration(1000)
          .attr('y2', (d, i) => {
            if (d == 2020) return -60
            if (i % 2 === 0) {
              return -40
            }
            return 40
          })
          .attr('stroke', COLOR.LIGHT_GREY)

        d3.selectAll('.lakers-champ-axis .tick text')
          .transition()
          .duration(1000)
          .attr('y', (d, i) => {
            if (d == 2020) return -90
            if (i % 2 === 0) {
              return -70
            }
            return 60
          })
          .attr('font-size', 13)
          .attr('fill', COLOR.DARK_GREY)

        var ticks = d3.selectAll('.lakers-champ-axis .tick')
        ticks.each(function (tick, i) {
          d3.select(this)
            .append('circle')
            .transition()
            .duration(1000)
            .attr('cy', function (d) {
              if (d == 2020) return -60
              if (i % 2 === 0) {
                return -40
              }
              return 40
            })
            .attr('r', 10)
            .attr('fill', function (d) {
              if (d === 2020) return COLOR.LAKERS_YELLOW
              return COLOR.LAKERS_PURPLE
            })
        })
      }
    },
    offset: 700
  })

  d3.selectAll('.lakers-champ-axis path').attr('stroke', COLOR.LIGHT_GREY)

  // add image
  var champRecordsStories = [
    {
      cx: x(1949),
      cy: -60,
      x: x(1949) - 50,
      y: -110,
      link: './files/images/champ-timeline/lakers-champ-gm.jpg',
      width: 100,
      text1: '1947–1958, George Mikan dominated the league ',
      text2: 'and found Minneapolis dynasty.'
    },
    {
      cx: x(1968),
      cy: 230,
      x: x(1968) - 50,
      y: 180,
      link: './files/images/champ-timeline/lakers-champ-wc.jpg',
      width: 120,
      text1: '1968–1973, Wilt Chamberlain set countless records,',
      text2: 'but won only 1 championship.'
    },
    {
      cx: x(1978),
      cy: -60,
      x: x(1978) - 50,
      y: -110,
      link: './files/images/champ-timeline/lakers-champ-showtime.jpg',
      width: 140,
      text1: '1979–1991, Magic Johnson, Kareem Abdul-Jabba',
      text2: 'and the "Showtime".'
    },
    {
      cx: x(1997),
      cy: 240,
      x: x(1997) - 55,
      y: 200,
      link: './files/images/champ-timeline/lakers-champ-ok.jpg',
      width: 120,
      text1: "1996–2004, O'Neal-Bryant dynasty and",
      text2: 'the "three ring circus".'
    },
    {
      cx: x(2008),
      cy: -60,
      x: x(2008) - 80,
      y: -110,
      link: './files/images/champ-timeline/lakers-champ-kobe.jpg',
      width: 150,
      text1: '2007-2011 Kobe Bryant and Paul Casol brought Lakers back to',
      text2: 'former glory after Shaq left.'
    }
  ]

  svg
    .selectAll('lakers-champ-clipPath')
    .data(champRecordsStories)
    .enter()
    .append('clipPath')
    .attr('id', (d, i) => 'clipObj-' + i)
    .append('circle')
    .attr('cx', d => d.cx)
    .attr('cy', d => d.cy)
    .attr('r', 40)

  var lakers_champ_text = svg
    .selectAll('lakers-champ-clipPath-caption')
    .data(champRecordsStories)
    .enter()
    .append('text')

  lakers_champ_text
    .append('tspan')
    .attr('x', d => d.cx + 60)
    .attr('y', d => d.cy - 10)
    .attr('font-size', '13px')
    .attr('fill', COLOR.DARK_GREY)
    .text(d => d.text1)
    .append('tspan')
    .attr('x', d => d.cx + 60)
    .attr('y', d => d.cy + 10)
    .attr('font-size', '13px')
    .attr('fill', COLOR.DARK_GREY)
    .text(d => d.text2)

  svg
    .selectAll('lakers-champ-clipPath-image')
    .data(champRecordsStories)
    .enter()
    .append('image')
    .attr('xlink:href', d => d.link)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', d => d.width)
    .attr('clip-path', (d, i) => 'url(#clipObj-' + i + ')')
})
