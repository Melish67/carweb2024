function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("logtable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            //check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}


/*
$(document).ready(function () {
    var pathname = window.location.pathname;
    console.log("pathname" + pathname);
    $('.topnav').each(function () {
        $(this).find('a').each(function () {
            $('.topnav a').removeClass("active");
            var current = $(this);

            var menu_link = current.find('a').attr('href');
            //console.log("menu_link" + menu_link);
            if (menu_link == pathname) {
                console.log("active");
                current.children().addClass('active');
            }
        });
    });
});
*/

/*// the following extension comes from http://stackoverflow.com/questions/1582534/calculating-text-width
$.fn.textWidth = function(){
    var html_org = $(this).html();
    var html_calc = '<span>' + html_org + '</span>';
    $(this).html(html_calc);
    var width = $(this).find('span:first').width();
    $(this).html(html_org);
    return width;
};*/

$('#logtable').on( 'draw.dt', function (e) {
    $('#logtable thead tr th').each(function(idx, ele) {
        var xPos = parseInt((($(ele).width() + $(ele).textWidth()) / 2) + 20);
        $(ele).css('background-position-x',  xPos + 'px')
    })
});

// $('#logtable').DataTable();