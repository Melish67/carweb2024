let pages = 25;

//console.log(totalTrCount);
function SetPage(pg) {
    console.log('page count : '+pg);
    pages = pg;//nece sehife sayi
    createPagination(pages, 1);
}
//pages nece seh sayi,page necenci sehife
function createPagination(pages, tablePageNo) {

    let firstTr = tablePageNo * 10 - 9; // Calculate the lower bound of the range
    let endTr = tablePageNo * 10;
    if (endTr > totalTrCount) {
        endTr = totalTrCount;
    }
    /* i = tablePageNo;*/
    //localStorage.setItem("sehfe_nomresi", tablePageNo);
    //let cvb = localStorage.getItem("sehfe_nomresi");
    let where = localStorage.getItem("pagetype");

    console.log(tablePageNo);
    switch (where) {
        case "Log":
            getLog(tablePageNo);
            break;
        case "SearchLog":
            SearchLogFunk(tablePageNo);
            break;
        case "Permission"://sehifenin adi
            getPermission(tablePageNo);//table dolduran funk adi
            break;
        case "SearchPermission"://sehifenin adi
            SearchPermissionFunk(tablePageNo);//table dolduran funk adi
            break;
        case "Question"://sehifenin adi
            getQuestion(tablePageNo);//table dolduran funk adi
            break;
        case "SearchQuestion"://sehifenin adi
            SearchQuestionFunk(tablePageNo);//table dolduran funk adi
            break;
        case "Car"://sehifenin adi
             getCar(tablePageNo);//table dolduran funk adi
            break;
        case "SearchCar"://sehifenin adi
            SearchCarFunk(tablePageNo);//table dolduran funk adi
            break;
        case "Card"://sehifenin adi
            getCard(tablePageNo);//table dolduran funk adi
            break;
        case "SearchCard"://sehifenin adi
            SearchCardFunk(tablePageNo);//table dolduran funk adi
            break;
        case "Driver"://sehifenin adi
            getDriver(tablePageNo);//table dolduran funk adi
            break;
        case "SearchDriver"://sehifenin adi
            SearchDriverFunk(tablePageNo);//table dolduran funk adi
            break;
    }

    let str = '<ul class="col-md-5 col-xs-12" style=" display: flex;  justify-content: end;!important;">';
    let sol=   `<div class="col-md-7 show-text" ><span style="color: #a1acb8;">Showing  ${firstTr} to ${endTr} of  ${totalTrCount} entries</span></div>`
    let active;
    let pageCutLow = tablePageNo - 1;
    let pageCutHigh = tablePageNo + 1;
    //console.log(page);
    // Show the Previous button only if you are on a page other than the first
    if (tablePageNo > 1) {
        str += '<li class="page-item previous no"><a onclick="createPagination(pages, ' + (tablePageNo - 1) + ')">Previous</a></li>';
    }
    // Show all the pagination elements if there are less than 6 pages total
    if (pages < 6) {
        for (let p = 1; p <= pages; p++) {
            active = tablePageNo == p ? "active" : "no";
            str += '<li class="' + active + '"><a onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
        }
    }
    // Use "..." to collapse pages outside of a certain range
    else {
        // Show the very first page followed by a "..." at the beginning of the
        // pagination section (after the Previous button)
        if (tablePageNo > 2) {
            str += '<li class="no page-item"><a onclick="createPagination(pages, 1)">1</a></li>';
            if (tablePageNo > 3) {
                str += '<li class="out-of-range"><a onclick="createPagination(pages,' + (tablePageNo - 2) + ')">...</a></li>';
            }
        }
        // Determine how many pages to show after the current page index
        if (tablePageNo === 1) {
            pageCutHigh += 2;
        } else if (tablePageNo === 2) {
            pageCutHigh += 1;
        }
        // Determine how many pages to show before the current page index
        if (tablePageNo === pages) {
            pageCutLow -= 2;
        } else if (tablePageNo === pages - 1) {
            pageCutLow -= 1;
        }
        // Output the indexes for pages that fall inside the range of pageCutLow
        // and pageCutHigh
        for (let p = pageCutLow; p <= pageCutHigh; p++) {
            if (p === 0) {
                p += 1;
            }
            if (p > pages) {
                continue
            }
            active = tablePageNo == p ? "active" : "no";
            str += '<li class="page-item ' + active + '"><a onclick="createPagination(pages, ' + p + ')">' + p + '</a></li>';
        }
        // Show the very last page preceded by a "..." at the end of the pagination
        // section (before the Next button)
        if (tablePageNo < pages - 1) {
            if (tablePageNo < pages - 2) {
                str += '<li class="out-of-range"><a onclick="createPagination(pages,' + (tablePageNo + 2) + ')">...</a></li>';
            }
            str += '<li class="page-item no"><a onclick="createPagination(pages, pages)">' + pages + '</a></li>';
        }
    }
    // Show the Next button only if you are on a page other than the last
    if (tablePageNo < pages) {
        str += '<li class="page-item next no"><a onclick="createPagination(pages, ' + (tablePageNo + 1) + ')">Next</a></li>';
    }
    str += '</ul>';
    // Return the pagination string to be outputted in the pug templates
    document.getElementById('pagination').innerHTML =  sol +str;
    return str;
}