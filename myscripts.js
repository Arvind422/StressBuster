
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

function handleImageInput(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        avatarImage.onload = function () {
            // Once the avatar image is loaded, update the game
            update();
        };
        avatarImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

knifeImage.src = "images/knife.svg";
swordImage.src = "images/sword.svg";
bombImage.src = "images/bomb.svg";
gunImage.src = "images/gun.svg";

// Game variables
let avatarX = 350; // Initial position
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
    selectedWeapon = { type: "Sword", image: swordImage };
});

bombButton.addEventListener("click", () => {
    selectedWeapon = { type: "Bomb", image: bombImage };
});

gunButton.addEventListener("click", () => {
    selectedWeapon = { type: "Gun", image: gunImage };
});

function handleAvatarClick(event) {
    const clickX = event.offsetX;
    const clickY = event.offsetY;

    if (
        clickX >= avatarX &&
        clickX <= avatarX + avatarWidth &&
        clickY >= avatarY &&
        clickY <= avatarY + avatarHeight
    ) {
        // Avatar is clicked, play impact animation
        const impactRadius = avatarWidth / 2;

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
        document.getElementById("impactSound").play();


        const impactFrames = 25; // Number of animation frames
        let currentFrame = 0;

        const impactAnimationInterval = setInterval(() => {
            impactCtx.clearRect(0, 0, impactSize, impactSize);

            // Draw impact animation frame
            // Customize the code below to match your desired impact animation

            impactCtx.fillStyle = "red";
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

        // Play impact sound effect
        document.getElementById("impactSound").play();

        // Increment points
        points++;
        document.getElementById("points").textContent = points;
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
            type: selectedWeapon,
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

        weapons.push(weapon);

        selectedWeapon = null;
    }
}

canvas.addEventListener("click", handleWeaponThrow);

// Update and render the game
function update() {
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

