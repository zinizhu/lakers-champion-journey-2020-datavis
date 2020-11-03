// define margin and svg size
var lakers_season_pts_rank_margin = { top: 10, bottom: 10, left: 10, right: 10 }
var lakers_season_pts_rank_width = 350
var lakers_season_pts_rank_height = 400

// create svg
var seasonPTSRank = d3
  .select('#lakers-season-pts-rank')
  .append('svg')
  .attr('width', lakers_season_pts_rank_width + lakers_season_pts_rank_margin.left + lakers_season_pts_rank_margin.right)
  .attr('height', lakers_season_pts_rank_height + lakers_season_pts_rank_margin.top + lakers_season_pts_rank_margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + lakers_season_pts_rank_margin.left + ',' + lakers_season_pts_rank_margin.top + ')')

d3.csv("./files/all_team_performance.csv", data => {

  all_team_PTS = []
  data.forEach(row => {
    var team_avg_pts = +row["PTS"] / (+row["WIN"] + +row["LOSE"])
    all_team_PTS.push({"team": row["TEAM_ABBR"], "PTS": +team_avg_pts.toFixed(2)})
  });
  all_team_PTS.sort((a, b) => b.PTS - a.PTS)
  // console.log(all_team_PTS)

  // horizontal bar graph
  // y axis
  var season_rank_y = d3.scaleBand()
                        .domain(d3.range(all_team_PTS.length))
                        .range([30, lakers_season_pts_rank_height])
                        .padding(0.15)
  var season_rank_x = d3.scaleLinear()
                        .domain([0, all_team_PTS[0].PTS * 1.3])
                        .range([0, lakers_season_pts_rank_width])

    // on hover
    const season_rank_bar_highlight = function (d) {
      var rectClass = '.season-rank-bar-' + d.team
      var textClass = '.season-rank-text-' + d.team
      d3.selectAll(rectClass).style('fill', COLOR.LAKERS_PURPLE)
      d3.selectAll(textClass).style('display', 'block')
    }
  
    const  season_rank_bar_doNotHighlight = function (d) {
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


  var season_rank_title = seasonPTSRank
                          .append("text")
                          .attr("x", 0)
                          .attr("y", 20)
                          .text("Team PPG Ranking")

  var season_rank_bars = seasonPTSRank.selectAll("season-rank-bar")
                          .data(all_team_PTS)
                          .enter()
                          .append("rect")
                          .attr("class", d => "season-rank-bar-" + d.team)
                          .attr("x", 0)
                          .attr("y", (d, i) => season_rank_y(i))
                          .attr("width", d => season_rank_x(d.PTS))
                          .attr("height", season_rank_y.bandwidth())
                          .attr("fill", d => {
                            if (d.team === 'LAL') {
                              return COLOR.LAKERS_YELLOW
                            }
                            return COLOR.LIGHT_GREY
                          })
                          .on('mouseover', season_rank_bar_highlight)
                          .on('mouseleave', season_rank_bar_doNotHighlight)
  
  // text
  var season_rank_text = seasonPTSRank
    .selectAll('season-rank-text')
    .data(all_team_PTS)
    .enter()
    .append('text')
    .attr('class', d => 'season-rank-text-' + d.team)
    .attr('x', d => season_rank_x(d.PTS) + 10)
    .attr('y', (d, i) => season_rank_y(i) +10)
    .text(d => d.team + " " + d.PTS)
    .style('display', 'none')

})