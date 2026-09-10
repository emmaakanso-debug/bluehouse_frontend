const input = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const count = document.getElementById("count");
const clearBtn = document.getElementById("clearBtn");
const empty = document.getElementById("empty");

function addItem() {
    if (input.value.trim() === "") {
        alert("Please enter an item");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <input type="checkbox">
        <span>${input.value}</span>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
    `;

    list.appendChild(li);
    input.value = "";
    updateList();
}

addBtn.addEventListener("click", addItem);

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addItem();
    }
});

list.addEventListener("click", function(event) {
    const li = event.target.parentElement;

    if (event.target.classList.contains("delete")) {
        li.remove();
    }

    if (event.target.classList.contains("edit")) {
        const text = li.querySelector("span");
        const newName = prompt("Edit item:", text.textContent);

        if (newName && newName.trim() !== "") {
            text.textContent = newName;
        }
    }

    updateList();
});

list.addEventListener("change", function(event) {
    if (event.target.type === "checkbox") {
        event.target.nextElementSibling.classList.toggle("done");
    }
});

clearBtn.addEventListener("click", function() {
    list.innerHTML = "";
    updateList();
});

function updateList() {
    count.textContent = list.children.length;

    empty.style.display =
        list.children.length === 0 ? "block" : "none";
}
