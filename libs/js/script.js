'use strict';

$.ajax({
    method: 'GET',
    url: 'libs/php/getAll.php',
    success: function(result) {
        console.log(result);
        const data = result.data;
        data.forEach(element => {
           populateEmployees(element); 
        });
    },
    error: function(error) {
        console.error(error);
    }
  
});

function populateEmployees(element) {
    $('#employeesList').append(`
        <tr>
            <td>${element.firstName}</td>
            <td>${element.lastName}</td>
            <td>${element.email}</td>
            <td>${element.department}</td>
            <td>${element.location}</td>
            <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editEmployee">edit</button></td>
            <td><button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteEmployee">delete</button></td>
        </tr>
         
        
    `);
}

$.ajax({
    method: 'GET',
    url: 'libs/php/getAllDepartments.php',
    success: function(result) {
        console.log(result);
        const data = result.data;
        data.forEach(element => {
           populateDepartments(element); 
        });
    },
    error: function(error) {
        console.error(error);
    }
  
});

function populateDepartments(element) {
    $('#departmentsList').append(`
        <tr>
            <th scope="row">${element.id}</th>
            <td>${element.name}</td>
            <td>${element.locationID}</td>
            <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#editEmployee">edit</button></td>
        </tr>
         
        
    `);
}
