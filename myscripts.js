
// Show welcome popup on page load
const welcomePopup = document.getElementById("welcomePopup");
welcomePopup.classList.add("show");

// Hide welcome popup after 3 seconds
setTimeout(function() {
    welcomePopup.classList.add("hidemsg");
}, 2200);        

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", handleImageInput);

let avatarImage = new Image();
let knifeImage = new Image();
let swordImage = new Image();
let bombImage = new Image();
let gunImage = new Image();
let checkupload = 'False';
console.log('Outside',checkupload);
function handleImageInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        avatarImage.onload = function () {
            // Once the avatar image is loaded, update the game
            update();
        };
        avatarImage.src = e.target.result;
        checkupload = 'True';
        console.log('avatarImage.src',checkupload);
    };

    reader.readAsDataURL(file);
}

knifeImage.src = "images/knife.svg";
swordImage.src = "images/sword.svg";
bombImage.src = "images/bomb.svg";
gunImage.src = "images/gun.svg";

// Game variables
let avatarX = 450; // Initial position
let avatarY = 200;
let avatarWidth = 300;
let avatarHeight = 400;

let selectedWeapon = null;
let points = 0;


const knifeButton = document.getElementById("knifeButton");
const swordButton = document.getElementById("swordButton");
const bombButton = document.getElementById("bombButton");
const gunButton = document.getElementById("gunButton");

knifeButton.addEventListener("click", () => {
    selectedWeapon = { type: "Knife", image: knifeImage };
});

swordButton.addEventListener("click", () => {
    if(points >= 10){
        selectedWeapon = { type: "Sword", image: swordImage };
    }
    else{
        showFlashMessage("Opps!! You Need 10 Points to Unlock Sword..");
    }
});

bombButton.addEventListener("click", () => {
    if(points >= 40){
        selectedWeapon = { type: "Bomb", image: bombImage };
    }
    else{
        showFlashMessage("Opps!! You Need 40 Points to Unlock Bomb..");
    }
});

gunButton.addEventListener("click", () => {
    if(points >= 100){
        selectedWeapon = { type: "Gun", image: gunImage };
    }
    else{
        showFlashMessage("Opps!! You Need 100 Points to Unlock Gun..");
    }
});

function showFlashMessage(message) {
    const flashMessage = document.getElementById("flashMessage");
    flashMessage.textContent = message;
    flashMessage.style.display = "block";
  
    setTimeout(() => {
      flashMessage.style.display = "none";
    }, 3000);
  }
    

function handleAvatarClick(event) {
    const clickX = event.offsetX;
    const clickY = event.offsetY;

    if (
        clickX >= avatarX &&
        clickX <= avatarX + avatarWidth &&
        clickY >= avatarY &&
        clickY <= avatarY + avatarHeight
    ) {
        console.log('checkupload',checkupload);
        console.log("selectedWeapon.type1");
        try{
        if(checkupload == 'True'){    
            if (selectedWeapon.type == "Knife" || selectedWeapon.type == "Sword" || selectedWeapon.type == "Bomb" || selectedWeapon.type == "Gun")
            { 
                // Avatar is clicked, play impact animation
                const impactRadius = avatarWidth / 10;
                console.log("selectedWeapon.type",selectedWeapon.type);
                // Create and animate impact animation
                const impactCanvas = document.createElement("canvas");
                const impactCtx = impactCanvas.getContext("2d");
                const impactSize = impactRadius * 2;
                impactCanvas.width = impactSize;
                impactCanvas.height = impactSize;
                impactCanvas.classList.add("impact-animation");
                impactCanvas.style.left = `${clickX - impactRadius}px`;
                impactCanvas.style.top = `${clickY - impactRadius}px`;
                document.getElementById("impactContainer").appendChild(impactCanvas);
                //document.getElementById("KinfeSound").play();


                const impactFrames = 10; // Number of animation frames
                let currentFrame = 0;

                const impactAnimationInterval = setInterval(() => {
                    impactCtx.clearRect(0, 0, impactSize, impactSize);

                    // Draw impact animation frame
                    // Customize the code below to match your desired impact animation
                    impactCtx.fillStyle = "rgba(255, 105, 97, 0.5)";    
                    const radius = impactRadius * (currentFrame / impactFrames);
                    impactCtx.beginPath();
                    impactCtx.arc(impactSize / 2, impactSize / 2, radius, 0, Math.PI * 2);
                    impactCtx.closePath();
                    impactCtx.fill();

                    currentFrame++;

                    if (currentFrame >= impactFrames) {
                        // Animation ends, remove the impact animation canvas
                        clearInterval(impactAnimationInterval);
                        impactCanvas.remove();
                    }
                }, 50);
                console.log("Selected Weapon ::: ",selectedWeapon.type);
                    // Play impact sound effect based on current weapon
                if (selectedWeapon.type == "Knife") {
                    document.getElementById("KinfeSound").play();
                    points++;
                } 
                else if (selectedWeapon.type == "Sword") {
                    document.getElementById("SwordSound").play();
                    points += 2;
                }   
                else if (selectedWeapon.type == "Bomb") {
                    document.getElementById("BombSound").play();
                    points += 3;
                }  
                else if (selectedWeapon.type == "Gun") {
                    document.getElementById("GunSound").play();
                    points += 4;
                }
                // Assign Weapons based on points and notify
                if(points >= 10 && points <= 11 ){
                    selectedWeapon = { type: "Sword", image: swordImage };
                    showFlashMessage("Hurrah!! You have Unlocked Sword..");
                } 
                else if(points >= 40 && points <= 42 ){
                    selectedWeapon = { type: "Bomb", image: bombImage };
                    showFlashMessage("Hurrah!! You have Unlocked Bomb..");
                } 
                else if(points >= 100 && points <= 103){
                    selectedWeapon = { type: "Gun", image: gunImage };
                    showFlashMessage("Hurrah!! You have Unlocked Gun..");
                } 
                // Play impact sound effect
                //document.getElementById("impactSound").play();

                // Increment points
                //console.log("pointsMain",points);
                //points++;
                document.getElementById("points").textContent = points;
            }
        }     
        else
        {   console.log("selectedWeapon.type2");
            showFlashMessage("Kindly Upload a photo to start playing!!");
        }
        }   
        catch(err){
            console.log("selectedWeapon.type33");
            showFlashMessage("Kindly Select a Weapon to Start!!");
        }
    }
}


canvas.addEventListener("click", handleAvatarClick);

function handleMouseMove(event) {
    if (selectedWeapon) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render the avatar
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarWidth, avatarHeight);

        // Render the weapon
        const weaponWidth = 50;
        const weaponHeight = 50;
        ctx.drawImage(selectedWeapon.image, mouseX - weaponWidth / 2, mouseY - weaponHeight / 2, weaponWidth, weaponHeight);
    }
}

canvas.addEventListener("mousemove", handleMouseMove);

// Update and render the game
function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render the avatar
    ctx.drawImage(avatarImage, avatarX, avatarY, avatarWidth, avatarHeight);
    // console.log("points11",points);
    if (selectedWeapon) {
        // Render the weapon
        const weaponWidth = 50;
        const weaponHeight = 50;
        const mouseX = canvas.mouseX;
        const mouseY = canvas.mouseY;
        ctx.fillStyle = "gray";
        ctx.fillRect(mouseX - weaponWidth / 2, mouseY - weaponHeight / 2, weaponWidth, weaponHeight);
    }
}

function handleWeaponThrow(event) {
    if (selectedWeapon) {
        const weapon = {
            type: selectedWeapon.type,
            x: event.offsetX,
            y: event.offsetY,
            width: 50,
            height: 50,
            speedX: 0,
            speedY: -5,
            color: getRandomColor(),
            rotation: 0,
            rotationSpeed: getRandomRotationSpeed(),
            hit: false,
            animationFrames: 0,
        };
        // console.log("Weapon! ::: ",weapon);
        // console.log("Weapons ::: ",weapons);
        weapons.push(weapon);
        // console.log("Weapon! ::: ",weapon);
        selectedWeapon = null;
    }
}

canvas.addEventListener("click", handleWeaponThrow);

// Update and render the game
function update() {
    // console.log("points222",points);
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render the avatar
    ctx.drawImage(avatarImage, avatarX, avatarY, avatarWidth, avatarHeight);

    // Render the weapons
    for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];

        if (weapon.hit) {
            // Display impact animation on hit
            const impactRadius = weapon.width;
            ctx.beginPath();
            ctx.arc(weapon.x, weapon.y, impactRadius, 0, Math.PI * 2);
            ctx.fillStyle = "orange";
            ctx.globalAlpha = 0.5;
            ctx.fill();
            ctx.globalAlpha = 1;
        } else {
            // Display rotating weapon with animation
            ctx.save();
            ctx.translate(weapon.x, weapon.y);
            ctx.rotate(weapon.rotation);

            // Draw the weapon based on its type
            switch (weapon.type) {
                case "Knife":
                    ctx.fillStyle = "gray";
                    ctx.fillRect(-weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height);
                    break;
                case "Sword":
                    ctx.strokeStyle = "silver";
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(-weapon.width / 2, 0);
                    ctx.lineTo(weapon.width / 2, 0);
                    ctx.lineTo(-weapon.width / 2, -weapon.height / 2);
                    ctx.closePath();
                    ctx.stroke();
                    break;
                case "Bomb":
                    ctx.fillStyle = "red";
                    ctx.beginPath();
                    ctx.arc(0, 0, weapon.width / 2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case "Gun":
                    ctx.fillStyle = "black";
                    ctx.fillRect(-weapon.width / 2, -weapon.height / 2, weapon.width, weapon.height);
                    break;
            }

            ctx.restore();

            weapon.x += weapon.speedX;
            weapon.y += weapon.speedY;
            weapon.rotation += weapon.rotationSpeed;

            weapon.animationFrames++;

            if (weapon.animationFrames >= 50) {
                // If the weapon has been in the air for too long, remove it
                weapons.splice(i, 1);
                i--;
            } else {
                // Check for collision with the avatar
                if (
                    weapon.x >= avatarX &&
                    weapon.x <= avatarX + avatarWidth &&
                    weapon.y >= avatarY &&
                    weapon.y <= avatarY + avatarHeight
                ) {
                    weapon.hit = true;
                    // console.log("points",points);
                    points++;
                    document.getElementById("points").textContent = points;
                }
            }
        }
    }

    // Request the next frame
    requestAnimationFrame(update);
}

// Start the game
update();

// Utility functions
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomRotationSpeed() {
    return (Math.random() - 0.5) * 0.2;
}

