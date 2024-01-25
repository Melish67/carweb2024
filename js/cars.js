let totalTrCount;
let totalTablePageCount = 0;//asagidaki duymelerin sayi yeni umumi sehiflerin sayi
let hazir = 0; //
$(document).ready(function () {
    localStorage.getItem("tokens", "res_token");
    localStorage.setItem("pagetype", "Car");
    getCar(1);//necenci seh oldugu

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
                DeleteCar();
            }
        });
    });


});
let delete_status;

function getCar(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/filter?page' + tablePageNo + '&size=50',//work
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
            $(`#car tbody tr`).remove();
            let tr_number = 0;
            $.each(result.data, function myfunction(i, item) {
                delete_status = item.deleted;
                // console.log("delete_status:"+delete_status);
                if (delete_status == false) {
                    $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++tr_number}</td>
                         <td>${item.number}</td> 
                         <td>${item.model}</td> 
                        <td>${item.year}</td> 
                        <td>${item.colour}</td> 
                         <td>${item.drivers.name} ${item.drivers.surname}</td> 
                      `).appendTo(`#car tbody`);
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
        $("#add_modal_car_number_id").val();
        $("#add_modal_model_id").val();
        $("#add_modal_year_id").val();
        $("#add_modal_color_id").val();
        $("#add_mdl_name_surname").val();
    });
    $("#addSave").click(function () {
        /*var new_add_modal_number_text = $("#add_modal_car_number_id").val().trim();
        // Diğer gerekli alanları da alabilirsin.

        // Kontrol etmek istediğin araç numarasını içeren bir dizi oluştur
        var existingCarNumbers = [
            "S01",
            "CarNumber2",
            "CarNumber3"
            // Buraya mevcut araç numaralarını ekleyin
        ];

        // Eğer yazılan araç numarası zaten mevcutsa uyarı göster
        if (existingCarNumbers.includes(new_add_modal_number_text)) {
            Swal.fire({
                title: 'Duplicate Car Number',
                text: 'This car number already exists. Please enter a unique car number.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        } else {
            // Eğer araç numarası mevcut değilse, işlemi devam ettir ve aracı ekle
            AddCar();
        }*/
        AddCar();
    });
})
function AddCar() {
/*    function isCarNumberExists(carNumber) {
        // Check if the car number already exists in the table
        let exists = false;

        $("#car tbody tr td:nth-child(2)").each(function () {
            if ($(this).text().trim() === carNumber) {
                exists = true;
                return false; // exit the loop early if the car number is found
            }
        });

        return exists;
    }*/
    let new_add_modal_number_text = $("#add_modal_car_number_id").val();
    let new_add_modal_model_text = $("#add_modal_model_id").val();
    let new_add_modal_year_text = $("#add_modal_year_id").val();
    let new_add_modal_color_text = $("#add_modal_color_id").val();
    let new_add_mdl_name_surname = $("#add_mdl_name_surname option:selected").attr("id");
    //let new_add_mdl_name_surname = $("#add_mdl_name_surname option:selected").val();
     //let new_add_mdl_name_surname = $("#add_mdl_name_surname").val();
   // $("#id  option:selected").attr("id")
    console.log("driver: "+new_add_mdl_name_surname);
    let objAdd = {
        deleted: false,//add edit edende  deleted: false,
        number: new_add_modal_number_text,
        model:new_add_modal_model_text,
        year:new_add_modal_year_text,
        colour: new_add_modal_color_text,
        drivers:new_add_mdl_name_surname
    };
    /* if(new_add_modal_number_text==){

    }*/



    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/save',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objAdd),
        success: function (result) {
            getCar();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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
  /*  // Check if the car number already exists in the table
    if (isCarNumberExists(new_add_modal_number_text)) {
        // Display an alert below the input
        $("#add_modal_car_number_id").after('<div class="alert alert-danger mt-12" role="alert">Car with this number already exists!</div>');
        return; // Do not proceed with adding the car
    }
    $("#add_modal_car_number_id").next('.alert').remove();
*/
}


//tr clickde
let tr_id, tr_car_number, tr_model, tr_year,tr_color,tr_name_surname;
function trClick(e) {
    $("#car tbody tr").css("background", "white");//umumi
    $(e).css({
        "background": "#fb320f",
        "color": "#flff"
    });

    tr_id = $(e).attr("trid");
    //tr_no = $(e).children().eq(0).text();
    tr_car_number = $(e).children().eq(1).text();
    tr_model = $(e).children().eq(2).text();
    tr_year = $(e).children().eq(3).text();
    tr_color = $(e).children().eq(4).text();
    tr_name_surname = $(e).children().eq(5).text();
}
$(document).ready(function () {
    $("#edit").click(function () {
        $("#edit_modal_car_number_id").val(tr_car_number);
        $("#edit_modal_model_id").val(tr_model);
        $("#edit_modal_year_id").val(tr_year);
        $("#edit_modal_color_id").val(tr_color);
        $("#edit_mdl_name_surname").val(tr_name_surname);
    });
    $("#editSave").click(function () {
        EditCar();
    });
    sellectAddDriver();
    sellectEditDriver();
});
function EditCar() {
    console.log("ddddd");
    let new_edit_mdl_car_number_text = $("#edit_modal_car_number_id").val();
    let new_edit_mdl_model_text = $("#edit_modal_model_id").val();
    let new_edit_mdl_year_text = $("#edit_modal_year_id").val();
    let new_edit_mdl_color_text = $("#edit_modal_color_id").val();
    let new_edit_mdl_name_surname = $("#edit_mdl_name_surname option:selected").attr("id");
   // let new_edit_mdl_name_surname = $("#edit_mdl_name_surname").val();
   // let gt2 =$("#gt option:selected").val();
    // let new_edit_mdl_name_surname = $("#edit_mdl_name_surname option[value="+deyisentable+"]").val();
    let objEdit = {
        deleted: false,
        number: new_edit_mdl_car_number_text,
        model:new_edit_mdl_model_text,
        year:new_edit_mdl_year_text,
        colour: new_edit_mdl_color_text,
        drivers: new_edit_mdl_name_surname
    };
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/' + tr_id,//work
        type: 'PUT',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objEdit),
        success: function (result) {
            getCar();//bazadan son melumatlari getirir, refresh olur teze mel gelir
            Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success"
            });
           console.log(result);
            // alert("Melumat ugurla elave olundu");

        },
        failure: function (jqXHR, textStatus, errorThrown) {
            alert("error"); // Display error message
        }
    });//ajaxson
}
function sellectAddDriver(){
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/filter',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            $(`#add_mdl_name_surname option`).remove();
            $.each(result.data, function myfunction(i, item) {
                $(`<option id="${item.id}" >${item.name}  ${item.surname} </option>`).appendTo(`#add_mdl_name_surname`);
            });//each sonu

        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}
function sellectEditDriver(){
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/filter',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            $(`#edit_mdl_name_surname option`).remove();
            $.each(result.data, function myfunction(i, item) {
                $(`<option id="${item.id}" >${item.name}  ${item.surname} </option>`).appendTo(`#edit_mdl_name_surname`);
            });//each sonu
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}
function DeleteCar() {
    console.log("delete");
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/' + tr_id,//work
        type: 'DELETE',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        // data: JSON.stringify(objPermissionsDelete),
        success: function (result) {
            console.log("get car delete");
            getCar();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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
function SearchCarFunk(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
/*    let search_car_number = $("#search_car_number").val().trim();*/
/*
    let search_model = $("#search_model").val().trim();
*/
    let search_model = $("#search_model").val().trim();
    let searchCriteriaList = [];
    let waiting_Item;
    if(search_model.length>0 ){
        waiting_Item =
            {
                "filterKey": "model",
                "operation": "CONTAINS",
                "value": search_model
            }/*,
            {
                "filterKey": "model",//"user.location",
                "operation": "CONTAINS",
                "value": search_model
            }*/
        searchCriteriaList.push(waiting_Item);
    }
    $.ajax({
        //url: 'http://fdm.asg.az:8080/car-secure-test/api/logs/filter?page=0&size=10',
       //url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/filter?page=' + tablePageNo + '&size=20',
        url: 'http://fdm.asg.az:8080/car-secure-test/api/cars/filter?page=0&size=23',
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
            localStorage.setItem("pagetype", "SearchCar");
            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi
            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);
            //  console.log(totalTrCount);
            $(`#car tbody tr`).remove();
            let tr_number = 0;
            $.each(result.data, function myfunction(i, item) {
                //item = result.data[i] , tr
                // console.log("item:"+item);
                delete_status = item.deleted;
                // console.log("delete_status:"+delete_status);
                if (delete_status == false) {
                    $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++tr_number}</td>
                        <td>${item.number}</td> 
                        <td>${item.model}</td> 
                        <td>${item.year}</td> 
                        <td>${item.colour}</td> 
                        <td>${item.drivers.name} ${item.drivers.surname}</td> 
                      `).appendTo(`#car tbody`);
                }
/*
                $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`
                        <td>${++tr_number}</td>
                         <td>${item.number}</td> 
                         <td>${item.model}</td> 
                        <td>${item.year}</td> 
                        <td>${item.colour}</td> 
                         <td>${item.drivers.name} ${item.drivers.surname}</td> 
                      `).appendTo(`#car tbody`);
*/
            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}