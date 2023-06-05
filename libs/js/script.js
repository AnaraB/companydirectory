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

    data.forEach(function(val, i, arr) {
        $employeesList.append(`
        <tr data-employee-record='${JSON.stringify(val)}'>
            <td>${++i}</td>
            <td>${val.firstName}</td>
            <td>${val.lastName}</td>
            <td><button class="btn btn-sm btn-primary viewEmployeeDetails" data-bs-toggle="modal" data-bs-target="#view">Details</button></td>
            <td><button class="btn btn-sm btn-warning editEmployee" data-bs-toggle="modal" data-bs-target="#employeeDetails">Edit</button></td>
            <td><button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteInfo">Delete</button></td>
        
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
      $('#department').html(employee.department);
      $('#location').html(employee.location);
 
    }
})

//////////// EDIT EMPLOYEE DETAILS modal ////////////////

// Event binding on dynamically created elements:
$(document).on('click', '.editEmployee', function() {
    $('#employeeDetailsAction').html('Edit Employee Details');
    $('#submitEmployeeDetails').html('Update information');
    $('#employeeAlert').addClass('d-none');
    const employeeDetails = JSON.parse($(this).closest('tr').attr('data-employee-record'));
    if (employeeDetails) {
      $('#employeeIDInput').val(employeeDetails.id);
      $('#firstNameInput').val(employeeDetails.firstName);
      $('#lastNameInput').val(employeeDetails.lastName);
      $('#emailInput').val(employeeDetails.email);
      $('#jobTitleInput').val(employeeDetails.jobTitle);
      // Set employee's department:
      $('#departmentSelect > option').each(function(i, elem) {
          if ($(elem).text() === employeeDetails.department) {
              $(elem).attr('selected', true);
          }
      });
        // Set employee's location:
        $('#locationSelect > option').each(function(i, elem) {
        if ($(elem).text() === employeeDetails.location) {
            $(elem).attr('selected', true);
        }
    });
    }
});

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
            <td><button class="btn btn-warning editDepartment" data-bs-toggle="modal" data-bs-target="#departmentDetails">edit</button></td>
            <td><button class="btn btn-danger deleteDepartment" data-bs-toggle="modal" data-bs-target="#deleteInfo">delete</button></td>
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

$('#confirmToDelete').on('click', function() {
    $.ajax({
        method: 'POST',
        url: 'libs/php/deleteDepartmentByID.php',
        data: {
            department_id:$('#departmentIDInput').val()
        },
        success: function(result){
            console.log('delete', result);
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
        <tr data-city='${JSON.stringify(val)}'>
            <td>${val.name}</td>
            <td><button class="btn btn-warning editLocation" data-bs-toggle="modal" data-bs-target="#locationDetails">edit</button></td>
            <td><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteInfo">delete</button></td>
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

$('#addLocation').on('click', function(){
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

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  function runMe(){

    'use strict'
  const forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
}   
    







