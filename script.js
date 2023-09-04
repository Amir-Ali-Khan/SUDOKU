const gameBoard = document.querySelector("#gameboard")
const digits = document.querySelector("#digits")
const mistake = document.querySelector("#mistake")
let lastselected = null
let solution;
let error = 0;
let deletenum = document.querySelector("#delete")

// Fetching data from API

fetch("https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution}}}")
.then((res)=>(res.json()))
.then((data)=>(calling(data)))


// Creating gameboard tile with API Data

function calling(data){
    for( let i = 0 ; i < 9 ; i++){
        for(let j = 0 ; j < 9 ; j++){
            const div = document.createElement("div")
            var puzzle = data.newboard.grids[0].value
            solution = data.newboard.grids[0].solution
            div.addEventListener('click',selecttile)
            div.classList.add("tile")
            gameBoard.appendChild(div) 

            // create attributes to div with their index
            div.setAttribute("row", i)
            div.setAttribute("col", j)

            // checking if the data have 0 value to avoid to fill
            if(puzzle[i][j] != "0"){
                div.innerText = puzzle[i][j];
                div.classList.add("filled")
            }


            // creating bottom line after 3 tiles
            if(i==2 || i ==5){
                div.classList.add("border-bottom")
            }

            // creating right line after 3 tiles
            if(j==2 || j ==5){
                div.classList.add("border-right")
            }

               
        }
    }

}

// Creating digits from 1-9 below gameboard

for(let i = 0; i < 9 ; i++){

    const div = document.createElement("div")
    div.classList.add("tile")
    div.addEventListener('click',addnum)
    div.innerText = i+1
    digits.appendChild(div)

    
}


// select funtion to select tile which want t fill


function selecttile(){
    if(lastselected != null){
        lastselected.classList.remove("select-tile")
        
    }
        lastselected = this;
        lastselected.classList.add("select-tile");
    
}

// addnum takes gidits TEXT and add to the selected tile

function addnum(){
    if(lastselected.innerText == "" || lastselected.classList.contains("danger")){
        lastselected.innerText=this.innerText
    }

    //taking the index of the tile and storing to row and col
    let row = lastselected.getAttribute("row")
    let col = lastselected.getAttribute("col")

    // checking the number added to tile is matching with the solution numbers
    // at same position, and adding or removing danger class, if wrong call a function errordisplay()
    if(solution[row][col] == lastselected.innerText){
        
        lastselected.classList.remove("danger")

    }else{
        
        lastselected.classList.add("danger")
        errordisplay();

    } 

    // If the wrong attemps of the user is greater then 2 show him he lost
    // and reload the gameboard
    if(error>2){
        alert("YOU LOST")
        location.reload()
    }  


    // if the all the tiles are filled store the tile text to userans
    if(isAlltilesFilled()){
        const allTiles = gameBoard.querySelectorAll(".tile")
        let userans = [...allTiles].map((tile)=>{
            return tile.innerText
        })

        let num = 0;

        for(let i = 0 ; i < 9 ; i++){
            for(let j = 0 ; j < 9; j++){
                if(solution[i][j]!=userans[num]){
                    allTiles[num].classList.add("danger")
                }
                num++
            }
        }

        let dangerclass = [...allTiles].some((tile)=>{
            return tile.classList.contains("danger")
        })

        if(dangerclass){
            if(error>2){
                alert("YOU LOST")
                location.reload()
            }

        }else{
            alert("YOU WON")
            location.reload()
        }

    }
    
}

// deleting text value of tile on delete icon click

deletenum.addEventListener('click',function(){

    if(lastselected != null){
        if(!lastselected.classList.contains("filled")){
            if(lastselected.innerText!=""){
                lastselected.innerText=""
            }else
                alert("ALREADY EMPTY")
        }else
            alert("YOU CAN'T DELETE THIS TILE")

    }else{
        alert('SELEC TO DELETE')
    }
    
})


// showing the number of wrong attemps user does
function errordisplay(){
    error++
    mistake.innerText = error
}


// checking is all the tiles have the filled with values
function isAlltilesFilled(){
    const allTiles = gameBoard.querySelectorAll(".tile")
    return [...allTiles].every((tile)=>{
        return tile.innerText != ""
    })
}

