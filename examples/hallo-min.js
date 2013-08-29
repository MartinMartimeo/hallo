/* Hallo 1.0.2 - rich text editor for jQuery UI
 * by Henri Bergius and contributors. Available under the MIT license.
 * See http://hallojs.org for more information
 */!function () {
    !function (a) {
        return a.widget("IKS.hallo", {toolbar: null, bound: !1, originalContent: "", previousContent: "", uuid: "", selection: null, _keepActivated: !1, originalHref: null, options: {editable: !0, plugins: {}, toolbar: "halloToolbarContextual", parentElement: "body", buttonCssClass: null, toolbarCssClass: null, toolbarPositionAbove: !1, toolbarOptions: {}, placeholder: "", forceStructured: !0, checkTouch: !0, touchScreen: null}, _create: function () {
            var b, c, d, e = this;
            this.id = this._generateUUID(), this.options.checkTouch && null === this.options.touchScreen && this.checkTouch(), d = this.options.plugins;
            for (c in d)b = d[c], a.isPlainObject(b) || (b = {}), a.extend(b, {editable: this, uuid: this.id, buttonCssClass: this.options.buttonCssClass}), a(this.element)[c](b);
            return this.element.one("halloactivated", function () {
                return e._prepareToolbar()
            }), this.originalContent = this.getContents()
        }, _init: function () {
            return this.options.editable ? this.enable() : this.disable()
        }, destroy: function () {
            var b, c, d;
            this.disable(), this.toolbar && (this.toolbar.remove(), this.element[this.options.toolbar]("destroy")), d = this.options.plugins;
            for (c in d)b = d[c], a(this.element)[c]("destroy");
            return a.Widget.prototype.destroy.call(this)
        }, disable: function () {
            var b = this;
            return this.element.attr("contentEditable", !1), this.element.off("focus", this._activated), this.element.off("blur", this._deactivated), this.element.off("keyup paste change", this._checkModified), this.element.off("keyup", this._keys), this.element.off("keyup mouseup", this._checkSelection), this.bound = !1, a(this.element).removeClass("isModified"), a(this.element).removeClass("inEditMode"), this.element.parents("a").addBack().each(function (c, d) {
                var e;
                return e = a(d), e.is("a") && b.originalHref ? e.attr("href", b.originalHref) : void 0
            }), this._trigger("disabled", null)
        }, enable: function () {
            var b = this;
            return this.element.parents("a[href]").addBack().each(function (c, d) {
                var e;
                return e = a(d), e.is("a[href]") ? (b.originalHref = e.attr("href"), e.removeAttr("href")) : void 0
            }), this.element.attr("contentEditable", !0), a.parseHTML(this.element.html()) || (this.element.html(this.options.placeholder), a(this.element).addClass("inPlaceholderMode"), this.element.css({"min-width": this.element.innerWidth(), "min-height": this.element.innerHeight()})), this.bound || (this.element.on("focus", this, this._activated), this.element.on("blur", this, this._deactivated), this.element.on("keyup paste change", this, this._checkModified), this.element.on("keyup", this, this._keys), this.element.on("keyup mouseup", this, this._checkSelection), this.bound = !0), this.options.forceStructured && this._forceStructured(), this._trigger("enabled", null)
        }, activate: function () {
            return this.element.focus()
        }, containsSelection: function () {
            var a;
            return a = this.getSelection(), this.element.has(a.startContainer).length > 0
        }, getSelection: function () {
            var a, b;
            return b = rangy.getSelection(), a = null, a = b.rangeCount > 0 ? b.getRangeAt(0) : rangy.createRange()
        }, restoreSelection: function (a) {
            var b;
            return b = rangy.getSelection(), b.setSingleRange(a)
        }, replaceSelection: function (a) {
            var b, c, d, e, f;
            return"Microsoft Internet Explorer" === navigator.appName ? (f = document.selection.createRange().text, c = document.selection.createRange(), c.pasteHTML(a(f))) : (e = window.getSelection(), d = e.getRangeAt(0), b = document.createTextNode(a(d.extractContents())), d.insertNode(b), d.setStartAfter(b), e.removeAllRanges(), e.addRange(d))
        }, removeAllSelections: function () {
            return"Microsoft Internet Explorer" === navigator.appName ? range.empty() : window.getSelection().removeAllRanges()
        }, getPluginInstance: function (b) {
            var c;
            return c = a(this.element).data("IKS-" + b), c ? c : a(this.element).data(b)
        }, getContents: function () {
            var b, c;
            for (c in this.options.plugins)b = this.getPluginInstance(c).cleanupContentClone, a.isFunction(b) && a(this.element)[c]("cleanupContentClone", this.element);
            return this.element.html()
        }, setContents: function (a) {
            return this.element.html(a)
        }, isModified: function () {
            return this.previousContent || (this.previousContent = this.originalContent), this.previousContent !== this.getContents()
        }, setUnmodified: function () {
            return a(this.element).removeClass("isModified"), this.previousContent = this.getContents()
        }, setModified: function () {
            return a(this.element).addClass("isModified"), this._trigger("modified", null, {editable: this, content: this.getContents()})
        }, restoreOriginalContent: function () {
            return this.element.html(this.originalContent)
        }, execute: function (a, b) {
            return document.execCommand(a, !1, b) ? this.element.trigger("change") : void 0
        }, protectFocusFrom: function (a) {
            var b = this;
            return a.on("mousedown", function (a) {
                return a.preventDefault(), b._protectToolbarFocus = !0, setTimeout(function () {
                    return b._protectToolbarFocus = !1
                }, 300)
            })
        }, keepActivated: function (a) {
            this._keepActivated = a
        }, _generateUUID: function () {
            var a;
            return a = function () {
                return(0 | 65536 * (1 + Math.random())).toString(16).substring(1)
            }, "" + a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()
        }, _prepareToolbar: function () {
            var b, c, d, e;
            this.toolbar = a('<div class="hallotoolbar"></div>').hide(), this.options.toolbarCssClass && this.toolbar.addClass(this.options.toolbarCssClass), b = {editable: this, parentElement: this.options.parentElement, toolbar: this.toolbar, positionAbove: this.options.toolbarPositionAbove}, e = a.extend({}, b, this.options.toolbarOptions), this.element[this.options.toolbar](e);
            for (c in this.options.plugins)d = this.getPluginInstance(c).populateToolbar, a.isFunction(d) && this.element[c]("populateToolbar", this.toolbar);
            return this.element[this.options.toolbar]("setPosition"), this.protectFocusFrom(this.toolbar)
        }, changeToolbar: function (a, b, c) {
            var d;
            return null == c && (c = !1), d = this.options.toolbar, this.options.parentElement = a, b && (this.options.toolbar = b), this.toolbar ? (this.element[d]("destroy"), this.toolbar.remove(), this._prepareToolbar(), c ? this.toolbar.hide() : void 0) : void 0
        }, _checkModified: function (a) {
            var b;
            return b = a.data, b.isModified() ? b.setModified() : void 0
        }, _keys: function (a) {
            var b, c;
            return c = a.data, 27 === a.keyCode ? (b = c.getContents(), c.restoreOriginalContent(a), c._trigger("restored", null, {editable: c, content: c.getContents(), thrown: b}), c.turnOff()) : void 0
        }, _rangesEqual: function (a, b) {
            return a.startContainer !== b.startContainer ? !1 : a.startOffset !== b.startOffset ? !1 : a.endContainer !== b.endContainer ? !1 : a.endOffset !== b.endOffset ? !1 : !0
        }, _checkSelection: function (a) {
            var b;
            if (27 !== a.keyCode)return b = a.data, setTimeout(function () {
                var c;
                return c = b.getSelection(), b._isEmptySelection(c) || b._isEmptyRange(c) ? (b.selection && (b.selection = null, b._trigger("unselected", null, {editable: b, originalEvent: a})), void 0) : b.selection && b._rangesEqual(c, b.selection) ? void 0 : (b.selection = c.cloneRange(), b._trigger("selected", null, {editable: b, selection: b.selection, ranges: [b.selection], originalEvent: a}))
            }, 0)
        }, _isEmptySelection: function (a) {
            return"Caret" === a.type ? !0 : !1
        }, _isEmptyRange: function (a) {
            return a.collapsed ? !0 : a.isCollapsed ? "function" == typeof a.isCollapsed ? a.isCollapsed() : a.isCollapsed : !1
        }, turnOn: function () {
            return this.getContents() === this.options.placeholder && this.setContents(""), a(this.element).removeClass("inPlaceholderMode"), a(this.element).addClass("inEditMode"), this._trigger("activated", null, this)
        }, turnOff: function () {
            return a(this.element).removeClass("inEditMode"), this._trigger("deactivated", null, this), this.getContents() ? void 0 : (a(this.element).addClass("inPlaceholderMode"), this.setContents(this.options.placeholder))
        }, _activated: function (a) {
            return a.data.turnOn()
        }, _deactivated: function (b) {
            return b.data._keepActivated ? void 0 : b.data._protectToolbarFocus !== !0 ? b.data.turnOff() : setTimeout(function () {
                return a(b.data.element).focus()
            }, 300)
        }, _forceStructured: function () {
            var a;
            try {
                return document.execCommand("styleWithCSS", 0, !1)
            } catch (b) {
                a = b;
                try {
                    return document.execCommand("useCSS", 0, !0)
                } catch (b) {
                    a = b;
                    try {
                        return document.execCommand("styleWithCSS", !1, !1)
                    } catch (b) {
                        a = b
                    }
                }
            }
        }, checkTouch: function () {
            return this.options.touchScreen = !!("createTouch"in document)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        var b;
        return b = null, void 0 !== this.VIE && (b = new VIE, b.use(new b.StanbolService({proxyDisabled: !0, url: "http://dev.iks-project.eu:8081"}))), a.widget("IKS.halloannotate", {options: {vie: b, editable: null, toolbar: null, uuid: "", select: function () {
        }, decline: function () {
        }, remove: function () {
        }, buttonCssClass: null}, _create: function () {
            var b, c, d;
            if (d = this, void 0 === this.options.vie)throw new Error("The halloannotate plugin requires VIE");
            if ("function" != typeof this.element.annotate)throw new Error("The halloannotate plugin requires annotate.js");
            return this.state = "off", this.instantiate(), c = function () {
                var b;
                return b = this, a(b).halloannotate("turnOff")
            }, b = this.options.editable.element, b.on("hallodisabled", c)
        }, populateToolbar: function (b) {
            var c, d = this;
            return c = a('<span class="' + this.widgetName + '"></span>'), this.button = c.hallobutton({label: "Annotate", icon: "glyphicon-tags", editable: this.options.editable, command: null, uuid: this.options.uuid, cssClass: this.options.buttonCssClass, queryState: !1}), c.on("change", function () {
                return"pending" !== d.state ? "off" === d.state ? d.turnOn() : d.turnOff() : void 0
            }), c.buttonset(), b.append(this.button)
        }, cleanupContentClone: function (b) {
            return"on" === this.state ? b.find(".entity:not([about])").each(function () {
                return a(this).replaceWith(a(this).html())
            }) : void 0
        }, instantiate: function () {
            var b;
            return b = this, this.options.editable.element.annotate({vie: this.options.vie, debug: !1, showTooltip: !0, select: this.options.select, remove: this.options.remove, success: this.options.success, error: this.options.error}).on("annotateselect",function () {
                return b.options.editable.setModified()
            }).on("annotateremove", function () {
                return a.noop()
            })
        }, turnPending: function () {
            return this.state = "pending", this.button.hallobutton("checked", !1), this.button.hallobutton("disable")
        }, turnOn: function () {
            var a, b, c = this;
            this.turnPending(), b = this;
            try {
                return this.options.editable.element.annotate("enable", function (a) {
                    return a ? (c.state = "on", c.button.hallobutton("checked", !0), c.button.hallobutton("enable")) : void 0
                })
            } catch (d) {
                return a = d, alert(a)
            }
        }, turnOff: function () {
            return this.options.editable.element.annotate("disable"), this.state = "off", this.button ? (this.button.attr("checked", !1), this.button.find("label").removeClass("ui-state-clicked"), this.button.button("refresh")) : void 0
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloblacklist", {options: {tags: []}, _init: function () {
            return-1 !== this.options.tags.indexOf("br") ? this.element.on("keydown", function (a) {
                return 13 === a.originalEvent.keyCode ? a.preventDefault() : void 0
            }) : void 0
        }, cleanupContentClone: function (b) {
            var c, d, e, f, g;
            for (f = this.options.tags, g = [], d = 0, e = f.length; e > d; d++)c = f[d], g.push(a(c, b).remove());
            return g
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloblock", {options: {editable: null, toolbar: null, uuid: "", elements: ["h1", "h2", "h3", "p", "pre", "blockquote"], buttonCssClass: null}, populateToolbar: function (b) {
            var c, d, e;
            return c = a('<span class="' + this.widgetName + '"></span>'), d = "" + this.options.uuid + "-" + this.widgetName + "-data", e = this._prepareDropdown(d), b.append(c), c.hallobuttonset(), c.append(e), c.append(this._prepareButton(e))
        }, _prepareDropdown: function (b) {
            var c, d, e, f, g, h, i, j = this;
            for (e = a('<div id="' + b + '"></div>'), d = this.options.editable.element.get(0).tagName.toLowerCase(), c = function (b) {
                var c, e, f;
                return c = a("<button class='blockselector'>          <" + b + ' class="menu-item">' + b + "</" + b + ">        </button>"), d === b && c.addClass("selected"), "div" !== d && c.addClass("disabled"), c.on("click", function () {
                    var a;
                    return a = b.toUpperCase(), c.hasClass("disabled") ? void 0 : "Microsoft Internet Explorer" === navigator.appName ? (j.options.editable.execute("FormatBlock", "<" + a + ">"), void 0) : j.options.editable.execute("formatBlock", a)
                }), f = function () {
                    var a;
                    return a = document.queryCommandValue("formatBlock"), a.toLowerCase() === b ? (c.addClass("selected"), void 0) : c.removeClass("selected")
                }, e = "keyup paste change mouseup", j.options.editable.element.on(e, f), j.options.editable.element.on("halloenabled", function () {
                    return j.options.editable.element.on(e, f)
                }), j.options.editable.element.on("hallodisabled", function () {
                    return j.options.editable.element.off(e, f)
                }), c
            }, i = this.options.elements, g = 0, h = i.length; h > g; g++)f = i[g], e.append(c(f));
            return e
        }, _prepareButton: function (b) {
            var c;
            return c = a("<span></span>"), c.hallodropdownbutton({uuid: this.options.uuid, editable: this.options.editable, label: "block", icon: "glyphicon-text-height", target: b, cssClass: this.options.buttonCssClass}), c
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        var b;
        return b = "The hallocleanhtml plugin requires the selection save and    restore module from Rangy", a.widget("IKS.hallocleanhtml", {_create: function () {
            var c, d = this;
            if (void 0 === a.htmlClean)throw new Error("The hallocleanhtml plugin requires jQuery.htmlClean");
            return c = this.element, c.bind("paste", this, function (e) {
                var f, g, h;
                if (void 0 === rangy.saveSelection)throw new Error(b);
                return h = e.data, h.options.editable.getSelection().deleteContents(), g = rangy.saveSelection(), f = c.html(), c.html(""), setTimeout(function () {
                    var b, e, i, j;
                    if (i = c.html(), b = a.htmlClean(i, d.options), c.html(f), rangy.restoreSelection(g), "" !== b)try {
                        return document.execCommand("insertHTML", !1, b)
                    } catch (k) {
                        return e = k, j = h.options.editable.getSelection(), j.insertNode(j.createContextualFragment(b))
                    }
                }, 4)
            })
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloformat", {options: {editable: null, uuid: "", formattings: {bold: !0, italic: !0, strikeThrough: !1, underline: !1}, buttonCssClass: null}, populateToolbar: function (b) {
            var c, d, e, f, g, h, i = this;
            g = this, d = a('<span class="' + g.widgetName + '"></span>'), c = function (b) {
                var c;
                return c = a("<span></span>"), c.hallobutton({label: b, editable: i.options.editable, command: b, uuid: i.options.uuid, cssClass: i.options.buttonCssClass}), d.append(c)
            }, h = this.options.formattings;
            for (f in h)e = h[f], e && c(f);
            return d.hallobuttonset(), b.append(d)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloheadings", {options: {editable: null, uuid: "", formatBlocks: ["p", "h1", "h2", "h3"], buttonCssClass: null}, populateToolbar: function (b) {
            var c, d, e, f, g, h, i, j, k, l = this;
            for (h = this, d = a('<span class="' + h.widgetName + '"></span>'), g = "Microsoft Internet Explorer" === navigator.appName, e = g ? "FormatBlock" : "formatBlock", c = function (b) {
                var c;
                return c = a("<span></span>"), c.hallobutton({label: b, editable: l.options.editable, command: e, commandValue: g ? "<" + b + ">" : b, uuid: l.options.uuid, cssClass: l.options.buttonCssClass, queryState: function () {
                    var a, d, f, h, i, j, k, l, m;
                    try {
                        if (j = document.queryCommandValue(e), g) {
                            for (f = {p: "normal"}, m = [1, 2, 3, 4, 5, 6], k = 0, l = m.length; l > k; k++)i = m[k], f["h" + i] = i;
                            a = j.match(new RegExp(f[b], "i"))
                        } else a = j.match(new RegExp(b, "i"));
                        return h = a ? !0 : !1, c.hallobutton("checked", h)
                    } catch (n) {
                        d = n
                    }
                }}), c.find("button .ui-button-text").text(b.toUpperCase()), d.append(c)
            }, k = this.options.formatBlocks, i = 0, j = k.length; j > i; i++)f = k[i], c(f);
            return d.hallobuttonset(), b.append(d)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.hallohtml", {options: {editable: null, toolbar: null, uuid: "", lang: "en", dialogOpts: {autoOpen: !1, width: 600, height: "auto", modal: !1, resizable: !0, draggable: !0, dialogClass: "htmledit-dialog"}, dialog: null, buttonCssClass: null}, translations: {en: {title: "Edit HTML", update: "Update"}, de: {title: "HTML bearbeiten", update: "Aktualisieren"}}, texts: null, populateToolbar: function (b) {
            var c, d, e, f, g;
            return g = this, this.texts = this.translations[this.options.lang], this.options.toolbar = b, f = "" + this.options.uuid + "-htmledit-dialog", this.options.dialog = a("<div>").attr("id", f), d = a("<span>").addClass(g.widgetName), e = "" + this.options.uuid + "-htmledit", c = a("<span>"), c.hallobutton({label: this.texts.title, icon: "glyphicon-list-alt", editable: this.options.editable, command: null, queryState: !1, uuid: this.options.uuid, cssClass: this.options.buttonCssClass}), d.append(c), this.button = c, this.button.click(function () {
                return g.options.dialog.dialog("isOpen") ? g._closeDialog() : g._openDialog(), !1
            }), this.options.editable.element.on("hallodeactivated", function () {
                return g._closeDialog()
            }), b.append(d), this.options.dialog.dialog(this.options.dialogOpts), this.options.dialog.dialog("option", "title", this.texts.title)
        }, _openDialog: function () {
            var b, c, d, e, f, g = this;
            return d = this, b = a(this.options.editable.element), e = b.offset().left + b.outerWidth() + 10, f = this.options.toolbar.offset().top - a(document).scrollTop(), this.options.dialog.dialog("option", "position", [e, f]), this.options.editable.keepActivated(!0), this.options.dialog.dialog("open"), this.options.dialog.on("dialogclose", function () {
                return a("label", g.button).removeClass("ui-state-active"), g.options.editable.element.focus(), g.options.editable.keepActivated(!1)
            }), this.options.dialog.html(a("<textarea>").addClass("html_source")), c = this.options.editable.element.html(), this.options.dialog.children(".html_source").val(c), this.options.dialog.prepend(a("<button>" + this.texts.update + "</button>")), this.options.dialog.on("click", "button", function () {
                return c = d.options.dialog.children(".html_source").val(), d.options.editable.element.html(c), d.options.editable.element.trigger("change"), !1
            })
        }, _closeDialog: function () {
            return this.options.dialog.dialog("close")
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloimage", {options: {editable: null, toolbar: null, uuid: "", limit: 8, search: null, searchUrl: null, suggestions: null, loaded: null, upload: null, uploadUrl: null, dialogOpts: {autoOpen: !1, width: 270, height: "auto", title: "Insert Images", modal: !1, resizable: !1, draggable: !0, dialogClass: "halloimage-dialog"}, dialog: null, buttonCssClass: null, entity: null, vie: null, dbPediaUrl: "http://dev.iks-project.eu/stanbolfull", maxWidth: 250, maxHeight: 250}, populateToolbar: function (b) {
            var c, d, e, f, g, h, i;
            return this.options.toolbar = b, i = this, e = "" + this.options.uuid + "-image-dialog", this.options.dialog = a('<div id="' + e + '">        <div class="nav">          <ul class="tabs">          </ul>          <div id="' + this.options.uuid + '-tab-activeIndicator"            class="tab-activeIndicator" />        </div>        <div class="dialogcontent">        </div>'), h = a(".tabs", this.options.dialog), g = a(".dialogcontent", this.options.dialog), i.options.suggestions && this._addGuiTabSuggestions(h, g), (i.options.search || i.options.searchUrl) && this._addGuiTabSearch(h, g), (i.options.upload || i.options.uploadUrl) && this._addGuiTabUpload(h, g), this.current = a('<div class="currentImage"></div>').halloimagecurrent({uuid: this.options.uuid, imageWidget: this, editable: this.options.editable, dialog: this.options.dialog, maxWidth: this.options.maxWidth, maxHeight: this.options.maxHeight}), a(".dialogcontent", this.options.dialog).append(this.current), d = a('<span class="' + i.widgetName + '"></span>'), f = "" + this.options.uuid + "-image", c = a("<span></span>"), c.hallobutton({label: "Images", icon: "glyphicon-picture", editable: this.options.editable, command: null, queryState: !1, uuid: this.options.uuid, cssClass: this.options.buttonCssClass}), d.append(c), this.button = c, this.button.on("click", function () {
                return i.options.dialog.dialog("isOpen") ? i._closeDialog() : i._openDialog(), !1
            }), this.options.editable.element.on("hallodeactivated", function () {
                return i._closeDialog()
            }), a(this.options.editable.element).delegate("img", "click", function () {
                return i._openDialog()
            }), b.append(d), this.options.dialog.dialog(this.options.dialogOpts), this._handleTabs()
        }, setCurrent: function (a) {
            return this.current.halloimagecurrent("setImage", a)
        }, _handleTabs: function () {
            var b;
            return b = this, a(".nav li", this.options.dialog).on("click", function () {
                var c, d;
                return a("." + b.widgetName + "-tab").hide(), c = a(this).attr("id"), a("#" + c + "-content").show(), d = a(this).position().left + a(this).width() / 2, a("#" + b.options.uuid + "-tab-activeIndicator").css({"margin-left": d})
            }), a(".nav li", this.options.dialog).first().click()
        }, _openDialog: function () {
            var b, c, d, e, f, g, h, i, j = this;
            return g = this, b = function () {
                return window.setTimeout(function () {
                    var b;
                    return b = a(".imageThumbnail"), a(b).each(function () {
                        var b;
                        return b = a("#" + this.id).width(), 20 >= b ? a("#" + this.id).parent("li").remove() : void 0
                    })
                }, 15e3)
            }, e = "#" + this.options.uuid + "-tab-suggestions-content", d = function () {
                return a(".imageThumbnailActive", e).first().attr("src")
            }, a("#" + this.options.uuid + "-sugg-activeImage").attr("src", d()), a("#" + this.options.uuid + "-sugg-activeImageBg").attr("src", d()), this.lastSelection = this.options.editable.getSelection(), c = a(this.options.editable.element), f = a(this.options.toolbar), h = c.offset().left + c.outerWidth() - 3, i = f.offset().top + f.outerHeight() + 29, i -= a(document).scrollTop(), this.options.dialog.dialog("option", "position", [h, i]), b(), g.options.loaded = 1, this.options.editable.keepActivated(!0), this.options.dialog.dialog("open"), this.options.dialog.on("dialogclose", function () {
                return a("label", j.button).removeClass("ui-state-active"), j.options.editable.element.focus(), j.options.editable.keepActivated(!1)
            })
        }, _closeDialog: function () {
            return this.options.dialog.dialog("close")
        }, _addGuiTabSuggestions: function (b, c) {
            var d;
            return b.append(a('<li id="' + this.options.uuid + '-tab-suggestions"        class="' + this.widgetName + "-tabselector " + this.widgetName + '-tab-suggestions">          <span>Suggestions</span>        </li>')), d = a('<div id="' + this.options.uuid + '-tab-suggestions-content"        class="' + this.widgetName + '-tab tab-suggestions"></div>'), c.append(d), d.halloimagesuggestions({uuid: this.options.uuid, imageWidget: this, entity: this.options.entity})
        }, _addGuiTabSearch: function (b, c) {
            var d, e, f;
            return f = this, d = "" + this.options.uuid + "-image-dialog", b.append(a('<li id="' + this.options.uuid + '-tab-search"        class="' + this.widgetName + "-tabselector " + this.widgetName + '-tab-search">          <span>Search</span>        </li>')), e = a('<div id="' + this.options.uuid + '-tab-search-content"        class="' + f.widgetName + '-tab tab-search"></div>'), c.append(e), e.halloimagesearch({uuid: this.options.uuid, imageWidget: this, searchCallback: this.options.search, searchUrl: this.options.searchUrl, limit: this.options.limit, entity: this.options.entity})
        }, _addGuiTabUpload: function (b, c) {
            var d;
            return b.append(a('<li id="' + this.options.uuid + '-tab-upload"        class="' + this.widgetName + "-tabselector " + this.widgetName + '-tab-upload">          <span>Upload</span>        </li>')), d = a('<div id="' + this.options.uuid + '-tab-upload-content"        class="' + this.widgetName + '-tab tab-upload"></div>'), c.append(d), d.halloimageupload({uuid: this.options.uuid, uploadCallback: this.options.upload, uploadUrl: this.options.uploadUrl, imageWidget: this, entity: this.options.entity})
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.hallo-image-insert-edit", {options: {editable: null, toolbar: null, uuid: "", insert_file_dialog_ui_url: null, lang: "en", dialogOpts: {autoOpen: !1, width: 560, height: "auto", modal: !1, resizable: !0, draggable: !0, dialogClass: "insert-image-dialog"}, dialog: null, buttonCssClass: null}, translations: {en: {title_insert: "Insert Image", title_properties: "Image Properties", insert: "Insert", chage_image: "Change Image:", source: "URL", width: "Width", height: "Height", alt: "Alt Text", padding: "Padding", "float": "Float", float_left: "left", float_right: "right", float_none: "No"}, de: {title_insert: "Bild einfügen", title_properties: "Bildeigenschaften", insert: "Einfügen", chage_image: "Bild ändern:", source: "URL", width: "Breite", height: "Höhe", alt: "Alt Text", padding: "Padding", "float": "Float", float_left: "Links", float_right: "Rechts", float_none: "Nein"}}, texts: null, dialog_image_selection_ui_loaded: !1, $image: null, populateToolbar: function (b) {
            var c, d, e, f;
            return f = this, this.texts = this.translations[this.options.lang], this.options.toolbar = b, e = "<div id='hallo_img_properties'></div>", this.options.insert_file_dialog_ui_url && (e += "<div id='hallo_img_file_select_ui'></div>"), this.options.dialog = a("<div>").attr("id", "" + this.options.uuid + "-insert-image-dialog").html(e), d = a("<span>").addClass(this.widgetName), c = a("<span>"), c.hallobutton({label: this.texts.title_insert, icon: "glyphicon-picture", editable: this.options.editable, command: null, queryState: !1, uuid: this.options.uuid, cssClass: this.options.buttonCssClass}), d.append(c), this.button = c, this.button.click(function () {
                return f.options.dialog.dialog("isOpen") ? f._closeDialog() : (f.lastSelection = f.options.editable.getSelection(), f._openDialog()), !1
            }), this.options.editable.element.on("halloselected, hallounselected", function () {
                return f.options.dialog.dialog("isOpen") ? f.lastSelection = f.options.editable.getSelection() : void 0
            }), this.options.editable.element.on("hallodeactivated", function () {
                return f._closeDialog()
            }), a(this.options.editable.element).on("click", "img", function () {
                return f._openDialog(a(this)), !1
            }), this.options.editable.element.on("halloselected", function (c, d) {
                var e;
                return e = f.options.editable.options.toolbar, "halloToolbarContextual" === e && a(d.originalEvent.target).is("img") ? (b.hide(), !1) : void 0
            }), b.append(d), this.options.dialog.dialog(this.options.dialogOpts)
        }, _openDialog: function (b) {
            var c, d, e, f, g = this;
            return this.$image = b, d = this, c = a(this.options.editable.element), e = c.offset().left + c.outerWidth() + 10, f = this.$image ? this.$image.offset().top - a(document).scrollTop() : this.options.toolbar.offset().top - a(document).scrollTop(), this.options.dialog.dialog("option", "position", [e, f]), this.options.editable.keepActivated(!0), this.options.dialog.dialog("open"), this.$image ? (this.options.dialog.dialog("option", "title", this.texts.title_properties), a(document).keyup(function (b) {
                return(46 === b.keyCode || 8 === b.keyCode) && (a(document).off(), d._closeDialog(), d.$image.remove(), d.$image = null), b.preventDefault()
            }), this.options.editable.element.on("click", function () {
                return d.$image = null, d._closeDialog()
            })) : (this.options.dialog.children("#hallo_img_properties").hide(), this.options.dialog.dialog("option", "title", this.texts.title_insert), a("#hallo_img_file_select_title").length > 0 && a("#hallo_img_file_select_title").text("")), this._load_dialog_image_properties_ui(), this.options.dialog.on("dialogclose", function () {
                var b;
                return a("label", g.button).removeClass("ui-state-active"), b = a(document).scrollTop(), g.options.editable.element.focus(), a(document).scrollTop(b), g.options.editable.keepActivated(!1)
            }), this.options.insert_file_dialog_ui_url && !this.dialog_image_selection_ui_loaded ? (this.options.dialog.on("click", ".reload_link", function () {
                return d._load_dialog_image_selection_ui(), !1
            }), this.options.dialog.on("click", ".file_preview img", function () {
                var b;
                return d.$image ? (b = a(this).attr("src").replace(/-thumb/, ""), d.$image.attr("src", b), a("#hallo_img_source").val(b)) : d._insert_image(a(this).attr("src").replace(/-thumb/, "")), !1
            }), this._load_dialog_image_selection_ui()) : void 0
        }, _insert_image: function (a) {
            return this.options.editable.restoreSelection(this.lastSelection), document.execCommand("insertImage", null, a), this.options.editable.element.trigger("change"), this.options.editable.removeAllSelections(), this._closeDialog()
        }, _closeDialog: function () {
            return this.options.dialog.dialog("close")
        }, _load_dialog_image_selection_ui: function () {
            var b;
            return b = this, a.ajax({url: this.options.insert_file_dialog_ui_url, success: function (a) {
                var c, d, e;
                return d = "", c = b.options.dialog.children("#hallo_img_properties"), c.is(":visible") && (d = b.texts.change_image), e = "<div id='hallo_img_file_select_title'>" + d + "</div>", b.options.dialog.children("#hallo_img_file_select_ui").html(e + a), b.dialog_image_selection_ui_loaded = !0
            }, beforeSend: function () {
                return b.options.dialog.children("#hallo_img_file_select_ui").html('<div class="hallo_insert_file_loader"></div>')
            }})
        }, _load_dialog_image_properties_ui: function () {
            var b, c, d, e, f, g;
            return f = this, b = this.options.dialog.children("#hallo_img_properties"), this.$image ? (g = this.$image.is("[width]") ? this.$image.attr("width") : "", d = this.$image.is("[height]") ? this.$image.attr("height") : "", e = this._property_input_html("source", this.$image.attr("src"), {label: this.texts.source}) + this._property_input_html("alt", this.$image.attr("alt") || "", {label: this.texts.alt}) + this._property_row_html(this._property_input_html("width", g, {label: this.texts.width, row: !1}) + this._property_input_html("height", d, {label: this.texts.height, row: !1})) + this._property_input_html("padding", this.$image.css("padding"), {label: this.texts.padding}) + this._property_row_html(this._property_cb_html("float_left", "left" === this.$image.css("float"), {label: this.texts.float_left, row: !1}) + this._property_cb_html("float_right", "right" === this.$image.css("float"), {label: this.texts.float_right, row: !1}) + this._property_cb_html("unfloat", "none" === this.$image.css("float"), {label: this.texts.float_none, row: !1}), this.texts[float]), b.html(e), b.show()) : this.options.insert_file_dialog_ui_url || (b.html(this._property_input_html("source", "", {label: this.texts.source})), b.show()), this.$image ? (this.options.insert_file_dialog_ui_url || a("#insert_image_btn").remove(), a("#hallo_img_file_select_title").length > 0 && a("#hallo_img_file_select_title").text(this.texts.chage_image), a("#hallo_img_properties #hallo_img_source").keyup(function () {
                return f.$image.attr("src", this.value)
            }), a("#hallo_img_properties #hallo_img_alt").keyup(function () {
                return f.$image.attr("alt", this.value)
            }), a("#hallo_img_properties #hallo_img_padding").keyup(function () {
                return f.$image.css("padding", this.value)
            }), a("#hallo_img_properties #hallo_img_height").keyup(function () {
                return f.$image.css("height", this.value), f.$image.attr("height", this.value)
            }), a("#hallo_img_properties #hallo_img_width").keyup(function () {
                return f.$image.css("width", this.value), f.$image.attr("width", this.value)
            }), a("#hallo_img_properties #hallo_img_float_left").click(function () {
                return this.checked ? (f.$image.css("float", "left"), a("#hallo_img_properties #hallo_img_float_right").removeAttr("checked"), a("#hallo_img_properties #hallo_img_unfloat").removeAttr("checked")) : !1
            }), a("#hallo_img_properties #hallo_img_float_right").click(function () {
                return this.checked ? (f.$image.css("float", "right"), a("#hallo_img_properties #hallo_img_unfloat").removeAttr("checked"), a("#hallo_img_properties #hallo_img_float_left").removeAttr("checked")) : !1
            }), a("#hallo_img_properties #hallo_img_unfloat").click(function () {
                return this.checked ? (f.$image.css("float", "none"), a("#hallo_img_properties #hallo_img_float_right").removeAttr("checked"), a("#hallo_img_properties #hallo_img_float_left").removeAttr("checked")) : !1
            })) : this.options.insert_file_dialog_ui_url ? void 0 : (c = '<button id="insert_image_btn">' + this.texts.insert + "</button>", b.after(c), a("#insert_image_btn").click(function () {
                var b;
                return b = a("#hallo_img_properties #hallo_img_source"), f._insert_image(b.val())
            }))
        }, _property_col_html: function (a) {
            return"<div class='hallo_img_property_col'>" + a + "</div>"
        }, _property_row_html: function (a, b) {
            return null == b && (b = ""), a = this._property_col_html(b) + this._property_col_html(a), "<div class='hallo_img_property_row'>" + a + "</div>"
        }, _property_html: function (a, b) {
            var c;
            return null == b && (b = {}), b.row === !1 ? (b.label && (c = "" + b.label + " " + a, a = "<span class='img_property_entry'>" + c + "</span>"), a) : (c = "<span class='img_property_entry'>" + a + "</span>", this._property_row_html(c, b.label))
        }, _property_input_html: function (a, b, c) {
            var d;
            return null == c && (c = {}), d = "<input type='text' id='hallo_img_" + a + "' value='" + b + "'>", this._property_html(d, c)
        }, _property_cb_html: function (a, b, c) {
            var d, e;
            return null == c && (c = {}), e = b ? "checked=checked" : "", d = "<input type='checkbox' id='hallo_img_" + a + "' " + e + "'>", this._property_html(d, c)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloindicator", {options: {editable: null, className: "halloEditIndicator"}, _create: function () {
            var a = this;
            return this.element.on("halloenabled", function () {
                return a.buildIndicator()
            })
        }, populateToolbar: function () {
        }, buildIndicator: function () {
            var b;
            return b = a('<div><i class="glyphicon-edit"></i> Edit</div>'), b.addClass(this.options.className), b.hide(), this.element.before(b), this.bindIndicator(b), this.setIndicatorPosition(b)
        }, bindIndicator: function (b) {
            var c = this;
            return b.on("click", function () {
                return c.options.editable.element.focus()
            }), this.element.on("halloactivated", function () {
                return b.hide()
            }), this.element.on("hallodisabled", function () {
                return b.remove()
            }), this.options.editable.element.hover(function () {
                return a(this).hasClass("inEditMode") ? void 0 : b.show()
            }, function (c) {
                return a(this).hasClass("inEditMode") || c.relatedTarget === b.get(0) ? void 0 : b.hide()
            })
        }, setIndicatorPosition: function (a) {
            var b;
            return a.css("position", "absolute"), b = this.element.position(), a.css("top", b.top + 2), a.css("left", b.left + 2)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.hallojustify", {options: {editable: null, toolbar: null, uuid: "", buttonCssClass: null}, populateToolbar: function (b) {
            var c, d, e = this;
            return d = a('<span class="' + this.widgetName + '"></span>'), c = function (b) {
                var c;
                return c = a("<span></span>"), c.hallobutton({uuid: e.options.uuid, editable: e.options.editable, label: b, command: "justify" + b, icon: "glyphicon-align-" + b.toLowerCase(), cssClass: e.options.buttonCssClass}), d.append(c)
            }, c("Left"), c("Center"), c("Right"), d.hallobuttonset(), b.append(d)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.hallolink", {options: {editable: null, uuid: "", link: !0, image: !0, defaultUrl: "http://", dialogOpts: {autoOpen: !1, width: 540, height: 200, title: "Enter Link", buttonTitle: "Insert", buttonUpdateTitle: "Update", modal: !0, resizable: !1, draggable: !1, dialogClass: "hallolink-dialog"}, buttonCssClass: null}, populateToolbar: function (b) {
            var c, d, e, f, g, h, i, j, k, l, m = this;
            return l = this, h = "" + this.options.uuid + "-dialog", c = this.options.dialogOpts.buttonTitle, d = this.options.dialogOpts.buttonUpdateTitle, g = a('<div id="' + h + '">        <form action="#" method="post" class="linkForm">          <input class="url" type="text" name="url"            value="' + this.options.defaultUrl + '" />          <input type="submit" id="addlinkButton" value="' + c + '"/>        </form></div>'), k = a("input[name=url]", g), j = function (a) {
                return new RegExp(/^\s*$/).test(a) ? !0 : a === l.options.defaultUrl ? !0 : !1
            }, i = function (b) {
                var c, d;
                return b.preventDefault(), c = k.val(), g.dialog("close"), l.options.editable.restoreSelection(l.lastSelection), j(c) ? document.execCommand("unlink", null, "") : (/:\/\//.test(c) || /^mailto:/.test(c) || (c = "http://" + c), void 0 === l.lastSelection.startContainer.parentNode.href ? l.lastSelection.collapsed ? (d = a("<a href='" + c + "'>" + c + "</a>")[0], l.lastSelection.insertNode(d)) : document.execCommand("createLink", null, c) : l.lastSelection.startContainer.parentNode.href = c), l.options.editable.element.trigger("change"), !1
            }, g.find("input[type=submit]").click(i), f = a('<span class="' + l.widgetName + '"></span>'), e = function (b) {
                var e, h, i;
                return i = "" + m.options.uuid + "-" + b, h = a("<span></span>"), h.hallobutton({label: "Link", icon: "glyphicon-link", editable: m.options.editable, command: null, queryState: !1, uuid: m.options.uuid, cssClass: m.options.buttonCssClass}), f.append(h), e = h, e.on("click", function () {
                    var b, e;
                    return l.lastSelection = l.options.editable.getSelection(), k = a("input[name=url]", g), e = l.lastSelection.startContainer.parentNode, e.href ? (k.val(a(e).attr("href")), b = "input[type=submit]", a(k[0].form).find(b).val(d)) : (k.val(l.options.defaultUrl), a(k[0].form).find("input[type=submit]").val(c)), l.options.editable.keepActivated(!0), g.dialog("open"), g.on("dialogclose", function () {
                        return l.options.editable.restoreSelection(l.lastSelection), a("label", h).removeClass("ui-state-active"), l.options.editable.element.focus(), l.options.editable.keepActivated(!1)
                    }), !1
                }), m.element.on("keyup paste change mouseup", function () {
                    var b, c;
                    return c = a(l.options.editable.getSelection().startContainer), b = c.prop("nodeName") ? c.prop("nodeName") : c.parent().prop("nodeName"), b && "A" === b.toUpperCase() ? (a("label", e).addClass("ui-state-active"), void 0) : a("label", e).removeClass("ui-state-active")
                })
            }, this.options.link && e("A"), this.options.link ? (b.append(f), f.hallobuttonset(), g.dialog(this.options.dialogOpts)) : void 0
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.hallolists", {options: {editable: null, toolbar: null, uuid: "", lists: {ordered: !0, unordered: !0}, buttonCssClass: null}, populateToolbar: function (b) {
            var c, d, e = this;
            return d = a('<span class="' + this.widgetName + '"></span>'), c = function (b, c) {
                var f;
                return f = a("<span></span>"), f.hallobutton({uuid: e.options.uuid, editable: e.options.editable, label: c, command: "insert" + b + "List", icon: "glyphicon-list-" + c.toLowerCase(), cssClass: e.options.buttonCssClass}), d.append(f)
            }, this.options.lists.ordered && c("Ordered", "OL"), this.options.lists.unordered && c("Unordered", "UL"), d.hallobuttonset(), b.append(d)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("Liip.hallooverlay", {options: {editable: null, toolbar: null, uuid: "", overlay: null, padding: 10, background: null}, _create: function () {
            var b;
            return b = this, this.options.bound ? void 0 : (this.options.bound = !0, this.options.editable.element.on("halloactivated", function (c) {
                return b.options.currentEditable = a(c.target), b.options.visible ? void 0 : b.showOverlay()
            }), this.options.editable.element.on("hallomodified", function (c) {
                return b.options.currentEditable = a(c.target), b.options.visible ? b.resizeOverlay() : void 0
            }), this.options.editable.element.on("hallodeactivated", function (c) {
                return b.options.currentEditable = a(c.target), b.options.visible ? b.hideOverlay() : void 0
            }))
        }, showOverlay: function () {
            return this.options.visible = !0, null === this.options.overlay && (a("#halloOverlay").length > 0 ? this.options.overlay = a("#halloOverlay") : (this.options.overlay = a('<div id="halloOverlay"            class="halloOverlay">'), a(document.body).append(this.options.overlay)), this.options.overlay.on("click", a.proxy(this.options.editable.turnOff, this.options.editable))), this.options.overlay.show(), null === this.options.background && (a("#halloBackground").length > 0 ? this.options.background = a("#halloBackground") : (this.options.background = a('<div id="halloBackground"            class="halloBackground">'), a(document.body).append(this.options.background))), this.resizeOverlay(), this.options.background.show(), this.options.originalZIndex || (this.options.originalZIndex = this.options.currentEditable.css("z-index")), this.options.currentEditable.css("z-index", "350")
        }, resizeOverlay: function () {
            var a;
            return a = this.options.currentEditable.offset(), this.options.background.css({top: a.top - this.options.padding, left: a.left - this.options.padding, width: this.options.currentEditable.width() + 2 * this.options.padding, height: this.options.currentEditable.height() + 2 * this.options.padding})
        }, hideOverlay: function () {
            return this.options.visible = !1, this.options.overlay.hide(), this.options.background.hide(), this.options.currentEditable.css("z-index", this.options.originalZIndex)
        }, _findBackgroundColor: function (a) {
            var b;
            return b = a.css("background-color"), "rgba(0, 0, 0, 0)" !== b && "transparent" !== b ? b : a.is("body") ? "white" : this._findBackgroundColor(a.parent())
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloreundo", {options: {editable: null, toolbar: null, uuid: "", buttonCssClass: null}, populateToolbar: function (b) {
            var c, d, e = this;
            return d = a('<span class="' + this.widgetName + '"></span>'), c = function (b, c) {
                var f;
                return f = a("<span></span>"), f.hallobutton({uuid: e.options.uuid, editable: e.options.editable, label: c, icon: "undo" === b ? "glyphicon-undo" : "glyphicon-repeat", command: b, queryState: !1, cssClass: e.options.buttonCssClass}), d.append(f)
            }, c("undo", "Undo"), c("redo", "Redo"), d.hallobuttonset(), b.append(d)
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("Liip.hallotoolbarlinebreak", {options: {editable: null, uuid: "", breakAfter: []}, populateToolbar: function (b) {
            var c, d, e, f, g, h, i, j, k, l, m;
            for (e = a(".ui-buttonset", b), f = a(), h = 0, m = this.options.breakAfter, i = 0, k = m.length; k > i; i++)for (g = m[i], h++, c = '<div          class="halloButtonrow halloButtonrow-' + h + '" />', j = 0, l = e.length; l > j; j++)if (d = e[j], f = a(f).add(a(d)), a(d).hasClass(g)) {
                f.wrapAll(c), e = e.not(f), f = a();
                break
            }
            return e.length > 0 ? (h++, c = '<div          class="halloButtonrow halloButtonrow-' + h + '" />', e.wrapAll(c)) : void 0
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloToolbarContextual", {toolbar: null, options: {parentElement: "body", editable: null, toolbar: null, positionAbove: !1}, _create: function () {
            var b = this;
            return this.toolbar = this.options.toolbar, a(this.options.parentElement).append(this.toolbar), this._bindEvents(), a(window).resize(function (a) {
                return b._updatePosition(b._getPosition(a))
            })
        }, _getPosition: function (a, b) {
            var c, d;
            if (a)switch (c = a.type) {
                case"keydown":
                case"keyup":
                case"keypress":
                    return this._getCaretPosition(b);
                case"click":
                case"mousedown":
                case"mouseup":
                    return d = {top: a.pageY, left: a.pageX}
            }
        }, _getCaretPosition: function (b) {
            var c, d, e;
            return e = a("<span/>"), c = rangy.createRange(), c.setStart(b.endContainer, b.endOffset), c.insertNode(e.get(0)), d = {top: e.offset().top, left: e.offset().left}, e.remove(), d
        }, setPosition: function () {
            return"body" !== this.options.parentElement && (this.options.parentElement = "body", a(this.options.parentElement).append(this.toolbar)), this.toolbar.css("position", "absolute"), this.toolbar.css("top", this.element.offset().top - 20), this.toolbar.css("left", this.element.offset().left)
        }, _updatePosition: function (b, c) {
            var d, e, f, g, h;
            return null == c && (c = null), b && b.top && b.left ? (f = this.toolbar.outerHeight() + 10, c && !c.collapsed && c.nativeRange ? (e = c.nativeRange.getBoundingClientRect(), h = this.options.positionAbove ? e.top - f : e.bottom + 10, g = a(window).scrollTop() + h, d = a(window).scrollLeft() + e.left) : (h = this.options.positionAbove ? -10 - f : 20, g = b.top + h, d = b.left - this.toolbar.outerWidth() / 2 + 30), this.toolbar.css("top", g), this.toolbar.css("left", d)) : void 0
        }, _bindEvents: function () {
            var a = this;
            return this.element.on("click", function (b) {
                var c, d;
                return c = {}, d = $("window").scrollTop(), c.top = b.clientY + d, c.left = b.clientX, a._updatePosition(c, null), "" !== a.toolbar.html() ? a.toolbar.show() : void 0
            }), this.element.on("halloselected", function (b, c) {
                var d;
                return(d = a._getPosition(c.originalEvent, c.selection)) ? (a._updatePosition(d, c.selection), "" !== a.toolbar.html() ? a.toolbar.show() : void 0) : void 0
            }), this.element.on("hallounselected", function () {
                return a.toolbar.hide()
            }), this.element.on("hallodeactivated", function () {
                return a.toolbar.hide()
            })
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloToolbarFixed", {toolbar: null, options: {parentElement: "body", editable: null, toolbar: null, affix: !0, affixTopOffset: 2}, _create: function () {
            var b, c, d = this;
            return this.toolbar = this.options.toolbar, this.toolbar.show(), a(this.options.parentElement).append(this.toolbar), this._bindEvents(), a(window).resize(function () {
                return d.setPosition()
            }), a(window).scroll(function () {
                return d.setPosition()
            }), "body" === this.options.parentElement ? (b = a(this.element), c = parseFloat(b.css("padding-left")), c += parseFloat(b.css("padding-right")), c += parseFloat(b.css("border-left-width")), c += parseFloat(b.css("border-right-width")), c += 2 * parseFloat(b.css("outline-width")), c += 2 * parseFloat(b.css("outline-offset")), a(this.toolbar).css("width", b.width() + c)) : void 0
        }, _getPosition: function (a) {
            var b, c, d;
            if (a)return d = parseFloat(this.element.css("outline-width")), b = d + parseFloat(this.element.css("outline-offset")), c = {top: this.element.offset().top - this.toolbar.outerHeight() - b, left: this.element.offset().left - b}
        }, _getCaretPosition: function (b) {
            var c, d, e;
            return e = a("<span/>"), c = rangy.createRange(), c.setStart(b.endContainer, b.endOffset), c.insertNode(e.get(0)), d = {top: e.offset().top, left: e.offset().left}, e.remove(), d
        }, setPosition: function () {
            var b, c, d, e, f, g;
            if ("body" === this.options.parentElement)return this.toolbar.css("position", "absolute"), this.toolbar.css("top", this.element.offset().top - this.toolbar.outerHeight()), this.options.affix && (f = a(window).scrollTop(), e = this.element.offset(), d = this.element.height(), g = this.options.affixTopOffset, c = e.top - (this.toolbar.height() + this.options.affixTopOffset), b = d - g + (e.top - this.toolbar.height()), f > c && b > f && (this.toolbar.css("position", "fixed"), this.toolbar.css("top", this.options.affixTopOffset))), this.toolbar.css("left", this.element.offset().left - 2)
        }, _updatePosition: function () {
        }, _bindEvents: function () {
            var a = this;
            return this.element.on("halloactivated", function () {
                return a.setPosition(), a.toolbar.show()
            }), this.element.on("hallodeactivated", function () {
                return a.toolbar.hide()
            })
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.halloToolbarInstant", {toolbar: null, options: {parentElement: "body", editable: null, toolbar: null, positionAbove: !1}, _create: function () {
            var b = this;
            return this.toolbar = this.options.toolbar, a(this.options.parentElement).append(this.toolbar), this._bindEvents(), a(window).resize(function (a) {
                return b._updatePosition(b._getPosition(a))
            })
        }, _getPosition: function (a, b) {
            var c, d;
            if (a)switch (c = a.type) {
                case"keydown":
                case"keyup":
                case"keypress":
                    return this._getCaretPosition(b);
                case"click":
                case"mousedown":
                case"mouseup":
                    return d = {top: a.pageY, left: a.pageX}
            }
        }, _getCaretPosition: function (b) {
            var c, d, e;
            return e = a("<span/>"), c = rangy.createRange(), c.setStart(b.endContainer, b.endOffset), c.insertNode(e.get(0)), d = {top: e.offset().top, left: e.offset().left}, e.remove(), d
        }, setPosition: function () {
            return"body" !== this.options.parentElement && (this.options.parentElement = "body", a(this.options.parentElement).append(this.toolbar)), this.toolbar.css("position", "absolute"), this.toolbar.css("top", this.element.offset().top - 20), this.toolbar.css("left", this.element.offset().left)
        }, _updatePosition: function (b, c) {
            var d, e, f, g, h;
            return null == c && (c = null), b && b.top && b.left ? (f = this.toolbar.outerHeight() + 10, c && !c.collapsed && c.nativeRange ? (e = c.nativeRange.getBoundingClientRect(), h = this.options.positionAbove ? e.top - f : e.bottom + 10, g = a(window).scrollTop() + h, d = a(window).scrollLeft() + e.left) : (h = this.options.positionAbove ? -10 - f : 20, g = b.top + h, d = b.left - this.toolbar.outerWidth() / 2 + 30), this.toolbar.css("top", g), this.toolbar.css("left", d)) : void 0
        }, _bindEvents: function () {
            var a = this;
            return this.element.on("click", function (b) {
                var c, d;
                return c = {}, d = $("window").scrollTop(), c.top = b.clientY + d, c.left = b.clientX, a._updatePosition(c, null), "" !== a.toolbar.html() ? a.toolbar.show() : void 0
            }), this.element.on("halloselected", function (b, c) {
                var d;
                return(d = a._getPosition(c.originalEvent, c.selection)) ? (a._updatePosition(d, c.selection), "" !== a.toolbar.html() ? a.toolbar.show() : void 0) : void 0
            }), this.element.on("hallounselected", function () {
                return a.toolbar.hide()
            }), this.element.on("hallodeactivated", function () {
                return a.toolbar.hide()
            })
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.hallobutton", {button: null, isChecked: !1, options: {uuid: "", label: null, icon: null, editable: null, command: null, commandValue: null, queryState: !0, cssClass: null}, _create: function () {
            var a, b, c, d, e = this;
            return null == (d = this.options).icon && (d.icon = "glyphicon-" + this.options.label.toLowerCase()), b = "" + this.options.uuid + "-" + this.options.label, c = this.options, this.button = this._createButton(b, c.command, c.label, c.icon), this.element.append(this.button), this.options.cssClass && this.button.addClass(this.options.cssClass), this.options.editable.options.touchScreen && this.button.addClass("btn-large"), this.button.data("hallo-command", this.options.command), this.options.commandValue && this.button.data("hallo-command-value", this.options.commandValue), a = "ui-state-hover", this.button.on("mouseenter", function () {
                return e.isEnabled() ? e.button.addClass(a) : void 0
            }), this.button.on("mouseleave", function () {
                return e.button.removeClass(a)
            })
        }, _init: function () {
            var a, b, c, d = this;
            return this.button || (this.button = this._prepareButton()), this.element.append(this.button), c = this.options.queryState === !0 ? function () {
                var a, b, c;
                if (d.options.command)try {
                    return d.options.commandValue ? (c = document.queryCommandValue(d.options.command), a = c.match(new RegExp(d.options.commandValue, "i")), d.checked(a ? !0 : !1)) : d.checked(document.queryCommandState(d.options.command))
                } catch (e) {
                    b = e
                }
            } : this.options.queryState, this.options.command && this.button.on("click", function () {
                return d.options.commandValue ? d.options.editable.execute(d.options.command, d.options.commandValue) : d.options.editable.execute(d.options.command), "function" == typeof c && c(), !1
            }), this.options.queryState ? (a = this.options.editable.element, b = "keyup paste change mouseup hallomodified", a.on(b, c), a.on("halloenabled", function () {
                return a.on(b, c)
            }), a.on("hallodisabled", function () {
                return a.off(b, c)
            })) : void 0
        }, enable: function () {
            return this.button.removeAttr("disabled")
        }, disable: function () {
            return this.button.attr("disabled", "true")
        }, isEnabled: function () {
            return"true" !== this.button.attr("disabled")
        }, refresh: function () {
            return this.isChecked ? this.button.addClass("ui-state-active") : this.button.removeClass("ui-state-active")
        }, checked: function (a) {
            return this.isChecked = a, this.refresh()
        }, _createButton: function (b, c, d, e) {
            var f;
            return f = ["ui-button", "ui-widget", "ui-state-default", "ui-corner-all", "ui-button-text-only", "" + c + "_button"], a('<button id="' + b + '"        class="' + f.join(" ") + '" title="' + d + '">          <span class="ui-button-text">            <i class="glyphicon ' + e + '"></i>          </span>        </button>')
        }}), a.widget("IKS.hallobuttonset", {buttons: null, _create: function () {
            return this.element.addClass("ui-buttonset")
        }, _init: function () {
            return this.refresh()
        }, refresh: function () {
            var a;
            return a = "rtl" === this.element.css("direction"), this.buttons = this.element.find(".ui-button"), this.buttons.removeClass("ui-corner-all ui-corner-left ui-corner-right"), a ? (this.buttons.filter(":first").addClass("ui-corner-right"), this.buttons.filter(":last").addClass("ui-corner-left")) : (this.buttons.filter(":first").addClass("ui-corner-left"), this.buttons.filter(":last").addClass("ui-corner-right"))
        }})
    }(jQuery)
}.call(this), function () {
    !function (a) {
        return a.widget("IKS.hallodropdownbutton", {button: null, options: {uuid: "", label: null, icon: null, editable: null, target: "", cssClass: null}, _create: function () {
            var a;
            return null != (a = this.options).icon ? (a = this.options).icon : a.icon = "glyphicon-" + this.options.label.toLowerCase()
        }, _init: function () {
            var b, c = this;
            return b = a(this.options.target), b.css("position", "absolute"), b.addClass("dropdown-menu"), b.hide(), this.button || (this.button = this._prepareButton()), this.button.on("click", function () {
                return b.hasClass("open") ? (c._hideTarget(), void 0) : c._showTarget()
            }), b.on("click", function () {
                return c._hideTarget()
            }), this.options.editable.element.on("hallodeactivated", function () {
                return c._hideTarget()
            }), this.element.append(this.button)
        }, _showTarget: function () {
            var b;
            return b = a(this.options.target), this._updateTargetPosition(), b.addClass("open"), b.show()
        }, _hideTarget: function () {
            var b;
            return b = a(this.options.target), b.removeClass("open"), b.hide()
        }, _updateTargetPosition: function () {
            var b, c, d, e;
            return c = a(this.options.target), e = this.button.position(), d = e.top, b = e.left, d += this.button.outerHeight(), c.css("top", d), c.css("left", b - 20)
        }, _prepareButton: function () {
            var b, c, d;
            return d = "" + this.options.uuid + "-" + this.options.label, c = ["ui-button", "ui-widget", "ui-state-default", "ui-corner-all", "ui-button-text-only"], b = a('<button id="' + d + '"       class="' + c.join(" ") + '" title="' + this.options.label + '">       <span class="ui-button-text"><i class="' + this.options.icon + '"></i></span>       </button>'), this.options.cssClass && b.addClass(this.options.cssClass), b
        }})
    }(jQuery)
}.call(this);