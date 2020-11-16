// enable all page class elements
var pageElements = document.getElementsByClassName('step')
var regularSeasonLogsEl = document.getElementById('lakers-season-logs')

var games = [
  { id: '0021901296', fill: '#FDB927' },
  { id: '0021900915', fill: '#FDB927' },
  { id: '0021900833', fill: '#FDB927' },
  { id: '0021900768', fill: '#787878' },
  { id: '0021900659', fill: '#FDB927' }
]

for (var i = 0, length = pageElements.length; i < length; i++) {
  // if (i === 0) {
  new Waypoint({
    element: pageElements.item(i),
    handler: function (direction) {
      var order = +this.element.getAttribute('order')
      if (direction == 'down') {
        this.element.classList.add('text-show')

        // highlight rect
        var rectClass = '.season-log-' + games[order].id
        d3.selectAll(rectClass).style('fill', 'red')
        if (order != 0) {
          // set back prev
          var prevRectClass = '.season-log-' + games[order - 1].id
          d3.selectAll(prevRectClass).style('fill', games[order - 1].fill)
        }
      } else {
        this.element.classList.remove('text-show')
        if (order === 0) {
          regularSeasonLogsEl.classList.remove('lakers-season-logs')
        }
        // highlight rect
        var rectClass = '.season-log-' + games[order].id
        d3.selectAll(rectClass).style('fill', games[order].fill)
        if (order != 0) {
          // set back prev
          var prevRectClass = '.season-log-' + games[order - 1].id
          d3.selectAll(prevRectClass).style('fill', 'red')
        }
      }
    },
    offset: 500
  })

  // if (i === pageElements.length - 1) {
    new Waypoint({
      element: pageElements.item(i),
      handler: function (direction) {
        var order = +this.element.getAttribute('order')
        if (direction == 'down') {
          this.element.classList.remove('text-show')

          if (order === pageElements.length - 1) {
            regularSeasonLogsEl.classList.remove('lakers-season-logs')
          }
          
        } else {
          this.element.classList.add('text-show')
          regularSeasonLogsEl.classList.add('lakers-season-logs')
        }
      },
      offset: function () {
        var order = +this.element.getAttribute('order')
        if (order === pageElements.length - 1) {
          return 80
        } else {
          return -this.element.clientHeight * 0.2
        }
        
      }
    })
}

new Waypoint({
  element: regularSeasonLogsEl,
  handler: function (direction) {
    if (direction == 'down') {
      this.element.classList.add('lakers-season-logs')
    } else {
      this.element.classList.remove('lakers-season-logs')
    }
  },
  offset: 100
})
