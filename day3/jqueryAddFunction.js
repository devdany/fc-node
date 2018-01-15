$.fn.changeColor = function () {
    this.each(function () {
        var $dom = $(this);
        $dom.click(function () {
            $dom.css("color", "red");
        })
    });
}

$(document).ready(function () {
    $('#clickDiv, #secondClickDiv').changeColor();
})