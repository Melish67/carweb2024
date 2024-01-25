let totalTrCount;
let totalTablePageCount = 0;//asagidaki duymelerin sayi yeni umumi sehiflerin sayi
let hazir = 0; //
$(document).ready(function () {
    localStorage.getItem("tokens", "res_token");
    localStorage.setItem("pagetype", "Question");
    getQuestion(1);//necenci seh oldugu

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

function getQuestion(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/questions/filter?page='+ tablePageNo + '&size=60',//work
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
            $(`#question tbody tr`).remove();
            let number = 0;
            $.each(result.data, function myfunction(i, item) {
                delete_status = item.deleted;
                // console.log("delete_status:"+delete_status);
                if (delete_status == false) {
                    $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++number}</td>
                        <td>${item.header}</td> 
                        <td>${item.text}</span></td> 
                      `).appendTo(`#question tbody`);
                }

            /*    $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`
                        <td>${++number}</td>
                        <td>${item.header}</td>
                        <td>${item.text}</span></td>
                      `).appendTo(`#question tbody`);*/
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



//tr clickde edit ve delete
let tr_id, tr_number, tr_header, tr_question;

function trClick(e) {
    $("#question tbody tr").css("background", "white");//umumi
    $(e).css({
        "background": "#fb320f",
        "color": "#flff"
    });
    tr_id = $(e).attr("trid");
    tr_number = $(e).children().eq(0).text();
    tr_header = $(e).children().eq(1).text();
    tr_question = $(e).children().eq(2).text();
    console.log("tr_number:" + tr_number, "tr_header:" + tr_header, "tr_question:" + tr_question);

}
$(document).ready(function () {
    $("#edit").click(function () {
        $("#edit_modal_no_id").val(tr_number);
        $("#edit_modal_header_id").val(tr_header);
        $("#edit_modal_question_id").val(tr_question);

    });

    $("#editSave").click(function () {
        EditQuestion();
    });
    $("#add").click(function () {
        //asagidaki kodu yazmiyandada bunun ici bos olur amaki edite basib sora add basanda ici dolu olur
        $("#add_modal_name_id").val("");
        $("#add_modal_desc_id").val("");
    });
    $("#addSave").click(function () {
        AddQuestion();
    });
});
function EditQuestion() {
    //let new_edit_mdl_no_text = $("#trid").val();
    let new_edit_mdl_header_text = $("#edit_modal_header_id").val();
    let new_edit_mdl_question_text = $("#edit_modal_question_id").val();

    let objQuestion = {
        deleted: false,
        header: new_edit_mdl_header_text,
        text: new_edit_mdl_question_text,
    };
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/questions/' + tr_id,//work
        type: 'PUT',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objQuestion),
        success: function (result) {
            getQuestion();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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
function AddQuestion() {
    let new_add_mdl_header_text = $("#add_modal_header_id").val();
    let new_add_mdl_question_text = $("#add_modal_question_id").val();

    let objQuestionAdd = {
        deleted: false,
        header: new_add_mdl_header_text,
        text: new_add_mdl_question_text,
    };
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/questions',//work
        type: 'POST',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        data: JSON.stringify(objQuestionAdd),
        success: function (result) {
            getQuestion();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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
        url: 'http://fdm.asg.az:8080/car-secure-test/api/questions/' + tr_id,//work
        type: 'DELETE',
        crossDomain: true,
        contentType: "application/json", // Set content type
        // headers: {"Authorization": "Bearer "},
        headers: {"Authorization": "Bearer " + localStorage.getItem('tokens').trim()},
        // data: JSON.stringify(objPermissionsDelete),
        success: function (result) {
            getQuestion();//bazadan son melumatlari getirir, refresh olur teze mel gelir
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
function SearchQuestionFunk(tablePageNo) {
    Swal.fire({
        title: 'Please Wait !',
        html: 'data uploading',// add html attribute if you want or remove
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
    });
    let search_quest = $("#search_question").val().trim();
    console.log("search_quest: " + search_quest);
    let searchCriteriaList = [];
    let waiting_Item;
    if (search_quest.length > 0) {
        waiting_Item =
            {
                "filterKey": "text",
                "operation": "CONTAINS",
                "value": search_quest
            }
        searchCriteriaList.push(waiting_Item);
    }
    $.ajax({
        url: 'http://fdm.asg.az:8080/car-secure-test/api/questions/filter?page=' + tablePageNo + '&size=20',
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
            localStorage.setItem("pagetype", "SearchQuestion");
            totalTrCount = result.page.totalElements;
            totalTablePageCount = result.page.totalPages;// result.pageCount; umumi olaraq nece seh olacaq onun sayi,hemde asagidaki button sayi
            if (hazir == 0)
                hazirZero();
            // console.log("result.data:"+result.data);

            //  console.log(totalTrCount);
            $(`#question tbody tr`).remove();
            let number = 0;
            $.each(result.data, function myfunction(i, item) {
                //item = result.data[i] , tr
                // console.log("item:"+item);
                //    tr_id = $(e).attr("trid");
                $(`<tr trid="${item.id}" onclick="trClick(this);">`).html(`           
                        <td>${++number}</td>
                        <td>${item.header}</td> 
                        <td>${item.text}</td> 
                      `).appendTo(`#question tbody`);
            });//each sonu
            swal.close();
        },//succes sonu
        failure: function (jqXHR, textStatus, errorThrown) {
            alert(`error`); // Display error message
        }
    });//ajax
}

