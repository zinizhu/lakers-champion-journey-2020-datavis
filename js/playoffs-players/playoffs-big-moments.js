// define margin and svg size
var big_moments_margin = { top: 100, bottom: 100, left: 50, right: 50 }
var big_moments_width = 1300
var big_moments_height = 5000
var momentIds = [0, 1, 3, 4, 7, 9, 11, 14, 18, 19, 20]

var all_games_text = [
  'LAL vs POR \n G1',
  'LAL vs POR \n G2',
  'LAL vs POR \n G3',
  'LAL vs POR \n G4',
  'LAL vs POR \n G5',
  'LAL vs HOU \n G1',
  'LAL vs HOU \n G2',
  'LAL vs HOU \n G3',
  'LAL vs HOU \n G4',
  'LAL vs HOU \n G5',
  'LAL vs DEN \n G1',
  'LAL vs DEN \n G2',
  'LAL vs DEN \n G3',
  'LAL vs DEN \n G4',
  'LAL vs DEN \n G5',
  'LAL vs MIA \n G1',
  'LAL vs MIA \n G2',
  'LAL vs MIA \n G3',
  'LAL vs MIA \n G4',
  'LAL vs MIA \n G5',
  'LAL vs MIA \n G6'
]

var james_moments = [
  {
    id: 0,
    game: 'LAL vs POR \n G1',
    text:
      'James had 23 points, 17 rebounds and 16 assists, becoming the first player \n to have as many points, rebounds and assists in the playoffs. It was his 24th \n postseason triple-double and his assists were a career playoff high.'
  },
  {
    id: 3,
    game: 'LAL vs POR \n G4',
    text:
      "Kobe Bryant Day. James had 30 points and 10 assists in 28 minutes within \n three quarters. The Lakers led by as many as 38 points for their third \n straight win in the opening-round series, the team's first playoff appearance \n since 2013. "
  },
  {
    id: 7,
    game: 'LAL vs HOU \n G3',
    text:
      "James scored 36 points, and the victory gave James his NBA-record 162nd \n postseason victory, surpassing former Lakers guard Derek Fisher's 161."
  },
  {
    id: 9,
    game: 'LAL vs HOU \n G5',
    text:
      'James scored 29 points and the Lakers wrapped up their first trip to the \n Western Conference finals since 2010. It was also AD’s firs t appearance \n in the West Conference finals.'
  },
  {
    id: 14,
    game: 'LAL vs DEN \n G5',
    text:
      'James finished with 38 points, 16 rebounds and 10 assists, which was his \n 27th postseason triple-double, to become the fourth player to reach 10 NBA \n finals. He wore out the path to the NBA finals in Eastern Conference, and now \n he’s the best in the West.'
  },
  {
    id: 19,
    game: 'LAL vs MIA \n G6',
    text:
      'James had 40 points, 13 rebounds and seven assists for the Lakers. \n They were 1 basket away from the title, but Green’s shot was a  bit short.'
  }
]

var davis_moments = [
  {
    id: 1,
    game: 'LAL vs POR \n G2',
    text:
      'Anthony Davis had 31 points and 11 rebounds and the top-seeded Lakers bounced back from an \n opening loss to rout the Portland Trail Blazers 111-88.'
  },
  {
    id: 4,
    game: 'LAL vs POR \n G5',
    text:
      "Anthony Davis had a playoff-best 43 points for the top-seeded Lakers in their first playoff appearance \n since 2013. The Lakers hadn't won a playoff series since 2012. Davis had a personal 11-0 run in \n the last quarter to put Los Angeles up 123-112 and all but seal it."
  },
  {
    id: 11,
    game: 'LAL vs DEN \n G2',
    text:
      'AD made the ‘mamba shot’ and gave the Lakers a 105-103 victory over the Denver Nuggets on \n Sunday night and a 2-0 lead in the Western Conference finals.'
  },
  {
    id: 18,
    game: 'LAL vs MIA \n G4',
    text:
      "Anthony Davis' 3-pointer with 39.5 seconds left finally settled matters and the Lakers beat the \n Miami Heat 102-96 in Game 4. Lakers were 1 win away from the  franchise's 17th champion."
  }
]

// create svg
var big_moments_root = d3
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

var james_big_moments_g = big_moments_root
  .append('g')
  .attr(
    'transform',
    'translate(' + big_moments_margin.left + ',' + big_moments_margin.top + ')'
  )

var davis_big_moments_g = big_moments_root
  .append('g')
  .attr(
    'transform',
    'translate(' +
      (big_moments_margin.left + 20 + big_moments_width / 2) +
      ',' +
      big_moments_margin.top +
      ')'
  )

var big_moments_svg = big_moments_root
  .append('g')
  .attr(
    'transform',
    'translate(' + big_moments_width / 2 + ',' + big_moments_margin.top + ')'
  )

d3.csv('./files/lakers_playoffs_game_logs.csv', data => {
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

  big_moments_svg
    .selectAll('big-moments-circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', (d, i) => {
      return 'big-moments-' + i
    })
    .attr('cx', 0)
    .attr('cy', (d, i) => big_moments_y_scale(i))
    .attr('r', 12)
    .attr('fill', 'white')
    .attr('stroke', (d, i) => {
      if (i === 20) {
        return COLOR.RED
      }
      if (momentIds.includes(i)) {
        return COLOR.LAKERS_PURPLE
      }
      return COLOR.LAKERS_YELLOW
    })
    .attr('stroke-width', 5)

  // add legends in the circles
  big_moments_svg
    .selectAll('big-moments-games')
    .data(all_games_text)
    .enter()
    .append('text')
    .attr('class', (d, i) => 'big-moments-games-' + i)
    .attr('x', 0)
    .attr('y', (d, i) => big_moments_y_scale(i) - 15)
    .attr('fill', COLOR.DARK_GREY)
    .attr('display', 'none')
    .selectAll('big-moments-games-span')
    .data(d => d.split('\n'))
    .enter()
    .append('tspan')
    .text(d => d)
    .attr('x', 0)
    .attr('dy', 15)
    .style('text-anchor', 'middle')
    .style('font-size', '12')

  // add james/davis text
  james_big_moments_g
    .selectAll('james-big-moments-texts')
    .data(james_moments)
    .enter()
    .append('text')
    .attr('class', d => 'big-moments-texts-' + d.id)
    .attr('x', 10)
    .attr('y', d => big_moments_y_scale(d.id) - 30)
    .attr('fill', COLOR.DARK_GREY)
    .attr('opacity', 0.1)
    .selectAll('james-big-moments-text-span')
    .data(d => d.text.split('\n'))
    .enter()
    .append('tspan')
    .text(d => d)
    .attr('x', 0)
    .attr('dy', 22)

  davis_big_moments_g
    .selectAll('davis-big-moments-texts')
    .data(davis_moments)
    .enter()
    .append('text')
    .attr('class', d => 'big-moments-texts-' + d.id)
    .attr('x', 10)
    .attr('y', d => big_moments_y_scale(d.id) - 30)
    .attr('fill', COLOR.DARK_GREY)
    .attr('opacity', 0.1)
    .selectAll('davis-big-moments-text-span')
    .data(d => d.text.split('\n'))
    .enter()
    .append('tspan')
    .text(d => d)
    .attr('x', 0)
    .attr('dy', 22)

  var moments_avatars_div = document.getElementsByClassName('moments')

  for (var i = 0, length = all_games_text.length; i < length; i++) {
    new Waypoint({
      element: document.getElementsByClassName('big-moments-' + i)[0],
      handler: function (direction) {
        var className = '.' + this.element.getAttribute('class')
        var splits = this.element.getAttribute('class').split('-')
        var id = splits[splits.length - 1]
        var gameClassName = '.big-moments-games-' + id
        if (direction === 'down') {
          d3.select(className)
            .transition()
            .attr('r', 50)
            .attr('stroke-width', 10)
            .duration(500)

          d3.select(gameClassName)
            .transition()
            .attr('display', 'block')
            .duration(500)

          if (id === '1') {
            moments_avatars_div[0].classList.add('moments-fixed')
          }
        } else {
          d3.select(className)
            .transition()
            .attr('r', 12)
            .attr('stroke-width', 5)
            .duration(500)

          d3.select(gameClassName)
            .transition()
            .attr('display', 'none')
            .duration(500)

          if (id === '1') {
            moments_avatars_div[0].classList.remove('moments-fixed')
          }
        }
      },
      offset: '50%'
    })

    new Waypoint({
      element: document.getElementsByClassName('big-moments-' + i)[0],
      handler: function (direction) {
        var className = '.' + this.element.getAttribute('class')
        var splits = this.element.getAttribute('class').split('-')
        var id = splits[splits.length - 1]
        var gameClassName = '.big-moments-games-' + id
        if (direction === 'down' && id != '20') {
          d3.select(className)
            .transition()
            .attr('r', 12)
            .attr('stroke-width', 5)
            .duration(500)

          d3.select(gameClassName)
            .transition()
            .attr('display', 'none')
            .duration(500)

          if (id === '19') {
            moments_avatars_div[0].classList.remove('moments-fixed')
          }
        } else {
          d3.select(className)
            .transition()
            .attr('r', 50)
            .attr('stroke-width', 10)
            .duration(500)

          d3.select(gameClassName)
            .transition()
            .attr('display', 'block')
            .duration(500)
          if (id === '19') {
            moments_avatars_div[0].classList.add('moments-fixed')
          }
        }
      },
      offset: '30%'
    })
  }

  for (var i = 0, length = momentIds.length; i < length; i++) {
    new Waypoint({
      element: document.getElementsByClassName(
        'big-moments-' + momentIds[i]
      )[0],
      handler: function (direction) {
        var splits = this.element.getAttribute('class').split('-')
        var id = splits[splits.length - 1]
        var textClassName = '.big-moments-texts-' + id
        if (direction === 'down') {
          d3.select(textClassName)
            .transition()
            .attr('opacity', 1)
            .duration(500)
        } else {
          d3.select(textClassName)
            .transition()
            .attr('opacity', 0.1)
            .duration(500)
        }
      },
      offset: '50%'
    })

    new Waypoint({
      element: document.getElementsByClassName(
        'big-moments-' + momentIds[i]
      )[0],
      handler: function (direction) {
        var splits = this.element.getAttribute('class').split('-')
        var id = splits[splits.length - 1]
        var textClassName = '.big-moments-texts-' + id
        if (direction === 'down' && id != '20') {
          d3.select(textClassName)
            .transition()
            .attr('opacity', 0.1)
            .duration(500)
        } else {
          d3.select(textClassName)
            .transition()
            .attr('opacity', 1)
            .duration(500)
        }
      },
      offset: '30%'
    })
  }
})
