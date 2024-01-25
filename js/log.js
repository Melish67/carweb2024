let totalTrCount;

$(document).ready(function () {
    localStorage.getItem("tokens", "res_token");
    localStorage.setItem("pagetype", "Log");//?
    $("#search_input").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#logtable tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    // document.getElementById('start').valueAsDate = new Date();
    getLog(1);//necenci seh oldugu


});


let totalTablePageCount = 0;//asagidaki duymelerin sayi yeni umumi sehiflerin sayi
let hazir = 0; //

function formatDateToCustomFormat(date) {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const day = date.getUTCDate().toString().padStart(1, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/*  url: 'http://fdm.asg.az/car-secure/api/logs',*/
function getLog(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/logs/filter?page=0&size=10',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            testa = "Salam sagol";
            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi

            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);

            //  console.log(totalTrCount);
            $(`#logtable tbody tr`).remove();

            $.each(result.data, function myfunction(i, item) {
                //item = result.data[i] , tr


                // console.log("item:"+item);
                let status = item.status;
                let statusText = status == 1 ? 'in' : " out";
                let backgroundColor = status == 1 ? '#e8fadf' : '#ff3e1d2e';
                let textColor = status == 1 ? '#71dd37' : '#ff3e1d';
                const apiDate = new Date(item.created_date);//apiden gelen tarix
                const formattedDate = formatDateToCustomFormat(apiDate);

                $(`<tr  id="${item.id}" >`).html(`
                        <td><img src="img/azerbaijan-20.png"/> ${item.cars.number}</td> 
                        <td><img src="img/driver-20.png"/> ${item.cars.drivers.name} ${item.cars.drivers.name}</td> 
                          <td><img src="img/location-20.png"/> ${item.user.location}</td> 
                        <td><img src="img/clock-20.png"/> ${formattedDate}</td> 
                        <td><span style='background-color: ${backgroundColor};color: ${textColor}; padding: 3px 10px;border-radius: 3px;'>${statusText}</span></td> 
                        
                      `).appendTo(`#logtable tbody`);
                //<td style='background-color: ${backgroundColor};'>${statusTextout}</td>
            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }

    });//ajax

}

function hazirZero() {
    SetPage(totalTablePageCount);
    hazir = 1;//daha 1 beraber olacaq deye tezden butonlari yaratmiyacaq
}


//hansi setre klik elediyimi bilmek ucun

function SearchLogFunk() {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    //let cartype =$("#cartype").val();
    // let gt =$("#gt option:selected").attr("id");
    // let gt2 =$("#gt option:selected").val();
    let carNo = $("#carNo").val().trim();
    let gate = $("#gate").val().trim();
    console.log("gate:" + gate);
    //let drivers =$("#driver").val();
    let searchCriteriaList=[];
    let waiting_Item = {};
    if(carNo.length>0 || gate.length>0){
        waiting_Item =
            {
                "filterKey": "cars.number",
                "operation": "CONTAINS",
                "value": carNo
            },
            {
                "filterKey": "user.location",
                "operation": "CONTAINS",
                "value": gate
            }
            searchCriteriaList.push(waiting_Item);
    }
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/logs/filter?page=0&size=10',
        type: 'POST',
        crossDomain: true,
        contentType: "application/json",
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify([
            {
                "searchCriteriaList": searchCriteriaList,
                "dataOption": "All"
            }
        ]),
        success: function (result) {
            localStorage.setItem("pagetype", "SearchLog");

            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi
            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);

            //  console.log(totalTrCount);
            $(`#logtable tbody tr`).remove();

            $.each(result.data, function myfunction(i, item) {
                //item = result.data[i] , tr


                // console.log("item:"+item);
                let status = item.status;
                let statusText = status == 1 ? 'in' : " out";
                let backgroundColor = status == 1 ? '#e8fadf' : '#ff3e1d2e';
                let textColor = status == 1 ? '#71dd37' : '#ff3e1d';
                const apiDate = new Date(item.created_date);//apiden gelen tarix
                const formattedDate = formatDateToCustomFormat(apiDate);

                $(`<tr  id="${item.id}" >`).html(`
                          <td><img src="img/azerbaijan-20.png"/> ${item.cars.number}</td> 
                        <td><img src="img/driver-20.png"/> ${item.cars.drivers.name} ${item.cars.drivers.name}</td> 
                           <td><img src="img/location-20.png"/> ${item.user.location}</td> 
                        <td><img src="img/clock-20.png"/> ${formattedDate}</td> 
                        <td><span style='background-color: ${backgroundColor};color: ${textColor}; padding: 3px 10px;border-radius: 3px;'>${statusText}</span></td> 
                       
                    `).appendTo(`#logtable tbody`);

            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}

