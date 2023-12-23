let addBtn = document.querySelector(".add-btn");
let modal = document.querySelector(".modal-cont");
let textArea = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let addModal = true;
let taskColor = "red";

addBtn.addEventListener("click", function () {
  console.log("Btn has been clicked");
  if (addModal) {
    modal.style.display = "flex"; 
  } else {
    modal.style.display = "none";
  }
  addModal = !addModal;
});

textArea.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key === "Enter") {
    if (textArea.value == "") {
      textArea.value = "";
      alert("Please Enter some task!");
      return;
    }
    generateTicket(textArea.value);
    textArea.value = "";
    modal.style.display = "none";
    addModal = true;
  }
});

for (let i = 0; i < allPriorityColor.length; i++) {
  allPriorityColor[i].addEventListener("click", function () {
    for (let j = 0; j < allPriorityColor.length; j++) {
      allPriorityColor[j].classList.remove("active");
    }
    allPriorityColor[i].classList.add("active");
    taskColor = allPriorityColor[i].classList[1];
    console.log(taskColor);
  });
}

function generateTicket(task) {
  let ticketCont = document.createElement("div");
  ticketCont.className = "ticket-cont";
  ticketCont.innerHTML = `<div class="ticket-color ${taskColor}"></div>
                            <div class="ticket-id">#eidut3</div>
                            <div class="ticket-area">${task}</div>`;
  console.log(ticketCont);
  mainCont.appendChild(ticketCont);
}
