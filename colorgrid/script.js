const container = document.querySelector(".container");
const btn = document.querySelector("#btn");

const containerSize = 320;

btn.addEventListener("click", () => {
    let gridSize = Number(prompt("Enter the grid size(0-100): "));
    container.innerHTML = ""; //remove existing grid
    
    for(let i=0; i<gridSize*gridSize; i++) {
        const div = document.createElement("div");
        container.appendChild(div);
        div.classList.add("child-div");
        
        div.style.width = `${containerSize/gridSize}px`;
        div.style.height = `${containerSize/gridSize}px`;
        div.addEventListener("mouseenter", () => {
            div.style.backgroundColor = "blue";
        });
    }  
});
