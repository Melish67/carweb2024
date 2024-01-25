let totalTrCount;
let totalTablePageCount = 0;//asagidaki duymelerin sayi yeni umumi sehiflerin sayi
let hazir = 0; //
$(document).ready(function () {
    localStorage.getItem("tokens", "res_token");
    localStorage.setItem("pagetype", "Driver");
    getDriver(1);//necenci seh oldugu

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
                DeleteDriver();
            }
        });
    });
    addPermissionSelect();
    editPermissionSelect();


});
let delete_status;

function getDriver(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/filter?page' + tablePageNo + '&size=60',//work
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
            $(`#driver tbody tr`).remove();
            let tr_number = 0;
            let savab='';
            $.each(result.data, function myfunction(i, item) {
                savab='';
                delete_status = item.deleted;
                 console.log("permissions:"+item.permissions);
                    if (delete_status == false) {
                $.each(item.permissions,function myPermissions(j,jtem){
                    console.log("jtem:"+jtem.name);
                    savab+=jtem.name+',';
                });
                savab = savab.slice(0, -1);
                $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`   
                        <td>${++tr_number}</td>                        
                        <td>${item.name} </td>
                        <td>${item.surname}</td>
                         <td><span style='background-color:#e8fadf;color:#71dd37; padding: 3px 10px;border-radius: 3px;'>${savab}</span></td>`
                    // <td>${savab}</td>
                ).appendTo(`#driver tbody`);}
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


function addPermissionSelect(){
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/permissions/filter?page=0&size=85',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            $('#add_mdl_permission_id').empty()
            $('#add_mdl_permission_id').append($('<option>', {
                value: "",
                text: 'Seç'
            }));
            $.each(result.data, function (i, item) {
                $('#add_mdl_permission_id').append($('<option>', {
                    value: item.id,
                    text: item.name
                }));
            });
            $('#add_mdl_permission_id').trigger("chosen:updated");

            //
            // $(`#add_mdl_permission_id option`).remove();
            // $.each(result.data, function myfunction(i, item) {
            //         delete_status = item.deleted;
            //        // console.log("permissions:"+item.permissions);
            //         if (delete_status == false) {
            //             $(`<option id="${item.id}" value="${item.name}">${item.name}</option>`).appendTo(`#add_mdl_permission_id`);
            //         }
            //
            // });//each sonu
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}
function editPermissionSelect(){
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/permissions/filter?page=0&size=30',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        success: function (result) {
            $('#edit_mdl_permission_id').empty()
            $('#edit_mdl_permission_id').append($('<option>', {
                value: "",
                text: 'Seç'
            }));
            $.each(result.data, function (i, item) {
                $('#edit_mdl_permission_id').append($('<option>', {
                    value: item.id,
                    text: item.name
                }));
            });
            $('#edit_mdl_permission_id').trigger("chosen:updated");
      /*      $(`#edit_mdl_permission_id option`).remove();
            $.each(result.data, function myfunction(i, item) {
                delete_status = item.deleted;
                console.log("permissions:"+item.permissions);
                if (delete_status == false) {
                    $(`<option id="${item.id}">${item.name}</option>`).appendTo(`#edit_mdl_permission_id`);
                }
            });//each sonu*/
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}

$(document).ready(function () {
    $("#add").click(function () {
        //asagidaki kodu yazmiyandada bunun ici bos olur amaki edite basib sora add basanda ici dolu olur
        $("#add_modal_name_id").val("");
        $("#add_modal_surname_id").val("");
    });
    $("#addSave").click(function () {
        AddDriver();
    });
})
function AddDriver() {
    let new_add_mdl_permission_select = $("#add_mdl_permission_id").chosen().val()
   //var premissionJsonArray =JSON.stringify(new_add_mdl_permission_select);
    var premissionJsonArray = JSON.parse("[" + new_add_mdl_permission_select + "]");//reqem geri donderir

    let new_add_modal_name_text = $("#add_modal_name_id").val();
    let new_add_modal_surname_text = $("#add_mdl_surname_id").val();
   // let new_add_modal_permission_text = $("#add_mdl_permission_id option:selected").attr("id");

    let objAdd = {
        deleted: false,//add edit edende  deleted: false,
      //  number: new_add_modal_card_number_text,
        name:new_add_modal_name_text,
        surname:new_add_modal_surname_text,
        //permissions:new_add_modal_permission_text
        permissions:premissionJsonArray
    };
    //console.log("Zzzzzz"+new_add_modal_permission_text);
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objAdd),
        success: function (result) {
            getDriver();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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

//tr clickde
let tr_id, tr_name, tr_surname,tr_permission;
function trClick(e) {
    $("#driver tbody tr").css("background", "white");//umumi
    $(e).css({
        "background": "#fb320f",
        "color": "#flff"
    });
    tr_id = $(e).attr("trid");
    //tr_no = $(e).children().eq(0).text();
    tr_name = $(e).children().eq(1).text();
    tr_surname = $(e).children().eq(2).text();
    tr_permission = $(e).children().eq(3).text();
    console.log("tr_permission:"+tr_permission);

}
$(document).ready(function () {
    $("#edit").click(function () {
        $("#edit_modal_name_id").val(tr_name);
        $("#edit_modal_surname_id").val(tr_surname);
        $("#edit_mdl_permission_id").val(tr_permission);
    });
    $("#editSave").click(function () {
        EditDriver();
    });
});
function EditDriver() {
    let new_edit_mdl_permission_select = $("#edit_mdl_permission_id").chosen().val()
    //var premissionJsonArray =JSON.stringify(new_add_mdl_permission_select);
    var premissionJsonArray = JSON.parse("[" + new_edit_mdl_permission_select + "]");//reqem geri donderir

    let new_edit_mdl_name_text = $("#edit_modal_name_id").val();
    let new_edit_mdl_surname_text = $("#edit_modal_surname_id").val();
    //let new_edit_mdl_name_surname = $("#edit_mdl_name_surname option:selected").attr("id");
   // let gt2 =$("#gt option:selected").val();
    // let new_edit_mdl_name_surname = $("#edit_mdl_name_surname option[value="+deyisentable+"]").val();
    let objEdit = {
        deleted: false,
        name: new_edit_mdl_name_text,
        surname: new_edit_mdl_surname_text,
        permissions:premissionJsonArray
    };
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/' + tr_id,//work
        type: 'PUT',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objEdit),
        success: function (result) {
            getDriver();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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
function DeleteDriver() {
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/' + tr_id,//work
        type: 'DELETE',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        // data: JSON.stringify(objPermissionsDelete),
        success: function (result) {
            getDriver();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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



function SearchDriverFunk(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    let search_name = $("#search_name").val().trim();
    let search_surname = $("#search_surname").val().trim();

    let searchCriteriaList = [];
    let waiting_Item;

    if(search_name.length>0 || search_surname.length>0 ){
        waiting_Item =
            {
                "filterKey": "name",
                "operation": "CONTAINS",
                "value": search_name
            },
            {
                "filterKey": "username",//"user.location",
                "operation": "CONTAINS",
                "value": search_surname
            }
        searchCriteriaList.push(waiting_Item);
    }
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/drivers/filter?page=' + tablePageNo + '&size=60',
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
            localStorage.setItem("pagetype", "SearchDriver");
            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi
            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);

            //  console.log(totalTrCount);
            $(`#driver tbody tr`).remove();
            let tr_number = 0;
            let savab='';
            $.each(result.data, function myfunction(i, item) {
                savab='';
                delete_status = item.deleted;
                console.log("permissions:"+item.permissions);
                if (delete_status == false) {
                    $.each(item.permissions,function myPermissions(j,jtem){
                        console.log("jtem:"+jtem.name);
                        savab+=jtem.name+',';
                    });
                    savab = savab.slice(0, -1);
                    $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`   
                        <td>${++tr_number}</td>                        
                        <td>${item.name} </td>
                        <td>${item.surname}</td>
                        <td>${savab}</td>`
                    ).appendTo(`#driver tbody`);
                }

            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}


/*

jQuery(function () {
    jQuery(".multiSelect").each(function (e) {
        var self = jQuery(this);
        var field = self.find(".multiSelect_field");
        var fieldOption = field.find("option");
        var placeholder = field.attr("data-placeholder");

        field.hide().after(
            `<div class="multiSelect_dropdown"></div>
                        <span class="multiSelect_placeholder">` +
            placeholder +
            `</span>
                        <ul class="multiSelect_list"></ul>
                        <span class="multiSelect_arrow"></span>`
        );

        fieldOption.each(function (e) {
            jQuery(".multiSelect_list").append(
                `<li class="multiSelect_option" data-value="` +
                jQuery(this).val() +
                `">
                                            <a class="multiSelect_text">` +
                jQuery(this).text() +
                `</a>
                                          </li>`
            );
        });

        var dropdown = self.find(".multiSelect_dropdown");
        var list = self.find(".multiSelect_list");
        var option = self.find(".multiSelect_option");
        var optionText = self.find(".multiSelect_text");

        dropdown.attr("data-multiple", "true");
        list.css("top", dropdown.height() + 5);

        option.click(function (e) {
            var self = jQuery(this);
            e.stopPropagation();
            self.addClass("-selected");
            field
                .find("option:contains(" + self.children().text() + ")")
                .prop("selected", true);
            dropdown
                .append(function (e) {
                    return jQuery(
                        '<span class="multiSelect_choice">' +
                        self.children().text() +
                        '<svg class="multiSelect_deselect -iconX"><use href="#iconX"></use></svg></span>'
                    ).click(function (e) {
                        var self = jQuery(this);
                        e.stopPropagation();
                        self.remove();
                        list
                            .find(".multiSelect_option:contains(" + self.text() + ")")
                            .removeClass("-selected");
                        list
                            .css("top", dropdown.height() + 5)
                            .find(".multiSelect_noselections")
                            .remove();
                        field
                            .find("option:contains(" + self.text() + ")")
                            .prop("selected", false);
                        if (dropdown.children(":visible").length === 0) {
                            dropdown.removeClass("-hasValue");
                        }
                    });
                })
                .addClass("-hasValue");
            list.css("top", dropdown.height() + 5);
            if (!option.not(".-selected").length) {
                list.append('<h5 class="multiSelect_noselections">No Selections</h5>');
            }
        });

        dropdown.click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            dropdown.toggleClass("-open");
            list
                .toggleClass("-open")
                .scrollTop(0)
                .css("top", dropdown.height() + 5);
        });

        jQuery(document).on("click touch", function (e) {
            if (dropdown.hasClass("-open")) {
                dropdown.toggleClass("-open");
                list.removeClass("-open");
            }
        });
    });
});*/
