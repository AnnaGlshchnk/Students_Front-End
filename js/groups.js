$(document).ready(function () {

    GetGroups();
    add();
    filter();
    edit();

    $('#window').on('click', "#groupName", function () {
        GetGroupById($(this).parent().find(".grId").attr("gr-id"));
    });

    $('#window').on('click', "#button-edit", function () {
        edit($(this).parent().find(".editGroup").attr("edId"),true)
    });

    $('#window').on('click', "#button-delete", function () {
        DeleteGroup($(this).parent().find(".delGroup").attr("delId"));
    });

    $('#window').on('click', "#list", function () {
        window.location.href = "students.html";
    });

});

function filter() {
    $(function () {
        var dialog, form,
            createDate = $("#createDateNew"),
            finishDate = $("#finishDateNew"),
            allFields = $([]).add(createDate).add(finishDate);

        function filterGroup() {
            var create = $('#createDateNew').val(),
                finish = $('#finishDateNew').val();
            GetGroupsWithParam(create, finish);
            dialog.dialog("close");

        }

        dialog = $("#filter-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Filter": filterGroup,
                Cancel: function () {
                    dialog.dialog("close");
                }
            },
            close: function () {
                form[0].reset();
                allFields.removeClass("ui-state-error");
            }
        });
        form = dialog.find("form").on("submit", function (event) {
            event.preventDefault();
            filterGroup();
        });


        $('#window').on("click", "#filter-btn", function () {
            dialog.dialog("open");
        });
    });

}

function add() {
    $(function () {
        var dialog, form,
            name = $("#name"),
            createDate = $("#createDate"),
            finishDate = $("#finishDate"),
            allFields = $([]).add(name).add(createDate).add(finishDate);

        function addGroup() {
            var name = $('#name').val(),
                create = $('#createDate').val(),
                finish = $('#finishDate').val();
            AddGroup(name, create, finish);
            dialog.dialog("close");

        }

        dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Create": addGroup,
                Cancel: function () {
                    dialog.dialog("close");
                }
            },
            close: function () {
                form[0].reset();
                allFields.removeClass("ui-state-error");
            }
        });
        form = dialog.find("form").on("submit", function (event) {
            event.preventDefault();
            addGroup();
        });


        $('#window').on("click", "#add-btn", function () {
            dialog.dialog("open");
        });
    });

}

function edit(id, button) {
    $(function () {

        var dialog, form,
            name = $("#updateName"),
            createDate = $("#updateCreateDate"),
            finishDate = $("#updateFinishDate"),
            allFields = $([]).add(name).add(createDate).add(finishDate);


        function editGroup() {
            dialog.dialog("open");
            var name = $('#updateName').val(),
                create = $('#updateCreateDate').val(),
                finish = $('#updateFinishDate').val();
            EditGroup(name, create, finish, id);
            dialog.dialog("close");
        }

        dialog = $("#edit-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Edit": editGroup,
                Cancel: function () {
                    dialog.dialog("close");
                }
            },
            close: function () {
                form[0].reset();
                allFields.removeClass("ui-state-error");
            }
        });
        form = dialog.find("form").on("submit", function (event) {
            event.preventDefault();
            editGroup();
        });

        if (button === true) {
            dialog.dialog("open");
        }
    });

}

var host = "http://localhost:8080";

function printTableGroups() {

    $('#window').append(
        '<div id="table">'
        +'<button class="listSt" id="list">Students list </button>'
        + '<button class="btn-add" id="add-btn">Add</button>'
        + '<button class="filterGr" id="filter-btn">Filter</button>'
        + '<div id="groups-contain" class="ui-widget">'
        + '<table class="table-groups"><thead><tr class="tr-groups">'
        + '<th>ID</th><th>Name</th><th class="date"> Start Date</th><th class="date">Finish Date</th><th>Count of students</th><th>AvgAge</th>'
        + '<th></th><th></th></tr></thead>'
        + '<tbody id="group-body"></tbody></table></div></div>'
    );
}

function printGroupById(data) {

    $("#window").append('<button class="btn-back" id="back">Back</button>'
        + '<div id="groups-contain" class="ui-widget">'
        + '<table class="table-groups">'
        + '<thead><tr class="tr-groups">'
        + '<th>Name</th><th>Start Date</th><th>Finish Date</th>'
        + '</tr></thead>'
        + '<tbody id="group-body"></tbody></table>'
        + '<table class="table-students">'
        + '<thead><tr class="tr-students">'
        + '<th>Name</th><th>Surname</th>'
        + '</tr></thead>'
        + '<tbody id="student-body"></tbody></table></div>'
    );
    $('#group-body').append('<tr>'
        + '<td>' + data.name + '</td>'
        + '<td>' + data.createDate + '</td>'
        + '<td>' + data.finishDate + '</td></tr>');

    for (var i = 0; i < data.students.length; i++) {
        $('#student-body').append('<tr>'
            + '<td>' + data.students[i].name + '</td>'
            + '<td>' + data.students[i].surname + '</td></tr>');
    }

    $('#window').on('click', "#back", function () {
        $("#window").empty();
        GetGroups();
    })

}

function printGroups(data) {
    console.log(data);
    printTableGroups();

    for (var group in data) {
        $('#group-body').append('<tr>'
            + '<td>' + data[group].groupId + '</td>'
            + '<td class="grId" id="groupName" gr-id="' + data[group].groupId + '">' + data[group].name + '</td>'
            + '<td>' + data[group].createDate + '</td>'
            + '<td>' + data[group].finishDate + '</td>'
            + '<td>' + data[group].countOfStudent + '</td>'
            + '<td>' + data[group].avgAge + '</td>'
            + '<td class="editGroup" id="button-edit" edId="' + data[group].groupId + '"><button  class="editGr" type="button" >Edit</button></td>'
            + '<td class="delGroup" id="button-delete" delId="' + data[group].groupId + '"><button class="deleteGr" type="button">Delete</button></td></tr>');
    }
}

function GetGroups() {
    $.ajax({
        type: "GET",
        url: host + "/groups",
        dataType: "json",
        success: function (data) {
            printGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function GetGroupsWithParam(start, finish) {
    $.ajax({
        type: "GET",
        url: host + "/groups?start=" + start + "&finish=" + finish,
        dataType: "json",
        success: function (data) {
            $("#window").empty();
            printGroups(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function GetGroupById(id) {
    $.ajax({
        type: "GET",
        url: host + "/groups/" + id,
        dataType: "json",
        success: function (data) {
            $("#window").empty();
            printGroupById(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function AddGroup(name, create, finish) {
    var new_group = {"name": name, "createDate": create, "finishDate": finish};
    $.ajax({
        type: "POST",
        url: host + "/groups",
        data: JSON.stringify(new_group),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: response => {
            $("#window").empty();
            GetGroups();
        }
    });
}

function EditGroup(name, create, finish, id) {
    var new_group = {"name": name, "createDate": create, "finishDate": finish};
    $.ajax({
        type: "PUT",
        url: host + "/groups/" + id,
        data: JSON.stringify(new_group),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: response => {
            $("#window").empty();
            GetGroups();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function DeleteGroup(id) {
    $.ajax({
        type: "DELETE",
        url: host + "/groups/" + id,
        success: function () {
            $("#window").empty();
            GetGroups();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}






