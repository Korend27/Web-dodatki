$(document).ready(function () {
    let buttonColors = ["red", "blue", "yellow", "green"];
    let gamePattern = [];
    let userClickedPattern = [];
    let level = 0;
    let started = false;

    $(document).keydown(function () {
        if (!started) {
            $("h1").text("Level " + level);
            nextSequence();
            started = true;
        }
    });

    $(".btn").click(function () {
        let userChosenColor = $(this).attr("id");
        userClickedPattern.push(userChosenColor);

        playSound(userChosenColor);
        animatePress(userChosenColor);

        checkAnswer(userClickedPattern.length - 1);
    });

    function nextSequence() {
        userClickedPattern = [];
        level++;
        $("h1").text("Level " + level);

        let randomNumber = Math.floor(Math.random() * 4);
        let randomChosenColor = buttonColors[randomNumber];
        gamePattern.push(randomChosenColor);

        // Play the full sequence with delay
        playSequence();
    }

    function playSequence() {
        let i = 0;
        let interval = setInterval(function () {
            let currentColor = gamePattern[i];
            $("#" + currentColor).fadeIn(100).fadeOut(100).fadeIn(100);
            playSound(currentColor);
            i++;
            if (i >= gamePattern.length) {
                clearInterval(interval);
            }
        }, 600); 
    }

    function checkAnswer(currentLevel) {
        if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
            // If user has finished their sequence
            if (userClickedPattern.length === gamePattern.length) {
                setTimeout(function () {
                    nextSequence();
                }, 1000);
            }
        } else {
            playSound("wrong");
            $("body").addClass("game-over");
            $("h1").text("Game Over, Press Any Key to Restart");

            setTimeout(function () {
                $("body").removeClass("game-over");
            }, 200);

            startOver();
        }
    }

    // Reset the game if the user makes a mistake
    function startOver() {
        level = 0;
        gamePattern = [];
        started = false;
    }

    function playSound(name) {
        let audio = new Audio("sounds/" + name + ".mp3");
        audio.play();
    }

    function animatePress(currentColor) {
        $("#" + currentColor).addClass("pressed");
        setTimeout(function () {
            $("#" + currentColor).removeClass("pressed");
        }, 100);
    }
});