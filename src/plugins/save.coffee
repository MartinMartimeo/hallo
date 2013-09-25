#     Hallo - a rich text editing jQuery UI widget
#     (c) 2011 Henri Bergius, IKS Consortium
#     Hallo may be freely distributed under the MIT license
#
# -----------------------------------------
#
#     Hallo overlay plugin
#     (c) 2013 Martin Martimeo
#     This plugin may be freely distributed under the MIT license.
#
# This plugin allows to store the content at a remote
# server
((jQuery) ->
  jQuery.widget "IKS.hallosave",
    options:
      editable: null
      toolbar: null
      uuid: ''
      target: ''
      method: 'POST'
      icon: ["glyphicon-save", "glyphicon-saved"]
      buttonCssClass: null

    populateToolbar: (toolbar) ->
      widget = this
      buttonset = jQuery "<span class=\"#{@widgetName}\"></span>"
      buttonize = (cmd, label) =>
        buttonElement = jQuery '<button>'
        buttonElement.hallobutton
          uuid: @options.uuid
          editable: @options.editable
          label: label
          icon: @options.icon[0]
          command: null
          queryState: false
          cssClass: @options.buttonCssClass
        buttonset.append buttonElement
        @options.editable.element.on 'hallomodified', =>
          buttonElement.find(".glyphicon").removeClass(@options.icon[1]).addClass(@options.icon[0])
        buttonElement
      button = buttonize "save", "Save"
      button.on "click", (event) ->
        jQuery.ajax
          url: widget.options.target?(widget.options.editable) ? widget.options.target
          type: widget.options.method,
          data: widget.options.editable.element.html()
          success: (html) ->
            widget.options.editable.element.removeClass 'isModified'
            button.find(".glyphicon").removeClass(widget.options.icon[0]).addClass(widget.options.icon[1])

            widget.options.editable.element.html html
            widget.options.editable.element.trigger('change')



      buttonset.hallobuttonset()
      toolbar.append buttonset
)(jQuery)
