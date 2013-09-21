#     Hallo - a rich text editing jQuery UI widget
#     (c) 2011 Henri Bergius, IKS Consortium
#     Hallo may be freely distributed under the MIT license
((jQuery) ->
  jQuery.widget 'IKS.hallodropdownbutton',
    button: null

    options:
      uuid: ''
      label: null
      icon: null
      editable: null
      target: ''
      cssClass: null

    _create: ->
      @options.icon ?= "glyphicon-#{@options.label.toLowerCase()}"

    _init: ->
      target = jQuery @options.target
      target.css 'position', 'absolute'
      target.addClass 'dropdown-menu'

      target.hide()

      @element.on 'click', =>
        if target.hasClass 'open'
          @_hideTarget()
          return
        @_showTarget()

      target.on 'click', =>
        @_hideTarget()

      @options.editable.element.on 'hallodeactivated', =>
        @_hideTarget()

      @icon = @_createIcon @options.icon
      @element.append @icon
      classes = [
        'btn'
        'btn-default'
        'dropdown-toggle'
      ]

      id = "#{@options.uuid}-#{@options.label}"
      @element.attr 'id', id

      @element.addClass classes.join(' ')
      @element.addClass @options.cssClass if @options.cssClass
      @element.addClass 'btn-large' if @options.editable.options.touchScreen

    _showTarget: ->
      target = jQuery @options.target
      @_updateTargetPosition()
      target.addClass 'open'
      target.show()

    _hideTarget: ->
      target = jQuery @options.target
      target.removeClass 'open'
      target.hide()

    _updateTargetPosition: ->
      target = jQuery @options.target
      {top, left} = @element.position()
      top += @element.outerHeight()
      target.css 'top', top
      target.css 'left', left - 20

    _createIcon: (icon) ->
      jQuery "<i class=\"glyphicon #{icon}\"></i> <span class='caret'></span>"
)(jQuery)
