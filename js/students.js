$(document).ready(function () {

    GetStudents();
    add();
    filter();
    edit();

    $('#windowStudent').on('click', "#studentName", function () {
        GetStudentById($(this).parent().find(".studentId").attr("st-id"));
    });

    $('#windowStudent').on('click', "#button-edit", function () {
        edit($(this).parent().find(".editStudent").attr("edId"), true)
    });

    $('#windowStudent').on('click', "#button-delete", function () {
        DeleteStudent($(this).parent().find(".delStudent").attr("delId"));
    });

    $('#windowStudent').on('click', "#listGroup", function () {
        window.location.href = "groups.html";
    });

});

function filter() {
    $(function () {
        var dialog, form,
            minBirthDate = $("#minBirthDate"),
            maxBirthDate = $("#maxBirthDate"),
            allFields = $([]).add(minBirthDate).add(maxBirthDate);

        function filterStudents() {
            var minBirthDate = $('#minBirthDate').val(),
                maxBirthDate = $('#maxBirthDate').val();
            GetStudentsWithParam(minBirthDate, maxBirthDate);
            dialog.dialog("close");

        }

        dialog = $("#filter-student-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Filter": filterStudents,
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
            filterStudents();
        });


        $('#windowStudent').on("click", "#filter-btn", function () {
            dialog.dialog("open");
        });
    });

}

function add() {
    $(function () {
        var dialog, form,
            firstName = $("#firstName"),
            surname = $("#surname"),
            birthDate = $("#birthDate"),
            groupId = $("#groupId"),
            allFields = $([]).add(firstName).add(surname).add(birthDate).add(groupId);

        function addStudent() {
            var firstName = $('#firstName').val(),
                surname = $('#surname').val(),
                birthDate = $('#birthDate').val(),
                groupId = $('#groupId').val();
            AddStudent(firstName, surname, birthDate, groupId);
            dialog.dialog("close");

        }

        dialog = $("#dialog-student-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Create": addStudent,
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
            addStudent();
        });


        $('#windowStudent').on("click", "#add-btn", function () {
            dialog.dialog("open");
        });
    });

}

function edit(id, button) {
    $(function () {

        var dialog, form,
            firstName = $("#firstNameUpdate"),
            surname = $("#surnameUpdate"),
            birthDate = $("#birthDateUpdate"),
            groupId = $("#groupIdUpdate"),
            allFields = $([]).add(firstName).add(surname).add(birthDate).add(groupId);


        function editStudent() {
            dialog.dialog("open");
            var firstName = $('#firstNameUpdate').val(),
                surname = $('#surnameUpdate').val(),
                birthDate = $('#birthDateUpdate').val(),
                groupId = $('#groupIdUpdate').val();
            EditStudent(firstName, surname, birthDate, groupId, id);
            dialog.dialog("close");
        }

        dialog = $("#edit-student-form").dialog({
            autoOpen: false,
            height: 400,
            width: 350,
            modal: true,
            buttons: {
                "Edit": editStudent,
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
            editStudent();
        });

        if (button === true) {
            dialog.dialog("open");
        }
    });

}

var host = "http://localhost:8080";

function printTableStudents() {

    $('#windowStudent').append(
        '<div id="table">'
        + '<button class="listGr" id="listGroup">Groups list</button>'
        + '<button class="btn-addSt" id="add-btn">Add</button>'
        + '<button class="filterSt" id="filter-btn">Filter</button>'
        + '<div id="students-contain" class="ui-widget">'
        + '<table class="table-students"><thead><tr class="tr-students">'
        + '<th>ID</th><th>Name</th><th> Surname</th><th>Birth Date</th><th>Group ID</th>'
        + '<th></th><th></th></tr></thead>'
        + '<tbody id="student-body"></tbody></table></div></div>'
    );
}

function printStudentById(data) {

    $("#windowStudent").append('<button class="btn-back" id="back">Back</button>'
        + '<div id="students-contain" class="ui-widget">'
        + '<table class="table-groups">'
        + '<thead><tr class="tr-groups">'
        + '<th>ID</th><th>Name</th><th> Surname</th><th>Birth Date</th><th>Group ID</th>'
        + '</tr></thead>'
        + '<tbody id="student-body"></tbody></table></div>'
    );
    $('#student-body').append('<tr>'
        + '<td>' + data.studentId + '</td>'
        + '<td>' + data.name + '</td>'
        + '<td>' + data.surname + '</td>'
        + '<td>' + data.birthDate + '</td>'
        + '<td>' + data.group.groupId + '</td></tr>');

    $('#windowStudent').on('click', "#back", function () {
        $("#windowStudent").empty();
        GetStudents();
    })

}

function printStudents(data) {
    printTableStudents();

    for (var student in data) {
        $('#student-body').append('<tr>'
            + '<td>' + data[student].studentId + '</td>'
            + '<td class="studentId" id="studentName" st-id="' + data[student].studentId + '">' + data[student].name + '</td>'
            + '<td>' + data[student].surname + '</td>'
            + '<td>' + data[student].birthDate + '</td>'
            + '<td>' + data[student].group.groupId + '</td>'
            + '<td class="editStudent" id="button-edit" edId="' + data[student].studentId + '"><button class="editSt" type="button" >Edit</button></td>'
            + '<td class="delStudent" id="button-delete" delId="' + data[student].studentId + '"><button class="deleteSt" type="button">Delete</button></td></tr>');
    }
}

function GetStudents() {
    $.ajax({
        type: "GET",
        url: host + "/students",
        dataType: "json",
        success: function (data) {
            printStudents(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function GetStudentsWithParam(minBirthDate, maxBirthDate) {
    $.ajax({
        type: "GET",
        url: host + "/students?minBirthDate=" + minBirthDate + "&maxBirthDate=" + maxBirthDate,
        dataType: "json",
        success: function (data) {
            $("#windowStudent").empty();
            printStudents(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function GetStudentById(id) {
    $.ajax({
        type: "GET",
        url: host + "/students/" + id,
        dataType: "json",
        success: function (data) {
            $("#windowStudent").empty();
            printStudentById(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function AddStudent(firstName, surname, birthDate, groupId) {
    var new_student = {
        "name": firstName,
        "surname": surname,
        "birthDate": birthDate,
        "group": {
            "groupId": groupId
        }
    };
    $.ajax({
        type: "POST",
        url: host + "/students",
        data: JSON.stringify(new_student),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: response => {
            $("#windowStudent").empty();
            GetStudents();
        }
    });
}

function EditStudent(firstName, surname, birthDate, groupId, id) {
    var new_student = {
        name: firstName,
        surname: surname,
        birthDate: birthDate,
        group: {
            groupId: groupId
        }
    };
    $.ajax({
        type: "PUT",
        url: host + "/students/" + id,
        data: JSON.stringify(new_student),
        contentType: "application/json; charset=utf-8",
        dataType: "html",
        success: response => {
            $("#windowStudent").empty();
            GetStudents();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function DeleteStudent(id) {
    $.ajax({
        type: "DELETE",
        url: host + "/students/" + id,
        success: function () {
            $("#windowStudent").empty();
            GetStudents();
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}






