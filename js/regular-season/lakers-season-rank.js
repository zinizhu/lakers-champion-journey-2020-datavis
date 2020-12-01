// define margin and svg size
var lakers_season_pts_rank_margin = { top: 10, bottom: 30, left: 40, right: 30 }
var lakers_season_pts_rank_width = 350
var lakers_season_pts_rank_height = 400

// create svg
var seasonPTSRank = d3
  .select('#lakers-season-pts-rank')
  .append('svg')
  .attr(
    'width',
    lakers_season_pts_rank_width +
      lakers_season_pts_rank_margin.left +
      lakers_season_pts_rank_margin.right
  )
  .attr(
    'height',
    lakers_season_pts_rank_height +
      lakers_season_pts_rank_margin.top +
      lakers_season_pts_rank_margin.bottom
  )
  .append('g')
  .attr(
    'transform',
    'translate(' +
      lakers_season_pts_rank_margin.left +
      ',' +
      lakers_season_pts_rank_margin.top +
      ')'
  )

d3.csv('./files/all_team_performance.csv', data => {
  all_team_PTS = []
  data.forEach(row => {
    var team_avg_pts = +row['PTS'] / (+row['WIN'] + +row['LOSE'])
    all_team_PTS.push({ team: row['TEAM_ABBR'], PTS: +team_avg_pts.toFixed(2) })
  })
  all_team_PTS.sort((a, b) => b.PTS - a.PTS)

  // horizontal bar graph
  // y axis
  var season_rank_y = d3
    .scaleBand()
    .domain(d3.range(all_team_PTS.length))
    .range([30, lakers_season_pts_rank_height])
    .padding(0.15)
  var season_rank_x = d3
    .scaleLinear()
    .domain([0, all_team_PTS[0].PTS * 1.3])
    .range([0, lakers_season_pts_rank_width])

  // on hover
  const season_rank_bar_highlight = function (d) {
    var rectClass = '.season-rank-bar-' + d.team
    var textClass = '.season-rank-text-' + d.team
    d3.selectAll(rectClass).style('fill', COLOR.LAKERS_PURPLE)
    d3.selectAll(textClass).style('display', 'block')

    seasonPTSDots.selectAll('.lakers-game-dots').remove()
    seasonPTSDots.selectAll('.all-team-dots-legend').remove()

    seasonPTSDots
      .selectAll('lakers-game-dots')
      .data(all_teams_regular_logs[d.team])
      .enter()
      .append('circle')
      .attr('class', d => 'lakers-game-dots lakers-season-pts-' + d.id)
      .attr('cx', d => {
        return seasonPTSDots_random()
      })
      .attr('cy', d => seasonPTSDots_y(d.PTS))
      .attr('r', 4)
      .attr('fill', d => {
        if (d.wl === 'W') {
          return COLOR.LAKERS_PURPLE
        }
        return COLOR.RED
      })

    seasonPTSDots
      .append('text')
      .attr('class', 'all-team-dots-legend')
      .attr('x', 0)
      .attr('y', 30)
      .text(d.team + ' PPG')
  }

  const season_rank_bar_doNotHighlight = function (d) {
    var rectClass = '.season-rank-bar-' + d.team
    var textClass = '.season-rank-text-' + d.team
    d3.selectAll(rectClass).style('fill', d => {
      if (d.team === 'LAL') {
        return COLOR.LAKERS_YELLOW
      }
      return COLOR.LIGHT_GREY
    })
    d3.selectAll(textClass).style('display', 'none')
  }

  seasonPTSRank
    .append('text')
    .attr('x', 0)
    .attr('y', 20)
    .text('Team PPG Ranking')

  seasonPTSRank
    .selectAll('season-rank-bar')
    .data(all_team_PTS)
    .enter()
    .append('rect')
    .attr('class', d => 'season-rank-bar-' + d.team)
    .attr('x', 0)
    .attr('y', (d, i) => season_rank_y(i))
    .attr('width', d => season_rank_x(d.PTS))
    .attr('height', season_rank_y.bandwidth())
    .attr('fill', d => {
      if (d.team === 'LAL') {
        return COLOR.LAKERS_YELLOW
      }
      return COLOR.LIGHT_GREY
    })
    .on('mouseover', season_rank_bar_highlight)
    .on('mouseleave', season_rank_bar_doNotHighlight)

  // text
  seasonPTSRank
    .selectAll('season-rank-text')
    .data(all_team_PTS)
    .enter()
    .append('text')
    .attr('class', d => 'season-rank-text-' + d.team)
    .attr('x', d => season_rank_x(d.PTS) + 10)
    .attr('y', (d, i) => season_rank_y(i) + 10)
    .text(d => d.team + ' ' + d.PTS)
    .style('display', 'none')

  seasonPTSRank
    .append('text')
    .attr('x', lakers_season_pts_rank_width / 3)
    .attr('y', lakers_season_pts_rank_height + 20)
    .text('PPG')
    .style('text-anchor', 'middle')

  seasonPTSRank
    .selectAll('team-rank-names')
    .data(all_team_PTS)
    .enter()
    .append('text')
    .attr('x', -25)
    .attr('y', (d, i) => season_rank_y(i) + 9)
    .attr('font-size', '10px')
    .text(d => d.team)
    .style('text-anchor', 'middle')
})
