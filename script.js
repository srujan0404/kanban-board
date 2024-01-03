let addBtn = document.querySelector(".add-btn"); 
let modalCont = document.querySelector(".modal-cont"); 
let isModalHidden = true;

let deleteBtn = document.querySelector(".remove-btn"); // select the remove button
let isDeleteBtnActive = false; // maintaining state for delete btn

let textArea = document.querySelector(".textarea-cont"); // select the text area
let mainCont = document.querySelector(".main-cont");
let color = ["red", "blue", "green", "pink"];

let ticketArr = [];

if (localStorage.getItem("TaskArr")) {
  let ticketArrStr = localStorage.getItem("TaskArr");
  ticketArr = JSON.parse(ticketArrStr);
  for (let i = 0; i < ticketArr.length; i++) {
    let ticket = ticketArr[i];
    createTicket(ticket.value, ticket.color, ticket.id);
  }
}

let filterColor = document.querySelectorAll(".color");
for (let i = 0; i < filterColor.length; i++) {
  filterColor[i].addEventListener("click", function () {
    let allTicketsColor = document.querySelectorAll(".ticket-color");
    let filterSelectdColor = filterColor[i].classList[1];
    for (let j = 0; j < allTicketsColor.length; j++) {
      let currentTicketColor = allTicketsColor[j].classList[1];
      if (filterSelectdColor == currentTicketColor) {
        allTicketsColor[j].parentElement.style.display = "block"; 
      } else {
        allTicketsColor[j].parentElement.style.display = "none"; 
      }
    }
  });

  filterColor[i].addEventListener("dblclick", function () {
    let allTicketsColor = document.querySelectorAll(".ticket-color");
    for (let j = 0; j < allTicketsColor.length; j++) {
      allTicketsColor[j].parentElement.style.display = "block"; 
    }
  });
}

let allPriorityColor = document.querySelectorAll(".priority-color");
let priorityColor = "red";
for (let i = 0; i < allPriorityColor.length; i++) {
  allPriorityColor[i].addEventListener("click", function () {

    for (let j = 0; j < allPriorityColor.length; j++) {
      allPriorityColor[j].classList.remove("active");
    }

    allPriorityColor[i].classList.add("active");
    priorityColor = allPriorityColor[i].classList[1];
  });
}

var uid = new ShortUniqueId();

addBtn.addEventListener("click", function () {
  if (isModalHidden) {
    modalCont.style.display = "flex"; // show the modal
    // document.body.style.filter = "blur(5px)";
    isModalHidden = false;
  } else {
    modalCont.style.display = "none"; // hide the modal
    isModalHidden = true;
  }
});

deleteBtn.addEventListener("click", function () {
  if (isDeleteBtnActive) {
    deleteBtn.style.color = "black";
    isDeleteBtnActive = false; // update it for next click.
  } else {
    deleteBtn.style.color = "red";
    isDeleteBtnActive = true; // and update it for next click
  }
});

textArea.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key == "Enter") {
    createTicket(textArea.value, priorityColor);
    modalCont.style.display = "none";
    isModalHidden = true;
    textArea.value = "";
  }
});

function createTicket(task, priorityColor, ticketId) {
  let id;
  if (ticketId) {
    id = ticketId;
  } else {
    id = uid.rnd();
  }

  let ticketCont = document.createElement("div"); //<div></div>
  ticketCont.className = "ticket-cont"; // <div class="ticket-cont"></div>
  ticketCont.innerHTML = `<div class="ticket-color ${priorityColor}"></div> 
                            <div class="ticket-id">#${id}</div>
                            <div class="ticket-area">${task}</div>
                            <div class='lock-unlock-btn'>
                                <i class="fa-solid fa-lock"></i>
                            </div>`;
  // console.log(ticketCont);
  if (!ticketId) {
    // only make changes in the array when ticketId is not passed. or
    // we can say it is created with UI and not from the localStorage.
    ticketArr.push({ id: id, color: priorityColor, value: task });
    // console.log(ticketArr);
    updateLocalStorage();
  }
  mainCont.appendChild(ticketCont);

  //handle delete ticket
  ticketCont.addEventListener("click", function () {
    if (isDeleteBtnActive) {
      ticketCont.remove();
      let ticketIndex = ticketArr.findIndex(function (ticketObj) {
        return ticketObj.id == id;
      });
      ticketArr.splice(ticketIndex, 1);
      updateLocalStorage();
      console.log(ticketArr);
    }
  });

  //handle lock unlock ticket
  let lockUnlockBtn = ticketCont.querySelector(".lock-unlock-btn i");
  let ticketArea = ticketCont.querySelector(".ticket-area");
  // console.log(lockUnlockBtn)
  lockUnlockBtn.addEventListener("click", function () {
    if (lockUnlockBtn.classList.contains("fa-lock")) {
      lockUnlockBtn.classList.remove("fa-lock");
      lockUnlockBtn.classList.add("fa-lock-open");
      ticketArea.setAttribute("contenteditable", "true");
    } else {
      lockUnlockBtn.classList.remove("fa-lock-open");
      lockUnlockBtn.classList.add("fa-lock");
      ticketArea.setAttribute("contenteditable", "false");
    }
    let ticketIndex = ticketArr.findIndex(function (ticketObj) {
      return ticketObj.id == id;
    });
    ticketArr[ticketIndex].value = ticketArea.innerText;
    updateLocalStorage();
    // console.log(ticketArr);
  });

  //handle Priority change or cyclic change of priority
  let ticketColor = ticketCont.querySelector(".ticket-color");
  ticketColor.addEventListener("click", function () {
    // console.log(ticketColor);
    // color = ['red','blue','green','pink'];
    let currentColor = ticketColor.classList[1];
    // currentColor = blue
    // console.log(currentColor);

    // let idx;
    // for(let i=0;i<color.length;i++){
    //     if(currentColor == color[i]){
    //         idx = i;
    //         break;
    //     }
    // }
    let idx = color.findIndex(function (col) {
      return col == currentColor;
    });
    let nextIdx = (idx + 1) % color.length;
    let nextColor = color[nextIdx];
    // console.log(nextColor);
    ticketColor.classList.remove(currentColor);
    ticketColor.classList.add(nextColor);

    let ticketIndex = ticketArr.findIndex(function (ticketObj) {
      return ticketObj.id == id;
    });
    ticketArr[ticketIndex].color = nextColor;
    updateLocalStorage();
  });
}

function updateLocalStorage() {
  let ticketArrStr = JSON.stringify(ticketArr);
  localStorage.setItem("TaskArr", ticketArrStr);
}

// // Add the following lines inside the 'addBtn' event listener
// addBtn.addEventListener("click", function () {
//   if (isModalHidden) {
//     modalCont.style.display = "flex"; // show the modal
//     isModalHidden = false;
    
//     // Add blur effect to the body
//     document.body.style.filter = "blur(5px)";
//   } else {
//     modalCont.style.display = "none"; // hide the modal
//     isModalHidden = true;
    
//     // Remove blur effect from the body
//     document.body.style.filter = "none";
//   }
// });

// // Add the following lines inside the 'modalCont' event listener
// modalCont.addEventListener("click", function (e) {
//   // Check if the click occurred outside the modal
//   if (!modalCont.contains(e.target)) {
//     modalCont.style.display = "none"; // hide the modal
//     isModalHidden = true;
    
//     // Remove blur effect from the body
//     document.body.style.filter = "none";
//   }
// });
