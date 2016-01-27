(function () {

    $(document).foundation();

    function SubscribeForm($form) {
        this._$form = $form;
        this._$input = $form.find("input[type='email']");
        this._$button = $form.find("button[type='submit']");
        this._$icon = this._$button.find(".fa");
        this._currentState = "ready";

        $form.submit(this._onSubmit.bind(this));
        $form.keyup(this._onKeyup.bind(this));
    }
    SubscribeForm.prototype._onSubmit = function (e) {
        e.preventDefault();

        this.setState("loading");

        var url = this._$form.attr('action').replace('/post?', '/post-json?').concat('&c=?');
        var _this = this;

        $.getJSON(url, {
            "EMAIL": this._$input.val()
        }).then(function (data, textStatus, jqXHR) {
            if (textStatus != "success"
                || !data
                || data.result !== "success") return $.Deferred().reject().promise();
            _this.setState("success");
        }).fail(function () {
            $("#subscribe").shake({times: 2, speed: 60});
            _this.setState("error");
        });
    };
    SubscribeForm.prototype._onKeyup = function (e) {
        if (this._currentState == "error") {
            this.setState("ready");
        }
    };
    SubscribeForm.prototype._setDisabled = function (isDisabled) {
        if (isDisabled) {
            this._$input.attr("disabled", "");
            this._$button.attr("disabled", "");
        } else {
            this._$input.removeAttr("disabled");
            this._$button.removeAttr("disabled");
        }
    };
    SubscribeForm.prototype._setIconClass = function (iconClass) {
        this._$icon.attr("class", "fa fa-fw " + iconClass);
    };
    SubscribeForm.prototype._setNextState = function (nextState, timeout) {
        this._timeout = setTimeout(function () {
            this.setState(nextState);
        }.bind(this), timeout);
    };
    SubscribeForm.prototype.setState = function (state) {
        clearTimeout(this._timeout);
        switch (state) {
            case "ready":
                this._setDisabled(false);
                this._setIconClass("fa-envelope-o");
                break;
            case "loading":
                this._setDisabled(true);
                this._setIconClass("fa-circle-o-notch fa-spin");
                break;
            case "error":
                this._setDisabled(false);
                this._setIconClass("fa-exclamation-triangle");
                break;
            case "success":
                this._setDisabled(true);
                this._setIconClass("fa-check");
                this._setNextState("ready", 2000);
                break;
        }
        this._currentState = state;
    };

    $(function () {
        new SubscribeForm($("#subscribe"));

        var homeNavHeight = $(".home-nav").height();
        $("[id!='']").each(function (i) {
            var $elem = $(this);
            var id = $elem.attr("id");
            var $targetNav = $(".home-nav").find("a[href='#" + id + "']");
            if ($targetNav.length) {
                var position = $elem.position();
                $elem.scrollspy({
                    min: position.top - homeNavHeight,
                    max: position.top - homeNavHeight + $elem.outerHeight(),
                    onEnter: function (element, position) {
                        $(".home-nav").find("a").removeClass("active");
                        $targetNav.addClass("active");
                    }
                });
            }
        });
    });

})();
