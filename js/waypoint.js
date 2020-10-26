// enable all page class elements
var pageElements = document.getElementsByClassName('page')
for (var i = 0, length = pageElements.length; i < length; i++) {
  new Waypoint({
    element: pageElements.item(i),
    handler: function(direction) {
      if (direction == 'down') {
        this.element.classList.add('text-show')
      }
      else {
        this.element.classList.remove('text-show')
      }
    },
    offset: '50%'
  })

  new Waypoint({
    element: pageElements.item(i),
    handler: function(direction) {
      if (direction == 'down') {
        this.element.classList.remove('text-show')
      }
      else {
        this.element.classList.add('text-show')
      }
    },
    offset: function() {
      return - this.element.clientHeight * 0.3
    }
  })
}
