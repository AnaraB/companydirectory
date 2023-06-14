'use strict';

//------------------------------------------------SEARCH section--------------------------------------------//

$('#searchSubmit').on('click', function (){
    
    $.ajax({
        method: 'POST',
        url: 'libs/php/search.php',
        data: {
            department: $('#selectDepartment').val(),
            location: $('#selectLocation').val(),
            search_value: $('#search').val()
        },
        success: function(result){
          
            populateEmployeesTab(result.data.personnel);

        },
        error: function(error) {
            console.error(error);
        }
    })
})

////---------------------------------------------------------- PERSONNEL section--------------------------------------------------////
getAll();

function getAll() {
    $.ajax({
        method: 'GET',
        url: 'libs/php/getAll.php',
        success: function(result) {
            const data = result.data;
       
            populateEmployeesTab(data);
        
        },
        error: function(error) {
            console.error(error);
        }
      
    });

}


function populateEmployeesTab(data) {

    const $employeesList =  $('#employeesList');
    $employeesList.empty();

       

    data.forEach(function(val, i, arr) {
      
        $employeesList.append(`
        <tr data-employee-record='${JSON.stringify(val)}'>
            <td>${val.lastName}, ${val.firstName}</td>
            <td class="d-none d-sm-none d-md-table-cell">${val.department}</td>
            <td class="d-none d-sm-none d-md-table-cell">${val.location}</td>

            <td><button class="btn btn-sm btn-secondary text-white viewEmployeeDetails" data-bs-toggle="modal" data-bs-target="#view">
            <i class="fa fa-eye" aria-hidden="true"></i></button></td>

            <td><button class="btn btn-sm btn-warning text-white" data-bs-toggle="modal" data-bs-target="#employeeDetails" data-id=${val.id}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg></button></td>

            <td><button class="btn btn-sm btn-success col-sm deleteEmployeeInfo" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
        
        </tr>
         
        
    `);
    });
    
           
}
//////////// VIEW EMPLOYEE DETAILS modal ////////////////

$(document).on('click', '.viewEmployeeDetails', function() {
   
    const employee = JSON.parse($(this).closest('tr').attr('data-employee-record'));
    const name = employee.firstName;
    const surname = employee.lastName;
    const employeeName = name.concat(' ',surname);
    if (employee) {
      $('#employeeName').html(employeeName);
      $('#email').html(employee.email);
      $('#jobTitle').html(employee.jobTitle);
      $('#viewDepartment').html(employee.department);
      $('#location').html(employee.location);
 
    }
})

//////////// EDIT EMPLOYEE DETAILS modal ////////////////

$('#employeeDetails').on('show.bs.modal', function (e) {
    const employeeId = $(e.relatedTarget).attr('data-id');
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      method: 'POST',
      dataType: 'json',
      data: {
        id: employeeId // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {    
      if (result.status.code == 200) {
        // Populate departments dropdown first
        $('#department').html('');
        populateDepartmentsDropdown(result.data.department, '#department');
        
        if(employeeId) {
            const employeeData = result.data.personnel[0];
            $('#employeeID').val(employeeData.id);
            
            $('#firstName').val(employeeData.firstName);
            $('#lastName').val(employeeData.lastName);
            $('#jobTitle').val(employeeData.jobTitle);
            $('#emailAddress').val(employeeData.email);
            $('#employeeDetailsAction').text('Edit employee');
            
            $('#department > option').each(function(i,elem){
                if($(elem).val() == employeeData.departmentID){
                    $(elem).attr('selected', true);
                }
            })
                
        }
              
        
      } else {

        $('#employeeDetails .modal-title').replaceWith("Error retrieving data");

      } 

    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#employeeDetails.modal-title').replaceWith("Error retrieving data");
    }
  });

})

// Executes when the form button with type="submit" is clicked

$('#employeeForm').on("submit", function(e) {
  
    e.preventDefault();
    
    $.ajax({
        method:'POST',
        url:'libs/php/insertEmployee.php',
        data: {
            employee_id: $('#employeeID').val(),
            first_name: $('#firstName').val(),
            last_name: $('#lastName').val(),
            email: $('#emailAddress').val(),
            job_title: $('#jobTitle').val(),
            department: $('#department').val()
        },
        success: function(result){
            $('#employeeAlert').text(result.data.message).removeClass('d-none');
            getAll();
            
        },
        error: function(error){
            console.error(error);
        }

    });
  
})

// The "shown" event triggers after the modal appears
// and can be used to run commands that won't work on hidden elements

$('#employeeDetails').on('shown.bs.modal', function () {
  
  $('#firstName').focus();
  
});



$('#employeeDetails').on('hidden.bs.modal', function () {
  
  $('#employeeForm')[0].reset();
  
});


//////////// ADD EMPLOYEE modal ////////////////

$('#addEmployee').on('click', function() {
    $('#employeeID').val('');
    $('#employeeDetailsAction').html('Add Employee Details');
    $('#submitEmployeeDetails').html('Add new employee');
    $('#employeeAlert').addClass('d-none');
   
});




//////////////////////// DELETE employee modal //////////////////////
$(document).on('click', '.deleteEmployeeInfo', function(){
    const employeeRecord = JSON.parse($(this).closest('tr').attr('data-employee-record'));
    $('#confirmToDeleteEmployee').attr('data-employee-id', employeeRecord.id);
    $('#areYouSureEmployeeName').text(employeeRecord.lastName + ', ' + employeeRecord.firstName);

})

$('#confirmToDeleteEmployee').on('click', function() { 
  const employeeId = $(this).attr('data-employee-id');

    $.ajax({
        method: 'POST',
        url: 'libs/php/deleteEmployeeByID.php',
        data: {
            id: employeeId
        },
        success: function(result){

            $('#deleteEmployeeMessage').text(result.data.message).removeClass('d-none');
        },
        error: function(error){
            console.error(error);
        }
    })

   })




////------------------------------------------------- DEPARTMENTS section----------------------------------------------------------////
getAllDepartments();

function getAllDepartments() {

    $.ajax({
        method: 'GET',
        url: 'libs/php/getAllDepartments.php',
        success: function(result) {
            const data = result.data;
            populateDepartmentsDropdown(data, '.selectDepartment'); 
            populateDepartmentsTab(data); 
            
        
            
        },
        error: function(error) {
            console.error(error);
        }
    
    });
}

function populateDepartmentsDropdown(data, selector) {
    
    data.forEach(function (val, i, arr) {
        $(selector).append($('<option>', {
        value: val.id,
        text: val.name
        }));
    });

}
     
function populateDepartmentsTab(data) {
    data.forEach(function(val, i, arr) {
        $('#departmentsList').append(`
        <tr data-department-id=${val.id} data-location-record='${JSON.stringify(val)}'>
            <td>${val.name}</td>
            <td><button class="btn btn-sm btn-warning text-white editDepartment" data-bs-toggle="modal" data-bs-target="#departmentDetails"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg></button></td>

            <td><button class="btn btn-sm btn-success deleteDepartmentInfo" data-bs-toggle="modal" data-bs-target="#checkDeleteDepartment"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
        </tr>       
    `);
    })
    
}
 



//////////////////////// EDIT DEPARTMENT modal //////////////////////

$(document).on('click', '.editDepartment', function() {
    $('#departmentDetailsAction').html('Edit Department Details');
    $('#submitDepartment').html('Update');
    $('#departmentAlert').addClass('d-none');

    const department = JSON.parse($(this).closest('tr').attr('data-location-record'));
    if(department){
    $('#departmentIDInput').val(department.id);
    $('#newDepartmentInput').val(department.name);
    // Set department's location:
    $('#locationSelect > option').each(function(i, elem) {
        if ($(elem).val() === department.locationID) {
            $(elem).attr('selected', true);
        }
    });
   }
})

//////////////////////// ADD DEPARTMENT modal ////////////////////////

$('#addDepartment').on('click', function() {
    $('#departmentIDInput').val('');
    $('#newDepartmentInput').val('');
    $('#locationSelect').val('');
    $('#departmentDetailsAction').html('Department Details');
    $('#submitDepartment').html('Add new department');
    $('#departmentAlert').addClass('d-none');
});



$('#newDepartmentForm').on('submit', function(e) {
    e.preventDefault();

    $.ajax({
        method:'POST',
        url:'libs/php/insertDepartment.php',
        data: {
            department_id: $('#departmentIDInput').val(),
            locationID: $('#locationSelect').val(),
            name: $('#newDepartmentInput').val()
        },
        success: function(result){
            $('#departmentAlert').text(result.data.message).removeClass('d-none');
            getAllDepartments();
            
        },
        error: function(error){
            console.error(error);
        }

    });
})

//////////////////////// DELETE DEPARTMENT modal //////////////////////


$(document).on('click','.deleteDepartmentInfo', function() {
    const departmentId = $(this).closest('tr').attr('data-department-id');
   
    $.ajax({
      url: "libs/php/checkDepartmentUse.php",
      method: 'POST',
      dataType: 'json',
      data: {
        id: departmentId
      },
      success: function (result) {
                   
        if (result.status.code == 200) {
            const data = result.data[0];
  
          if (data.departmentCount > 0) {
            $('#confirmToDeleteDepartment')
                .addClass('d-none')
                .attr('data-department-id', '');
            $('#deleteDepartmentTitle').text('You cannot remove department');
            $('#deleteDepartmentBodyMesage').html(`You cannot remove the entry for ${data.departmentName} because it has <strong>${data.departmentCount}</strong> employees assigned to it`);
            $('#dismissDeleteDepartment').text('OK');    
    
          } else {
            $('#deleteDepartmentTitle').text('Remove department?');
            $('#deleteDepartmentBodyMesage').html(`Are you sure that you want to remove the entry for <strong>${data.departmentName}</strong>?`);
            $('#confirmToDeleteDepartment')
                .removeClass('d-none')
                .attr('data-department-id', departmentId);

            $('#dismissDeleteDepartment').text('NO'); 
            $('#deleteDepartmentMessage').addClass('d-none');

            
          }
          
        } else {
  
          $('#checkDeleteDepartment .modal-title').replaceWith("Error retrieving data");
  
        } 
  
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#checkDeleteDepartment .modal-title').replaceWith("Error retrieving data");
      }
    });
                             
  });
  
//   When user chooses YES to delete department 

  $('#confirmToDeleteDepartment').on('click', function() {
    const departmentId = $(this).attr('data-department-id');
    $.ajax({
        method: 'POST',
        url: 'libs/php/deleteDepartmentByID.php',
        data: {
            department_id: departmentId
        },
        success: function(result){
            $('#deleteDepartmentMessage').text(result.data.message).removeClass('d-none');
        },
        error: function(error){
            console.error(error);
        }
    })

   })





// ----------------------------------------------------------LOCATIONS section-------------------------------------------------------------//

getAllLocations();

function getAllLocations(){
    $.ajax({
        method: 'GET',
        url: 'libs/php/getAllLocations.php',
        success: function(result) {
            const data = result.data;
            populateLocationsTab(data); 
            populateLocationsDropdown(data);
        
            
        },
        error: function(error) {
            console.error(error);
        }
    
    });
}

function populateLocationsTab(data) {
    data.forEach(function(val, i, arr) {
        $('#locationsList').append(`
        <tr data-id=
        '${val.id}' data-city='${JSON.stringify(val)}'>
            <td>${val.name}</td>
            <td><button class="btn btn-sm btn-warning text-white editLocation" data-bs-toggle="modal" data-bs-target="#locationDetails"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg></button></td>
            <td><button class="btn btn-sm btn-success deleteLocationInfo" data-bs-toggle="modal" data-bs-target="#checkDeleteLocation"><i class="fa fa-trash" aria-hidden="true"></i>
          </button></td>
        </tr> 
    `);

 })
    
}

function populateLocationsDropdown(data) {

    data.forEach(function (val, i, arr) {
        $('.selectLocation').append($('<option>', {
        value: val.id,
        text: val.name
        }));
    });

}

//////////////////////// EDIT LOCATION modal //////////////////////

$(document).on('click', '.editLocation', function(){
    $('#locationDetailsAction').html('Edit Location Details');
    $('#submitLocation').html('Update');
    $('#locationAlert').addClass('d-none');

const city = JSON.parse($(this).closest('tr').attr('data-city'));
    if (city){
        $('#locationInput').val(city.name);
        $('#locationIDInput').val(city.id);
    }
})

//////////////////////// ADD LOCATION modal //////////////////////

$('#locationDetails').on('click', function(){
    $('#locationInput').val('');
    $('#locationDetailsAction').html('Location Details');
    $('#submitLocation').html('Add new location');
    $('#locationAlert').addClass('d-none');
})

$('#submitLocation').on('click', function() {
    $.ajax({
        method:'POST',
        url:'libs/php/insertLocation.php',
        data: {
            location_id: $('#locationIDInput').val(),
            name: $('#locationInput').val()
        },
        success: function(result){
            $('#locationAlert').text(result.data.message).removeClass('d-none');
            getAllLocations();
            
        },
        error: function(error){
            console.error(error);
        }

    });
})
//////////////////////// DELETE LOCATION modal //////////////////////

$(document).on('click','.deleteLocationInfo', function() {
    const locationId = $(this).closest('tr').attr('data-id');
   
    $.ajax({
      url: "libs/php/checkLocationUse.php",
      method: 'POST',
      dataType: 'json',
      data: {
        id: locationId
      },
      success: function (result) {
                   
        if (result.status.code == 200) {
            const data = result.data[0];
  
          if (data.locationCount > 0) {
            $('#confirmToDeleteLocation')
                .addClass('d-none')
                .attr('data-location-id', '');
            $('#deleteLocationTitle').text('You cannot remove this location..');
            $('#deleteLocationBodyMesage').html(`You cannot remove the entry for ${data.locationName} because it has <strong>${data.locationCount}</strong> departments assigned to it`);
            $('#dismissDeleteLocation').text('OK');    
    
          } else {
            $('#deleteLocationTitle').text('Remove location?');
            $('#deleteLocationBodyMesage').html(`Are you sure that you want to remove the entry for <strong>${data.locationName}</strong>?`);
            $('#confirmToDeleteLocation')
                .removeClass('d-none')
                .attr('data-location-id', locationId);

            $('#dismissDeleteLocation').text('NO'); 
            $('#deleteLocationMessage').addClass('d-none');

            
          }
          
        } else {
  
          $('#checkDeleteLocation .modal-title').replaceWith("Error retrieving data");
  
        } 
  
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#checkDeleteLocation .modal-title').replaceWith("Error retrieving data");
      }
    });
                             
  });
  
//   When user chooses YES to delete department 

  $('#confirmToDeleteLocation').on('click', function() {
    const locationId = $(this).attr('data-location-id');
    $.ajax({
        method: 'POST',
        url: 'libs/php/deleteLocationByID.php',
        data: {
            location_id: locationId
        },
        success: function(result){
            $('#deleteLocationMessage').text(result.data.message).removeClass('d-none');
        },
        error: function(error){
            console.error(error);
        }
    })

   })







  
















