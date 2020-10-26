// init page 
$(document).ready(function() {

    // Materialize init 
    // ******************************
    // init Modals
    $('.modal').modal();

    // init timepicker
    $('.timepicker').timepicker();

    // For adding seconds (00)
    $('.timepicker').on('change', function() {
        let receivedVal = $(this).val();
        $(this).val(receivedVal + ":00");
    });

    // init datepicker
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd'
    });
    $('select').formSelect();
    // ******************************

    // Sign up script 
    $('#sign-up').click(event => {
        event.preventDefault();
        const newSignUp = {
            username: $('#user-name').val().trim(),
            password: $('#user-password').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone-number').val().trim()
        };

        $.ajax("/signup", {
            type: "POST",
            data: newSignUp,
        }).then(newSignUpData => {});

    });

    // login script 
    $('#login').click(event => {
        event.preventDefault();
        const loginUser = {
            username: $('#username').val().trim(),
            password: $('#password').val().trim(),
        };
        $.ajax("/login", {
            type: "POST",
            data: loginUser,
        }).then(loginUserData => { location.replace("/dashboard") });
    });

    // Update User
    $('#update-user').click(event => {
        event.preventDefault();
        let id = $('#update-user').attr("data-id")

        const updatedUser = {
            username: $('#user-name1').val().trim(),
            password: $('#user-password1').val().trim(),
            email: $('#email1').val().trim(),
            phone: $('#phone-number1').val().trim()
        };

        $.ajax("/users/" + id, {
            type: "PUT",
            data: updatedUser,
        }).then(updatedUseData => {});
    });

    // delete user script 
    $('#delete-user').click(event => {
        event.preventDefault();
        alert("Are you Sure?");
        let id = $('#delete-user').attr("data-id");

        $.ajax("/users/" + id, {
            type: "DELETE",
        }).then((deletedUserData) => { location.replace("/logout") });
    });

    // add task script
    $('#add-task').click(event => {
        event.preventDefault();
        // Convert checkboxes to true/false
        let is_reoccurring = ( $('#reoccurring').val() === "on");
        let is_autoSchedule = ( $('#auto-schedule').val() === "on");

        const newTask = {
            title: $('#task-title').val().trim(),
            description: $('#details').val().trim(),
            endDate: $('#duedatepicker').val(),
            endTime: $('#timeduepicker').val(),
            startDate: $('#datepicker').val(),
            startTime: $('#timepicker').val(),
            timeToComplete: $('#length').val(),
            is_autoSchedule: is_autoSchedule,
            is_reoccurring: is_reoccurring,
            UserId: $("#add-task").attr("data-id")
        }

        console.log(newTask)

        $.ajax("/api/tasks", {
            type: "POST",
            data: newTask
        }).then(newTaskData => { location.reload(); });
    });

    $(".update-task").click(function(event) {
        event.preventDefault();
        let taskId = $(this).attr("data-id");

        // Convert checkboxes to true/false
        let is_reoccurring = ( $('#reoccurring').val() === "on" );
        let is_autoSchedule = ( $('#auto-schedule').val() === "on" );

        const updatedTaskObj = {
            title: $(`#title${taskId}`).val().trim(),
            description: $(`#details${taskId}`).val().trim(),
            endDate: $(`#duedatepicker${taskId}`).val(),
            endTime: $(`#timeduepicker${taskId}`).val(),
            startDate: $(`#datepicker${taskId}`).val(),
            startTime: $(`#timepicker${taskId}`).val(),
            timeToComplete: $(`#length${taskId}`).val(),
            is_autoSchedule: is_autoSchedule,
            is_reoccurring: is_reoccurring,

        }

        console.log(updatedTaskObj)

        $.ajax("/api/tasks/" + taskId, {
            type: "PUT",
            data: updatedTaskObj
        }).then(() => {
            location.reload();
        })
    })

    // delete task script
    $(".delete-task").click(function(event) {
        event.preventDefault()
            // Get the ID from the button.
        let taskId = $(this).attr("data-id");

        // Send the DELETE request.
        $.ajax("/api/tasks/" + taskId, {
            type: "DELETE"
        }).then(
            function() {
                // Reload the page to get the updated list
                location.reload();
            }
        );
    });

    // Set up calendar on weekly schedule
    const weekcolumns = ["timecol","sun","mon","tues","wed","thur","fri","sat"];

    const schedule = [];
    weekcolumns.forEach(dayName => {
        let day = [];
        for (let time = 0; time < 24; time++) {
            if (time < 8) {
                day.push("sleep");
            } else if (time === 9) {
                day.push("~");
            } else if (time < 12) {
                day.push("work");
            } else if (time === 12 || time === 18) {
                day.push("meal");
            } else if (time < 18) {
                day.push("work");
            } else if (time < 22) {
                day.push("personal");
            } else {
                day.push("sleep");
            }
        }
        schedule.push(day);
    });

    // for each day of the week,
    weekcolumns.forEach(col => {

        // make a column
        const thisCol = $("<div>")
            .addClass(`${col} col center-align`);

        // add it to the calendar block
        $(".week-cal").append(thisCol);

        // If it's the time column,
        if (col === "timecol") {

            // We do a modified version of the cell creation process below

            // Add header cell
            const headerCell = $("<div>");
            headerCell.text("time");
            thisCol.append(headerCell);
            thisCol.append($("<br>"));

            // Add 24 cells
            for (let i = 0; i < 24; i++) {
                
                // Make cell
                const newCell = $("<div>");

                // Create hour
                let label;

                if (i === 0 ){
                    label = 12;
                } else if (i > 12) {
                    label = i - 12;
                } else {
                    label = i;
                }

                // THIS CODE SUPPORTS HALF-HOUR TIME BLOCKS
                // We're not using that right now but I'm leaving it in for future development

                // if (i === 0 || i === 24 ) {
                //     label = '12';
                // } else if (i === 1 || 1 === 25) {
                //     label = '12.5';
                // } else if (i > 25 ) {
                //     label = `${(i - 24)/2}`;
                // } else {
                //     label = `${i/2}`;
                // }

                // // translate number to time
                // // first check if there's a decimal
                // if (label[label.length-2] === ".") {
                //     // These are our half-hour times
                //     label = label.replace(".5", ":30");;
                // } else {
                //     // the rest just get some zeroes
                //     label+=":00";
                // }

                // Add am/pm designation
                if (i < 12) {
                    label += " am";
                } else {
                    label += " pm";
                }

                // Set text
                newCell.text(label);

                // append to column
                thisCol.append(newCell);
            }

        } else {

            // Add header cell
            const headerCell = $("<div>");
            headerCell.text(col);
            thisCol.append(headerCell);
            thisCol.append($("<br>"));
            
            // Add 24 cells
            for (let i = 0; i < 24; i++) {
                
                // Make cell
                const newCell = $("<div>");
                
                // Give it a unique identifier
                newCell.data("ref", `${col}${i}`);
                
                // Set text equal to schedule of that day
                newCell.text(schedule[weekcolumns.indexOf(col)][i]);
                // newCell.text("~");

                // Identify it as a cell for styling
                newCell.addClass("week-cell");
                
                // Append to col
                thisCol.append(newCell);
            }
        }
    })

    // Add list of categories
    const timeCategories = ["sleep", "work", "meal", "personal", "chores"];
    
    // For each category of time...
    timeCategories.forEach(thisCat => {

        // make a new div
        const newCat = $("<div>");
        newCat.addClass(`sched-cat sched-cat-unsel`);
        newCat.data("category", thisCat);
        newCat.text(thisCat);

        // Append to list
        $(".category-list").append(newCat);

    });

    // Script to set time as active
    $(".category-list").click(event => {

        const selected = event.target;

        // first remove selected class from everything
        if (selected.className.includes("sched-cat")) {

            // get everything on the list
            const divList = $(".category-list").children();

            // Set to unselected
            for (let divEl = 0; divEl < divList.length; divEl++) {
                divList[divEl].classList.remove("sched-cat-sel");
                divList[divEl].classList.add("sched-cat-unsel");
            }

            // Remove unsel from selected div and add sel
            selected.classList.remove("sched-cat-unsel");
            selected.classList.add("sched-cat-sel");
        }
    })

    // Once calendar is populated, add calendar behavior
    $(".week-cal").click(event => {
        event.preventDefault();
        
        // Get selected element
        const timeEl = event.target

        // Once they click on a week cell
        if (timeEl.class === "week-cell") {
            console.log("this is a week!");
        }
    })

});