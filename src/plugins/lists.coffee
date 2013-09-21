#     Hallo - a rich text editing jQuery UI widget
#     (c) 2011 Henri Bergius, IKS Consortium
#     Hallo may be freely distributed under the MIT license
((jQuery) ->
  jQuery.widget "IKS.hallolists",
    options:
      editable: null
      toolbar: null
      uuid: ''
      lists:
        ordered: true
        unordered: true
      buttonCssClass: null

    populateToolbar: (toolbar) ->
      buttonset = jQuery "<span class=\"#{@widgetName}\"></span>"
      buttonize = (type, label, icon) =>
        buttonElement = jQuery '<button>'
        buttonElement.hallobutton
          uuid: @options.uuid
          editable: @options.editable
          label: label
          command: "insert#{type}List"
          icon: icon
          cssClass: @options.buttonCssClass
        buttonset.append buttonElement

      buttonize "Ordered", "ordered list", "glyphicon-list-ol" if @options.lists.ordered && @options.lists.unordered
      buttonize "Ordered", "list", "glyphicon-list" if @options.lists.ordered && !@options.lists.unordered
      buttonize "Unordered", "unordered list", "glyphicon-list-ul" if @options.lists.unordered && @options.lists.ordered
      buttonize "Unordered", "list", "glyphicon-list" if @options.lists.unordered && !@options.lists.ordered

      buttonset.hallobuttonset()
      toolbar.append buttonset
)(jQuery)