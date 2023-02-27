let delDId;
let delLId;
let delPId;

var $preloader = $('#loading'),
	    $spinner = $preloader.find('.loader');
	    $spinner.fadeOut();
$preloader.delay(50).fadeOut('slow');


$(document).ready(function () {

  let mybutton = document.getElementById("btn-back-to-top");
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (
    document.body.scrollTop > 700 ||
    document.documentElement.scrollTop > 700
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
mybutton.addEventListener("click", backToTop);
function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

  $('#btnAddD').hide();
  $('#btnAddL').hide();

  $('#nav-department-tab').click(function(){
    $('#btnAddP').hide();
    $('#btnAddL').hide();
    $('#btnAddD').show();
  });

  $('#nav-location-tab').click(function(){
    $('#btnAddP').hide();
    $('#btnAddL').show();
    $('#btnAddD').hide();
  });

  $('#nav-personnel-tab').click(function(){
    $('#btnAddP').show();
    $('#btnAddL').hide();
    $('#btnAddD').hide();
  });

alertify.defaults.transition = "fade";
alertify.defaults.theme.ok = "btn btn-outline-success";
alertify.defaults.theme.cancel = "btn btn-outline-danger";
alertify.defaults.theme.input = "form-control";


$('#editPersonnelModal, #createLocationModal, #createDepartmentModal, #createPersonnelModal, #editLocationModal, #editDepartmentModal, #deleteDepartmentModal, #cantDeleteD, #deleteLocationModal, #cantDeleteL, #deletePersonnelModal').on('hidden.bs.modal', function () {
  $(this).find('input, select').val('');

});



$('#editPersonnelModal, #createPersonnelModal, #createDepartmentModal, #editDepartmentModal, #createLocationModal, #editLocationModal').on('shown.bs.modal', function () {
  $('#firstName, #eFirstName, #departmentName, #eDepartment, #locationName, #eLocation').focus();

});

function getAll(){
  $.ajax({
    type: "POST",
    url: "php/getAll.php",
    data: {},
    dataType: "json",
    success: function (results) {

      let rows = [];

      for (let i = 0; i < results.data.length; i++) {
        rows += `<tr data-id="${results.data[i].id}">
                <td>${results.data[i].firstName}</td>
                <td>${results.data[i].lastName}</td>
                <td class="d-none d-sm-table-cell">${results.data[i].email}</td>
                <td class="d-none d-sm-table-cell">${results.data[i].jobTitle}</td>
                <td class="d-none d-sm-table-cell">${results.data[i].department}</td>
                <td class="d-none d-sm-table-cell">${results.data[i].location}</td>
                <td>
                <button type="button" class="btn btn-success btn-sm" data-bs-target="#editPersonnelModal" data-bs-toggle="modal"><i class="fa-regular fa-pen-to-square"></i></button>
                <button type="button" class="btn btn-danger btn-sm deletePersonnelBtn" data-id=""><i class="fa-regular fa-trash-can"></i></button>
             
                </td>
                </tr>`;
      }
      $("#personnelTable").html(rows);
      $('[data-bs-target="#editPersonnelModal"]').click(function() {
        $.ajax({
        type: 'GET',
        url: 'php/getPersonnelById.php',
        data: {
          personnelID: $(this).closest('tr').data('id'),
        },
        dataType: 'json',
        success: function(results) {
          console.log('a', results)
            let id = results.data[0].id;
            let firstName = results.data[0].firstName;
            let lastName = results.data[0].lastName;
            let email = results.data[0].email;
            let jobTitle = results.data[0].jobTitle;
            let departmentID = results.data[0].departmentID;
            $('#ePersonnelID').val(id);
            $('#eFirstName').val(firstName);
            $('#eLastName').val(lastName);
            $('#eEmail').val(email);
            $('#eJobTitle').val(jobTitle);
            $('#selectDepartmentEdit').val(departmentID);
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
      })
      });
      $('.deletePersonnelBtn').click(function() {
        $.ajax({
          type: 'GET',
          url: 'php/getPersonnelById.php',
          data: {
            personnelID: $(this).closest('tr').data('id'),
          },
          dataType: 'json',
          success: function(results) {
            $("#areYouSurePname").text(results.data[0].firstName);
            $('#deletePersonnelModal').modal("show");
         },
          error: function(jqXHR, textStatus, errorThrown) {
          }
        })
      });
      $('#personnelTable tr').click(function(){
        delPId = $(this).data('id');

      
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {

    },
  });
};
getAll();
function getAllDepartments(){
  $.ajax({
    type: 'POST',
    url: "php/getAllDepartments.php",
    data: {},
    dataType: 'json',
    success: function(results) {

        for (let i = 0; i < results.data.length; i++){
            $('#selectDepartmentEdit, #selectDepartmentCreate').append($('<option>', {
              value: results.data[i].id,
              text: results.data[i].name,
          }, '</option>'));
        }
        let rows = [];

        for (let i = 0; i < results.data.length; i++){
            rows += `<tr data-id="${results.data[i].id}">
            <td>${results.data[i].name}</td>
            <td>${results.data[i].location}</td>
            <td>
            <button type="button" class="btn btn-success btn-sm" data-bs-target="#editDepartmentModal" data-bs-toggle="modal"><i class="fa-regular fa-pen-to-square"></i></button>
            <button type="button" class="btn btn-danger btn-sm deleteDepartmentBtn" data-id=""><i class="fa-regular fa-trash-can"></i></button>
            </td>
            </tr>`;
        }
        $('#departmentTable').html(rows);
        $('[data-bs-target="#editDepartmentModal"]').click(function() {
          $.ajax({
            type: 'GET',
            url: 'php/getDepartmentById.php',
            data: {
              departmentID:  $(this).closest('tr').data('id'),
            },
            dataType: 'json',
            success: function(results) {

                let id = results.data[0].departmentID;
                let department = results.data[0].department;
                let locationID = results.data[0].locationID;
        
                $('#eDepartment').val(department);
                $('#selectLocationEditD').val(locationID);
                $('#eDepartmentID').val(id);
            },
            error: function(jqXHR, textStatus, errorThrown) {

            }
        })
        });
        $(".deleteDepartmentBtn").click(function(event) {
          event.preventDefault();
          $.ajax({
            url: "php/checkDepartments.php",
            type: 'POST',
            dataType: 'json',
            data: {
              departmentID: $(this).closest('tr').data('id'),
            },
            success: function (result) {

             if (result.status.code == 200) {
               if (result.data[0].departmentCount == 0) {
                 $("#areYouSureDeptName").text(result.data[0].departmentName);
                 $('#deleteDepartmentModal').modal("show");
               } else {
                 $("#cantDeleteDeptName").text(result.data[0].departmentName);
                 $("#pc").text(result.data[0].departmentCount);
                 $('#cantDeleteD').modal("show");          
               }
             } 
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
          });
        }); 
        $('#departmentTable tr').click(function(){
          delDId = $(this).data('id');

      });
    },
    error: function(jqXHR, textStatus, errorThrown) {

    }
    
})
};
getAllDepartments();
function getAllLocations(){
$.ajax({
  type: 'POST',
  url: "php/getAllLocations.php",
  data: {},
  dataType: 'json',
  success: function(results) {

      for (let i = 0; i < results.data.length; i++){
        $('#selectLocationEditD, #selectLocationCreateD').append($('<option>', {
          value: results.data[i].id,
          text: results.data[i].name,
      }, '</option>'));
    }
    let rows = [];

    for (let i = 0; i < results.data.length; i++) {
      rows += `<tr data-id="${results.data[i].id}">
              <td>${results.data[i].name}</td>
              <td>
              <button type="button" class="btn btn-success btn-sm" data-bs-target="#editLocationModal" data-bs-toggle="modal"><i class="fa-regular fa-pen-to-square"></i></button>
              <button type="button" class="btn btn-danger btn-sm deleteLocationBtn" data-id=""><i class="fa-regular fa-trash-can"></i></button>
              </td>
              </tr>`;
    }
    $("#locationTable").html(rows);
    $('[data-bs-target="#editLocationModal"]').click(function() {
      $.ajax({
        type: 'GET',
        url: 'php/getLocationById.php',
        data: {
          locationID : $(this).closest('tr').data('id'),
        },
        dataType: 'json',
        success: function(results) {

            let location = results.data[0].location;
            let id = results.data[0].locationID;
    
            $('#eLocation').val(location);
            $('#eLocationID').val(id);
            
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    })
    
    });
    $(".deleteLocationBtn").click(function(event) {
      event.preventDefault();
      $.ajax({
        url: "php/checkLocations.php",
        type: 'POST',
        dataType: 'json',
        data: {
          locationID: $(this).closest('tr').data('id'),
        },
        success: function (result) {

         if (result.status.code == 200) {
           if (result.data[0].locationCount == 0) {
             $("#areYouSureLocName").text(result.data[0].locationName);
             $('#deleteLocationModal').modal("show");
           } else {
             $("#cantDeleteLocName").text(result.data[0].locationName);
             $("#pcc").text(result.data[0].locationCount);
             $('#cantDeleteL').modal("show");          
           }
         } 
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
      });
    });
    
    $('#locationTable tr').click(function(){
      delLId = $(this).data('id');
    
    });
    },
error: function(jqXHR, textStatus, errorThrown) {

}
})
};
getAllLocations();
$("#addLocationForm").on("submit", function(event) {
  event.preventDefault();
  alertify.confirm('Location', 'Would you like to create new location?', function(){ 
  $.ajax({
    type: 'POST',
    url: 'php/createLocation.php',
    data: {
      name: $('#locationName').val(),
    },
    dataType: 'json',
    success: function() {
      $("#createLocationModal").modal('hide');
      $("#locationTable").html('');
      $('#selectLocationEditD, #selectLocationCreateD').html('');
      getAllLocations();
      
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    })
    alertify.success('New location has been created.');
   }, function(){ 
      alertify.error('Canceled.');
      $("#createLocationModal").modal('hide');
    });
});

$("#addDepartmentForm").on("submit", function(event) {
  event.preventDefault();
  alertify.confirm('Department', 'Would you like to create new department?', function(){
  $.ajax({
    type: 'POST',
    url: 'php/createDepartment.php',
    data: {
      name:  $('#departmentName').val(),
      locationID: $('#selectLocationCreateD').val()
    },
    dataType: 'json',
    success: function() {
      $("#createDepartmentModal").modal('hide');
      $("#departmentTable").html('');
      $('#selectDepartmentEdit, #selectDepartmentCreate').html('');
      getAllDepartments();
    
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    })
    alertify.success('New department has been created.') 
  }, function(){ 
    alertify.error('Canceled.');
    $("#createDepartmentModal").modal('hide');
  });
});



$("#addPersonnelForm").on("submit", function(event) {
  event.preventDefault();
  alertify.confirm('Personnel', 'Would you like to create new personnel?', function(){
  $.ajax({
    type: 'POST',
    url: 'php/createPersonnel.php',
    data: {
      firstName:  $('#firstName').val(),
      lastName: $('#lastName').val(),
      email: $('#email').val(),
      jobTitle: $('#jobTitle').val(),
      departmentID: $('#selectDepartmentCreate').val(),
    },
    dataType: 'json',
    success: function() {
      $("#createPersonnelModal").modal('hide');
      $("#personnelTable").html('');
      $('#selectDepartmentEdit, #selectDepartmentCreate').html('');
      getAll();
      
    
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    })
    alertify.success('New personnel has been created.') 
  }, function(){ 
    alertify.error('Canceled.');
    $("#createPersonnelModal").modal('hide');
  });
});


$("#deleteDepartment").on("click", function(event){
  event.preventDefault();
      $.ajax({
       type: 'POST',
       url: "php/deleteDepartmentById.php",
       data: {
         departmentID: delDId,
       },
       dataType: 'json',
       success: function() {
         $("#deleteDepartmentModal").modal('hide');
         $("#departmentTable").html('');
         getAllDepartments();
       },

       error: function(jqXHR, textStatus, errorThrown) {
           console.log(jqXHR, textStatus, errorThrown);
       }
   });
   alertify.success('Department has been deleted.') 
  });



$("#deleteLocation").on("click", function(event){
  event.preventDefault();
      $.ajax({
        type: 'POST',
        url: "php/deleteLocationById.php",
        data: {
          locationID: delLId,
        },
        dataType: 'json',
        success: function() {
          $("#deleteLocationModal").modal('hide');
          $('#locationTable').html('');
          getAllLocations();
        },
 
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    }) 
    alertify.success('Location has been deleted.') 
    });

$("#deletePersonnel").on("click", function(event){
  event.preventDefault();
  $.ajax({
       type: 'POST',
       url: "php/deletePersonnelById.php",
       data: {
         personnelID: delPId,
       },
       dataType: 'json',
       success: function() {
         $("#deletePersonnelModal").modal('hide');
         $('#personnelTable').html('');
         getAll();
       },

       error: function(jqXHR, textStatus, errorThrown) {
           console.log(jqXHR, textStatus, errorThrown);
       }
   }) 
   alertify.success('Personnel has been deleted.') 
});


$("#editLocationForm").on('submit', function(event) {
  event.preventDefault();
  alertify.confirm('Location', 'Would you like to update location?', function(){
  $.ajax({
      type: 'POST',
      url: "php/editLocation.php",
      data: {
          name: $('#eLocation').val(),
          locationID: $('#eLocationID').val()
        
      },
      dataType: 'json',
       success: function() {
        $("#editLocationModal").modal('hide');
        $('#locationTable').html('');
        getAllLocations();
      },

      error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus, errorThrown);
      }
  }) 
  alertify.success('Location has been updated.') 
}, function(){ 
  alertify.error('Canceled.');
  $("#editLocationModal").modal('hide');
});
});



$("#editDepartmentForm").on("submit", function(event) {
  event.preventDefault();
  alertify.confirm('Department', 'Would you like to update department?', function(){
  $.ajax({
      type: 'POST',
      url: "php/editDepartment.php",
      data: {
          name:  $('#eDepartment').val(), 
          locationID: $('#selectLocationEditD').val(),
          departmentID:  $('#eDepartmentID').val()
      },
      dataType: 'json',
       success: function() {
        $("#editDepartmentModal").modal('hide');
        $('#departmentTable').html('');
        getAllDepartments();
      },

      error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus, errorThrown);
      }
  }) 
  alertify.success('Department has been updated.') 
}, function(){ 
  alertify.error('Canceled.');
  $("#editDepartmentModal").modal('hide');
});
});



$("#editPersonnelForm").on("submit", function(event) {
  event.preventDefault();
  alertify.confirm('Personnel', 'Would you like to update personnel?', function(){
    $.ajax({
        type: 'POST',
        url: "php/editPersonnel.php",
        data: {
            id: $('#ePersonnelID').val(),
            firstName: $('#eFirstName').val(),
            lastName: $('#eLastName').val(),
            email: $('#eEmail').val(),
            jobTitle: $('#eJobTitle').val(),
            departmentID: $('#selectDepartmentEdit').val()
        },
        dataType: 'json',
         success: function() {
          $("#editPersonnelModal").modal('hide');
          $('#personnelTable').html('');
          getAll();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    }) 
    alertify.success('Personnel has been updated.') 
  }, function(){ 
    alertify.error('Canceled.');
    $("#editPersonnelModal").modal('hide');
  });

});

});




