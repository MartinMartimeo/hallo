#     Hallo - a rich text editing jQuery UI widget
#     (c) 2011 Henri Bergius, IKS Consortium
#     Hallo may be freely distributed under the MIT license
((jQuery) ->
  jQuery.widget 'IKS.hallobutton',
    isChecked: false

    options:
      uuid: ''
      label: null
      icon: null
      editable: null
      command: null
      commandValue: null
      queryState: true
      cssClass: null

    _create: ->
      # By default the icon is glyphicon-command, but this doesn't
      # always match with the corect glyphicon identifier
      @options.icon ?= "glyphicon-#{@options.label.toLowerCase()}"

      id = "#{@options.uuid}-#{@options.label}"
      command = @options.command
      classes = [
        'btn'
        'btn-default'
        "#{command}_button"
      ]

      @icon = @_createIcon @options.icon
      @element.append @icon

      @element.addClass classes.join(' ')
      @element.addClass @options.cssClass if @options.cssClass
      @element.addClass 'btn-large' if @options.editable.options.touchScreen

      @element.attr 'id', id
      @element.attr 'title', @options.label
      @element.data 'hallo-command', @options.command
      if @options.commandValue
        @element.data 'hallo-command-value', @options.commandValue

      hoverclass = 'ui-state-hover'
      @element.on 'mouseenter', (event) =>
        if @isEnabled()
          @element.addClass hoverclass
      @element.on 'mouseleave', (event) =>
        @element.removeClass hoverclass

    _init: ->
      if @options.queryState is true
        queryState = (event) =>
          return unless @options.command
          try
            if @options.commandValue
              value = document.queryCommandValue @options.command
              compared = value.match(new RegExp(@options.commandValue, "i"))
              @checked(if compared then true else false)
            else
              @checked document.queryCommandState @options.command
          catch e
            return
      else
        queryState = @options.queryState

      if @options.command
        @element.on 'click', (event) =>
          if @options.commandValue
            @options.editable.execute @options.command, @options.commandValue
          else
            @options.editable.execute @options.command
          if typeof queryState is 'function'
            queryState()
          return false

      return unless @options.queryState

      editableElement = @options.editable.element
      events = 'keyup paste change mouseup hallomodified'
      editableElement.on events, queryState
      editableElement.on 'halloenabled', =>
        editableElement.on events, queryState
      editableElement.on 'hallodisabled', =>
        editableElement.off events, queryState

    enable: ->
      @element.removeAttr 'disabled'

    disable: ->
      @element.attr 'disabled', 'true'

    isEnabled: ->
      return @element.attr('disabled') != 'true'

    refresh: ->
      if @isChecked
        @element.addClass 'active'
      else
        @element.removeClass 'active'

    checked: (checked) ->
      @isChecked = checked
      @refresh()

    _createIcon: (icon) ->
      jQuery "<i class=\"glyphicon #{icon}\">"


  jQuery.widget 'IKS.hallobuttonset',
    buttons: null
    _create: ->
      @element.addClass 'btn-group'
)(jQuery)
