$(document).ready(function () {
    getCars(); //funk cagir
});

function getCars() {
    // swal({
    //     title: "Please wait!",
    //     text: "Page is loading",
    //     imageUrl: 'loading.gif',
    //     showConfirmButton: false
    // });
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts/',
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function (result) {
            console.log(result);
            $(`#carstable tbody tr`).remove();
            $.each(result, function myfunction(i, item) {
                console.log(result.item);
                $(`<tr id="${result[i].id}" >`).html(`<td> 
                        <button type="button" class="btn btn-primary btn-ico"  onclick="carInfo(this)" data-toggle="modal"data-target="#myModal"><i class="fa fa-info" aria-hidden="true"  style="padding: 0px 4px;"></i></button>
                        <button type="button" class="btn btn-success btn-ico" onclick="actionSave(this);"><i class="fa fa-save" aria-hidden="true" ></i></button>
                        <button type="button" class="btn btn-danger btn-ico"><i class="fa fa-trash-o" aria-hidden="true"></i></button></td>
                        <td><input type="text" value="${result[i].id}"  style="border:none;" ></td> 
                        <td><input type="text" value="${result[i].body}"  style="border:none;" ></td> 
                        <td><input type="text" value="${result[i].body}"  style="border:none;" ></td> 
                        <td><input type="text" value="${result[i].body}"  style="border:none;" ></td> 
                      `).appendTo(`#carstable tbody`);
            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax

}

//hansi setre klik elediyimi bilmek ucun
//
function actionSave(e){
    let carsNo=$(e).parent().parent().children().eq(1).children().val();
    let driver=$(e).parent().parent().children().eq(2).children().val();
    let carIn=$(e).parent().parent().children().eq(3).children().val();
    let carOut=$(e).parent().parent().children().eq(3).children().val();
    console.log(carsNo,driver,carIn,carOut);
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts/',
        type: 'POST',
        dataType: 'json',
        data: {
            carsNumber:carsNo,
            driver:driver,
            carsin:carsIn,
            carsout:carOut
        },
        success: function (result) {
            // swal({
            //     title: "Please wait!",
            //     text: "Page is loading",
            //     imageUrl: 'loading.gif',
            //     showConfirmButton: false
            // });
            getCars()
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax



}

function carInfo(e){
    let trId=$(e).parent().parent().attr("id");
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts/',
        type: 'POST',
        dataType: 'json',
        data: {
            id:trId
        },
        success: function (result) {
            // swal({
            //     title: "Please wait!",
            //     text: "Page is loading",
            //     imageUrl: 'loading.gif',
            //     showConfirmButton: false
            // });

        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax

}




test()
let totalTrCount;
let totalTablePageCount = 0;//asagidaki duymelerin sayi yeni umumi sehiflerin sayi
let hazir = 0; //
$(document).ready(function () {
    localStorage.getItem("tokens", "res_token");
    localStorage.setItem("pagetype", "Permission");
    getPermission(1);//necenci seh oldugu

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
                DeletePermission();


            }
        });
    });


});
let delete_status;

function getPermission(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/permissions/filter?page=' + tablePageNo + '&size=23',//work
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


            $(`#permission tbody tr`).remove();
            let number = 0;
            $.each(result.data, function myfunction(i, item) {

                delete_status = item.deleted;
                // console.log("delete_status:"+delete_status);
                if (delete_status == false) {
                    $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++number}</td>
                        <td>${item.name}</td> 
                        <td>${item.description}</span></td> 
                      `).appendTo(`#permission tbody`);
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


//tr clickde

let tr_id, tr_number, tr_name, tr_description;

function trClick(e) {
    $("#permission tbody tr").css("background", "white");//umumi
    $(e).css({
        "background": "#fb320f",
        "color": "#flff"
    });
    tr_id = $(e).attr("trid");
    tr_number = $(e).children().eq(0).text();
    tr_name = $(e).children().eq(1).text();
    tr_description = $(e).children().eq(2).text();
    console.log("tr_number:" + tr_number, "tr_name:" + tr_name, "tr_description:" + tr_description);
}

$(document).ready(function () {

    $("#edit").click(function () {
        let selectedRow = $("#permission tbody tr[style='background: #fb320f; color: #fff;']");

        if (selectedRow.length === 0) {
            alert("Setr sec"); // setr secilmedise alert ver
            return;
        }
        $("#edit_modal_no_id").val(tr_number);
        $("#edit_modal_name_id").val(tr_name);
        $("#edit_modal_desc_id").val(tr_description);
    });
    $("#editSave").click(function () {
        EditPermission();
    });
    $("#add").click(function () {
        //asagidaki kodu yazmiyandada bunun ici bos olur amaki edite basib sora add basanda ici dolu olur
        $("#add_modal_name_id").val("");
        $("#add_modal_desc_id").val("");
    });
    $("#addSave").click(function () {
        AddPermission();
    });
});


function EditPermission() {
    let new_edit_mdl_no_text = $("#trid").val();
    let new_edit_mdl_name_text = $("#edit_modal_name_id").val();
    let new_edit_mdl_desc_text = $("#edit_modal_desc_id").val();

    let objPermissions = {
        deleted: false,
        name: new_edit_mdl_name_text,
        description: new_edit_mdl_desc_text,
    };
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/permissions/' + tr_id,//work
        type: 'PUT',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objPermissions),
        success: function (result) {
            getPermission();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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


function AddPermission() {
    let new_add_mdl_name_text = $("#add_modal_name_id").val();
    let new_add_mdl_desc_text = $("#add_modal_desc_id").val();

    let objPermissionsAdd = {
        deleted: false,
        name: new_add_mdl_name_text,
        description: new_add_mdl_desc_text,
    };
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/permissions',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objPermissionsAdd),
        success: function (result) {
            getPermission();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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


function DeletePermission() {
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/permissions/' + tr_id,//work
        type: 'DELETE',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        // data: JSON.stringify(objPermissionsDelete),
        success: function (result) {
            getPermission();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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


function SearchPermissionFunk(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    let search_name = $("#search_name").val().trim();
    console.log("search_name: " + search_name);
    let searchCriteriaList = [];
    let waiting_Item;

    if (search_name.length > 0) {
        waiting_Item =
            {
                "filterKey": "name",
                "operation": "CONTAINS",
                "value": search_name
            }
        searchCriteriaList.push(waiting_Item);
    }


    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/permissions/filter?page=' + tablePageNo + '&size=20',
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
            localStorage.setItem("pagetype", "SearchPermission");

            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi
            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);

            //  console.log(totalTrCount);
            $(`#permission tbody tr`).remove();
            let number = 0;
            $.each(result.data, function myfunction(i, item) {
                //item = result.data[i] , tr
                // console.log("item:"+item);
                $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++number}</td>
                        <td>${item.name}</td> 
                        <td>${item.description}</span></td> 
                      `).appendTo(`#permission tbody`);
            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}