let totalTrCount;
let totalTablePageCount = 0;//asagidaki duymelerin sayi yeni umumi sehiflerin sayi
let hazir = 0; //
$(document).ready(function () {
    localStorage.getItem("tokens", "res_token");
    localStorage.setItem("pagetype", "Card");
    getCard(1);//necenci seh oldugu
    $("#delete").click(function () {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                DeleteCard();
            }
        });
    });


});
let delete_status;
function formatDateToCustomFormat(date) {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
/*function ConvertJsonDateString(jsonDate) {
    var shortDate = null;
    if (jsonDate) {
        var regex = /-?\d+/;
        var matches = regex.exec(jsonDate);
        var dt = new Date(parseInt(matches[0]));
        var month = dt.getMonth() + 1;
        var monthString = month > 9 ? month : '0' + month;
        var day = dt.getDate();
        var dayString = day > 9 ? day : '0' + day;
        var hour = dt.getHours();
        var hourString = hour > 9 ? hour : '0' + hour;
        var minute = dt.getMinutes();
        var minString = minute > 9 ? minute : '0' + minute;
        var year = dt.getFullYear();
        shortDate = dayString + '-' + monthString + '-' + year + ' ' + hourString + ':' + minString;
    }
    return shortDate;
};*/
function getCard(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/card/filter?page' + tablePageNo + '&size=63',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi
            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);
            //  console.log(totalTrCount);
            $(`#card tbody tr`).remove();
            let tr_number = 0;
            $.each(result.data, function myfunction(i, item) {
                const apiDate = new Date(item.expiryDate);//apiden gelen tarix
             const hazirTarix = formatDateToCustomFormat(apiDate).substring(0,10);
                //const hazirTarix = formatDateToCustomFormat(apiDate);
                delete_status = item.deleted;
                // console.log("delete_status:"+delete_status);


                if (delete_status == false) {
                $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++tr_number}</td>
                         <td>${item.cardNumber}</td>            
                         <td>${item.drivers.name} ${item.drivers.surname}</td> 
                         <td>${hazirTarix}</td>   
                      `).appendTo(`#card tbody`);
                }
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
$(document).ready(function () {
    $("#add").click(function () {
        //asagidaki kodu yazmiyandada bunun ici bos olur amaki edite basib sora add basanda ici dolu olur
        $("#add_modal_card_number_id").val("");
        $("#add_modal_date_id").val("");
        //$("#add_modal_drivers_id").val("");
    });
    $("#addSave").click(function () {
        AddCard();
    });
    addCardSelect();
    editCardSelect();
})
function AddCard() {
    let new_add_modal_card_number_id_text = $("#add_modal_card_number_id").val();
    let new_add_modal_date_text = $("#add_modal_date_id").val();
   // let new_add_modal_drivers_text = $("#add_modal_drivers_id").val();
    let new_add_modal_drivers_text = $("#add_modal_drivers_id option:selected").attr("id");
    let objAdd = {
        deleted: false,//add edit edende  deleted: false,
        cardNumber: new_add_modal_card_number_id_text,
        expiryDate:new_add_modal_date_text,
        drivers:new_add_modal_drivers_text
    };
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/card',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objAdd),
        success: function (result) {
            getCard();//bazadan son melumatlari getirir, refresh olur teze mel gelir
            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
            });
        },

        failure: function (jqXHR, textStatus, errorThrown) {
            alert("error"); // Display error message
        }
    });//ajaxson

}
function addCardSelect(){
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/filter',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            $(`#add_modal_drivers_id option`).remove();
            $.each(result.data, function myfunction(i, item) {
                $(`<option id="${item.id}" >${item.name}  ${item.surname} </option>`).appendTo(`#add_modal_drivers_id`);
            });//each sonu

        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax

}
function editCardSelect(){
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/filter',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            $(`#edit_modal_drivers_id option`).remove();
            $.each(result.data, function myfunction(i, item) {
                $(`<option id="${item.id}" >${item.name}  ${item.surname} </option>`).appendTo(`#edit_modal_drivers_id`);
            });//each sonu

        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}

//tr clickde
let tr_id, tr_card_number, tr_expiry_date,tr_drivers;
function trClick(e) {
    $("#card tbody tr").css("background", "white");//umumi
    $(e).css({
        "background": "#fb320f",
        "color": "#flff"
    });
    tr_id = $(e).attr("trid");
    //tr_no = $(e).children().eq(0).text();
    tr_card_number = $(e).children().eq(1).text();
    tr_expiry_date = $(e).children().eq(3).text();
    tr_drivers = $(e).children().eq(2).text();
}
$(document).ready(function () {
    $("#edit").click(function () {
        $("#edit_modal_card_number_id").val(tr_card_number);
        $("#edit_modal_drivers_id").val(tr_drivers);
        $("#edit_modal_date_id").val(tr_expiry_date);
    });
    $("#editSave").click(function () {
        EditCard();
    });
});
function EditCard() {
    let new_edit_mdl_card_number_text = $("#edit_modal_card_number_id").val();
    let new_edit_mdl_date_text = $("#edit_modal_date_id").val();
    let new_edit_mdl_drivers = $("#edit_modal_drivers_id  option:selected").attr("id");
    //let new_edit_mdl_drivers = $("#edit_modal_drivers_id ").val();
   // let new_edit_mdl_drivers = $("#edit_modal_drivers_id option:selected").attr("id");
   // let gt2 =$("#gt option:selected").val();
    // let new_edit_mdl_name_surname = $("#edit_mdl_name_surname option[value="+deyisentable+"]").val();
    let objEdit = {
        deleted: false,
        cardNumber: new_edit_mdl_card_number_text,
        drivers: new_edit_mdl_drivers,
        expiryDate: new_edit_mdl_date_text,
    };
    $.ajax({
      //  url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/' + tr_id,//work
      url: 'http://fdm.asg.az:8080/car-secure-test/api/card/'+tr_id,//work
        type: 'PUT',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objEdit),
        success: function (result) {
            getCard();//bazadan son melumatlari getirir, refresh olur teze mel gelir
            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
            });
            //console.log(result);
            // alert("Melumat ugurla elave olundu");

        },
        failure: function (jqXHR, textStatus, errorThrown) {
            alert("error"); // Display error message
        }
    });//ajaxson
}
function DeleteCard() {
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/card/'+ tr_id,//work
        type: 'DELETE',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        // data: JSON.stringify(objPermissionsDelete),
        success: function (result) {
            getCard();//bazadan son melumatlari getirir, refresh olur teze mel gelir
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            );
        },
        failure: function (jqXHR, textStatus, errorThrown) {
            alert("error"); // Display error message
        }
    });//ajaxson

}
function SearchCardFunk(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    let search_card_number = $("#search_card_no").val().trim();
  //  let search_driver = $("#search_drivers").val().trim();

    let searchCriteriaList = [];
    let waiting_Item;

    if(search_card_number.length>0 ){
        waiting_Item =
            {
                "filterKey": "cardNumber",
                "operation": "CONTAINS",
                "value": search_card_number
            },
          /*  {
                "filterKey": "drivers.name",//"user.location",
                "operation": "CONTAINS",
                "value": search_driver
            }*/
        searchCriteriaList.push(waiting_Item);
    }
    $.ajax({
       // url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/filter?page=' + tablePageNo + '&size=20',
         url: 'http://fdm.asg.az:8080/car-secure-test/api/card/filter?page=' + tablePageNo + '&size=20',
        type: 'POST',
        crossDomain: true,
        contentType: "application/json",
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(
            [
                {
                    "searchCriteriaList": searchCriteriaList,
                    "dataOption": "All"
                }
            ]
        ),
        success: function (result) {
            localStorage.setItem("pagetype", "SearchCard");
            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi
            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);

            //  console.log(totalTrCount);
            $(`#card tbody tr`).remove();
            let tr_number = 0;
            $.each(result.data, function myfunction(i, item) {
                //item = result.data[i] , tr
                // console.log("item:"+item);
                const apiDate = new Date(item.expiryDate);//apiden gelen tarix
                const hazirTarix = formatDateToCustomFormat(apiDate);
                $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++tr_number}</td>
                         <td>${item.cardNumber}</td> 
                         <td>${item.drivers.name} ${item.drivers.surname}</td> 
                          <td>${hazirTarix}</td> 
                      `).appendTo(`#card tbody`);
            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}