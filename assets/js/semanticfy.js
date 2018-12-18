$.fn.semanticfy = function (options) {
    this.defaults = { on: "blur", inline: true };
    options = $.extend({}, this.defaults, options);
    var $form = $(this);
    $form.form(options);
    var fields = {};
    var uiFactory = (typeof window.uiFactory != "undefined" ? window.uiFactory : {});
    
    uiFactory.uiEmpty = function ($identifier, $prompt) {
        return { type: 'empty', prompt: $prompt };
    };
    uiFactory.uiNumber = function ($identifier, $prompt) {
        return { type: 'number', prompt: $prompt };
    };
    uiFactory.uiChecked = function ($identifier, $prompt) {
        return { type: 'checked', prompt: $prompt };
    };
    uiFactory.uiEmail = function ($identifier, $prompt) {
        return { type: 'email', prompt: $prompt };
    };
    uiFactory.uiUrl = function ($identifier, $prompt) {
        return { type: 'url', prompt: $prompt };
    };
    uiFactory.uiDecimal = function ($identifier, $prompt) {
        return { type: 'decimal', prompt: $prompt };
    };
    uiFactory.uiExactlength = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'exactLength[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiMinlength = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'minLength[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiRegexp = function ($identifier, $prompt) {
        $data = $prompt.split("||");
        return { type: 'regExp', value: $data[0], prompt: $data[1] };

    };
    uiFactory.uiInteger = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'integer[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiCreditcard = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'creditCard[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiContains = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'contains[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiContainsexactly = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'containsExactly[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiDoesntcontain = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'doesntContain[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiDoesntcontainexactly = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'doesntContainExactly[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiIs = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'is[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiIsexactly = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'isExactly[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiNot = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'not[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiNotexactly = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'notExactly[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiMatch = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'match[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiDifferent = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'different[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiMincount = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'minCount[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiExactcount = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'exactCount[' + $data[0] + ']', prompt: $data[1] };
    };
    uiFactory.uiMaxcount = function ($identifier, $prompt) {
        $data = $prompt.split("|");
        return { type: 'maxCount[' + $data[0] + ']', prompt: $data[1] };
    }
    $form.find("[data-ui-validate]:visible").each(function () {
        var $identifier = $(this).attr("name") || $(this).attr("id");
        var $rules = [];
        $.each(this.dataset, function (a, b) {
            if (a != "uiValidate") {
                if (uiFactory[a]) {
                    var $rule = uiFactory[a]($identifier, b);
                    if ($rule) {
                        $rules.push($rule);
                    }
                }
            }
        });
        $form.form('add rule', $identifier, { rules: $rules });
    });
};