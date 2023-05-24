'use strict';

$('#search').on('keyup', function (){
    const searchValue = $(this).val();

    $.ajax({
        method: 'POST',
        url: 'libs/php/search.php',
        data: {
            department: $('#selectDepartment').val(),
            location: $('#selectLocation').val(),
            search_value: searchValue
        },
        success: function(result){

        },
        error: function(error) {
            console.error(error);
        }
    })
})



$.ajax({
    method: 'GET',
    url: 'libs/php/getAll.php',
    success: function(result) {
        console.log(result);
        const data = result.data;
        populateEmployeesTab(data); 
   
        const employeesNumber = data.length;
        console.log(employeesNumber);
    },
    error: function(error) {
        console.error(error);
    }
  
});

function populateEmployeesTab(data) {
    data.forEach(function(val, i, arr) {
        $('#employeesList').append(`
        <tr data-employee-record='${JSON.stringify(val)}'>
            <td>${++i}</td>
            <td>${val.firstName}</td>
            <td>${val.lastName}</td>
            <td><button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#employeeDetails">Details</button></td>
            <td><button class="btn btn-sm btn-warning editEmployee" data-bs-toggle="modal" data-bs-target="#editEmployee">edit</button></td>
            <td><button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteEmployee">delete</button></td>
        
        </tr>
         
        
    `);
    });
   
}


$.ajax({
    method: 'GET',
    url: 'libs/php/getAllDepartments.php',
    success: function(result) {
        console.log(result);
        const data = result.data;
        populateDepartmentsDropdown(data); 
        populateDepartmentsTab(data); 
      
          
    },
    error: function(error) {
        console.error(error);
    }
  
});

function populateDepartmentsDropdown(data) {

    data.forEach(function (val, i, arr) {
        $('#selectDepartment').append($('<option>', {
        value: val.id,
        text: val.name
        }));
    });

}
     
function populateDepartmentsTab(data) {
    data.forEach(function(val, i, arr) {
        $('#departmentsList').append(`
        <tr>
            <td>${val.name}</td>
            <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editEmployee">edit</button></td>
            <td><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteEmployee">delete</button></td>
        </tr>       
    `);
    })
    
}
    
    


$.ajax({
    method: 'GET',
    url: 'libs/php/getAllLocations.php',
    success: function(result) {
        console.log(result);
        const data = result.data;
        populateLocationsTab(data); 
        populateLocationsDropdown(data);
     
          
    },
    error: function(error) {
        console.error(error);
    }
  
});

function populateLocationsTab(data) {
    data.forEach(function(val, i, arr) {
        $('#locationsList').append(`
        <tr>
            <td>${val.name}</td>
            <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editEmployee">edit</button></td>
            <td><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteEmployee">delete</button></td>
        </tr> 
    `);

 })
    
}

function populateLocationsDropdown(data) {

    data.forEach(function (val, i, arr) {
        $('#selectLocation').append($('<option>', {
        value: val.id,
        text: val.name
        }));
    });

}


// Form validation

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

$(document).ready(function($) {
    $('.editEmployee').on('click', function() {
        const employeeDetails = JSON.parse($(this).closest('tr').attr('data-employee-record'));
    console.log(employeeDetails);
    if(employeeDetails){
        // $('#editEmployee').empty();

     $('#firstNameInput').val(employeeDetails.firstName);
     $('#lastNameInput').val(employeeDetails.lastName);
     $('#emailInput').val(employeeDetails.email);
     $('#departmentInput').val(employeeDetails.department);
     $('#locationInput').val(employeeDetails.location);
    }
});
})



