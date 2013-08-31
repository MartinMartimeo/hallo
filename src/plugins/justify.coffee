#     Hallo - a rich text editing jQuery UI widget
#     (c) 2011 Henri Bergius, IKS Consortium
#     Hallo may be freely distributed under the MIT license
((jQuery) ->
  jQuery.widget "IKS.hallojustify",
    options:
      editable: null
      uuid: ''
      justifies:
        left: true
        center: true
        right: true
      buttonCssClass: null

    populateToolbar: (toolbar) ->
      widget = this
      buttonset = jQuery "<span class=\"#{widget.widgetName}\"></span>"

      buttonize = (justify) =>
        buttonHolder = jQuery '<span></span>'
        buttonHolder.hallobutton
          label: justify
          editable: @options.editable
          command: "justify#{justify.charAt(0).toUpperCase()}#{justify.slice(1)}"
          icon: "glyphicon-align-#{justify}"
          uuid: @options.uuid
          cssClass: @options.buttonCssClass
        buttonset.append buttonHolder

      for justify, enabled of @options.justifies
        continue unless enabled
        buttonize justify

      buttonset.hallobuttonset()
      toolbar.append buttonset
)(jQuery)
