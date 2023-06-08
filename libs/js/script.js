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
            console.log(result);
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
    console.log(data);
    const $employeesList =  $('#employeesList');
    $employeesList.empty();

        // const name = ${val.firstName}
        // const surname = ${val.lastName}
        // const fullName = name.concat(',' surname);

    data.forEach(function(val, i, arr) {
        $employeesList.append(`
        
        <tr data-employee-record='${JSON.stringify(val)}'>
            <td>${val.firstName}</td>
            <td>${val.lastName}</td>
            <td>${val.department}</td>
            <td>${val.location}</td>

            <td><button class="btn btn-sm btn-info viewEmployeeDetails" data-bs-toggle="modal" data-bs-target="#view">
            <i class="fa fa-eye" aria-hidden="true"></i></button></td>

            <td><button class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#employeeDetails" data-id=${val.id}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg></button></td>

            <td><button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteEmployee"> <i class="fa fa-trash" aria-hidden="true"></i></button></td>
        
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

    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
            
      var resultCode = result.status.code

      if (resultCode == 200) {

        // Update the hidden input with the employee id so that
        // it can be referenced when the form is submitted
        
        $('#employeeID').val(result.data.personnel[0].id);
        
        $('#firstName').val(result.data.personnel[0].firstName);
        $('#lastName').val(result.data.personnel[0].lastName);
        $('#jobTitle').val(result.data.personnel[0].jobTitle);
        $('#emailAddress').val(result.data.personnel[0].email);
        
        $('#department').html("");
                
        $.each(result.data.department, function () {
          
					$('#department').append($("<option>", {
						value: this.id,
						text: this.name
					})); 	
          
        })
        
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
  
  // stop the default browser behviour
  
  e.preventDefault();
  
  // AJAX call
  
  
})

// The "shown" event triggers after the modal appears
// and can be used to run commands that won't work on hidden elements

$('#employeeDetails').on('shown.bs.modal', function () {
  
  // You may optionally use the the following command to place 
  // the cursor in the first input as a courtesy to the user.
  // Commands like this that manipulate the state of a control
  // will only work once it is visible which is why it is in
  // the "shown" event handler
  
  $('#firstName').focus();
  
});

// The "hide" and "hidden" events trigger before and after
// the modal disappears and can be used to clear down the form.
// This is useful if the form needs to be empty the next time 
// that it is shown

// $('#employeeDetails').on('hidden.bs.modal', function () {
  
//   $('#employeeForm')[0].reset();
  
// });


//////////// ADD EMPLOYEE modal ////////////////

$('#addEmployee').on('click', function() {
    $('#employeeIDInput').val('');
    $('#firstNameInput').val('');
    $('#lastNameInput').val('');
    $('#emailInput').val('');
    $('#jobTitleInput').val('');
    $('#departmentSelect').val('');
    $('#employeeDetailsAction').html('Add Employee Details');
    $('#submitEmployeeDetails').html('Add new employee');
    $('#employeeAlert').addClass('d-none');
});


$('#submitEmployeeDetails').on('click', function (){
    $.ajax({
        method:'POST',
        url:'libs/php/insertEmployee.php',
        data: {
            employee_id: $('#employeeIDInput').val(),
            first_name: $('#firstNameInput').val(),
            last_name: $('#lastNameInput').val(),
            email: $('#emailInput').val(),
            job_title: $('#jobTitleInput').val(),
            department: $('#departmentSelect').val()
        },
        success: function(result){
            console.log('insert', result);
            $('#employeeAlert').text(result.data.message).removeClass('d-none');
            getAll();
            
        },
        error: function(error){
            console.error(error);
        }

    });

});

//////////// DELETE EMPLOYEE modal ////////////////




////------------------------------------------------- DEPARTMENTS section----------------------------------------------------------////
getAllDepartments();

function getAllDepartments() {

    $.ajax({
        method: 'GET',
        url: 'libs/php/getAllDepartments.php',
        success: function(result) {
            const data = result.data;
            populateDepartmentsDropdown(data); 
            populateDepartmentsTab(data); 
            
        
            
        },
        error: function(error) {
            console.error(error);
        }
    
    });
}

function populateDepartmentsDropdown(data) {
    
    data.forEach(function (val, i, arr) {
        $('.selectDepartment').append($('<option>', {
        value: val.id,
        text: val.name
        }));
    });

}
     
function populateDepartmentsTab(data) {
    console.log(data);
    data.forEach(function(val, i, arr) {
        $('#departmentsList').append(`
        <tr data-location-record='${JSON.stringify(val)}'>
            <td>${val.name}</td>
            <td><button class="btn btn-sm btn-warning editDepartment" data-bs-toggle="modal" data-bs-target="#departmentDetails"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg></button></td>

            <td><button class="btn btn-sm btn-danger deleteInfo"" data-bs-toggle="modal" data-bs-target="#deleteDepartment" data-id=${val.id}><i class="fa fa-trash" aria-hidden="true"></i></button></td>
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


$('#submitDepartment').on('click', function() {
    $.ajax({
        method:'POST',
        url:'libs/php/insertDepartment.php',
        data: {
            department_id: $('#departmentIDInput').val(),
            locationID: $('#locationSelect').val(),
            name: $('#newDepartmentInput').val()
        },
        success: function(result){
            console.log('insert', result);
            $('#departmentAlert').text(result.data.message).removeClass('d-none');
            getAllDepartments();
            
        },
        error: function(error){
            console.error(error);
        }

    });
})

//////////////////////// DELETE DEPARTMENT modal //////////////////////

// $('#confirmToDelete').on('click', function() {
//     $.ajax({
//         method: 'POST',
//         url: 'libs/php/deleteDepartmentByID.php',
//         data: {
//             department_id:$('#departmentIDInput').val()
//         },
//         success: function(result){
//             console.log('delete', result);
//         },
//         error: function(error){
//             console.error(error);
//         }
//     })

// })


$("#deleteDepartment").click(function() {
   
    $.ajax({
      url: "libs/php/checkDepartmentUse.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $(this).attr("data-id") // Retrieves the data-id attribute from the calling button
      },
      success: function (result) {
        console.log(result);
                   
        if (result.status.code == 200) {
  
          if (result.data[0].departmentCount == 0) {
            
            $("#departmentName").text(result.data[0].departmentName);
  
            $('#deleteDepartment').modal("show");
            
          } else {
                              
            $("#cantDeleteDeptName").text(result.data[0].departmentName);
            $("#pc").text(result.data[0].departmentCount);
            
            $('#cantDeleteDepartmentModal').modal("show");          
            
          }
          
        } else {
  
          $('#exampleModal .modal-title').replaceWith("Error retrieving data");
  
        } 
  
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#exampleModal .modal-title').replaceWith("Error retrieving data");
      }
    });
                             
  });
  






// ----------------------------------------------------------LOCATIONS section-------------------------------------------------------------//

getAllLocations();

function getAllLocations(){
    $.ajax({
        method: 'GET',
        url: 'libs/php/getAllLocations.php',
        success: function(result) {
            const data = result.data;
            console.log(data);
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
        <tr data-city='${JSON.stringify(val)}'>
            <td>${val.name}</td>
            <td><button class="btn btn-sm btn-warning editLocation" data-bs-toggle="modal" data-bs-target="#locationDetails"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg></button></td>
            <td><button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteInfo"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
          </svg></button></td>
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
            console.log('insert', result);
            $('#locationAlert').text(result.data.message).removeClass('d-none');
            getAllLocations();
            
        },
        error: function(error){
            console.error(error);
        }

    });
})
//////////////////////// DELETE LOCATION modal //////////////////////




// ---------------------------------------------------------FORM VALIDATION section----------------------------------------------------------//

  













