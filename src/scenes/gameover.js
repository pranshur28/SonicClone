import k from "../kaplayCtx.js";

export default function gameover({ citySFX }) {
    citySFX.paused = true;
    const currentScore = k.getData("current-score");
    let highScores = k.getData("high-scores") || [];  // Array of {name, score}
    
    // Check if current score qualifies for top 5
    const isTopScore = highScores.length < 5 || currentScore > Math.min(...highScores.map(s => s.score));
    let nameInput = "";
    let isEnteringName = isTopScore;
    let inputField = null;
    let cursorBlink = null;
    
    // Create score text objects
    const currentScoreText = k.add([
        k.text(`Current Score: ${currentScore}`, {
            font: "mania",
            size: 48
        }),
        k.pos(k.width() / 2, k.height() / 2 - 200),
        k.anchor("center"),
        k.color(k.rgb(255, 215, 0))
    ]);

    // Create input field if it's a top score
    if (isTopScore) {
        const enterNameText = k.add([
            k.text("NEW HIGH SCORE! Enter your name:", {
                font: "mania",
                size: 36
            }),
            k.pos(k.width() / 2, k.height() / 2 - 100),
            k.anchor("center"),
            k.color(k.rgb(255, 215, 0))
        ]);

        inputField = k.add([
            k.rect(300, 50),
            k.pos(k.width() / 2, k.height() / 2 - 50),
            k.anchor("center"),
            k.color(0, 0, 0),
            k.outline(4, k.rgb(255, 215, 0))
        ]);

        const inputText = k.add([
            k.text(nameInput, {
                font: "mania",
                size: 32
            }),
            k.pos(k.width() / 2, k.height() / 2 - 50),
            k.anchor("center"),
            k.color(255, 255, 255)
        ]);

        // Add blinking cursor
        cursorBlink = k.add([
            k.rect(3, 32),
            k.pos(k.width() / 2 + (nameInput.length * 16), k.height() / 2 - 50),
            k.anchor("center"),
            k.color(255, 255, 255)
        ]);

        // Blink cursor
        let cursorVisible = true;
        const blinkAction = k.loop(0.5, () => {
            cursorVisible = !cursorVisible;
            cursorBlink.color = cursorVisible ? k.rgb(255, 255, 255) : k.rgb(0, 0, 0);
        });

        // Handle keyboard input
        k.onKeyPress("backspace", () => {
            if (!isEnteringName) return;
            if (nameInput.length > 0) {
                nameInput = nameInput.slice(0, -1);
                inputText.text = nameInput;
                cursorBlink.pos.x = k.width() / 2 + (nameInput.length * 16);
            }
        });

        k.onKeyPress("enter", () => {
            if (!isEnteringName || nameInput.length === 0) return;
            
            isEnteringName = false;
            // Add new score to high scores
            highScores.push({ name: nameInput, score: currentScore });
            // Sort and keep top 5
            highScores.sort((a, b) => b.score - a.score);
            highScores = highScores.slice(0, 5);
            // Save to storage and localStorage
            k.setData("high-scores", highScores);
            localStorage.setItem('sonic-high-scores', JSON.stringify(highScores));
            // Remove input field
            enterNameText.destroy();
            inputField.destroy();
            inputText.destroy();
            cursorBlink.destroy();
            blinkAction.cancel();
            // Now display the leaderboard after saving
            displayLeaderboard();
        });

        k.onKeyPress(key => {
            if (!isEnteringName) return;
            if (key.length === 1 && nameInput.length < 10 && /[a-zA-Z0-9]/.test(key)) {
                nameInput += key.toUpperCase();
                inputText.text = nameInput;
                cursorBlink.pos.x = k.width() / 2 + (nameInput.length * 16);
            }
        });
    } else {
        // Show message when score isn't high enough
        k.add([
            k.text("Keep trying to beat the high scores!", {
                font: "mania",
                size: 36
            }),
            k.pos(k.width() / 2, k.height() / 2 - 100),
            k.anchor("center"),
            k.color(k.rgb(255, 255, 255))
        ]);
        // Display leaderboard immediately if not a high score
        displayLeaderboard();
    }

    function displayLeaderboard() {
        // Clear any existing leaderboard elements first
        const existingElements = k.get("leaderboard");
        existingElements.forEach(el => el.destroy());

        // Display leaderboard title
        k.add([
            k.text("TOP SCORES", {
                font: "mania",
                size: 48
            }),
            k.pos(k.width() / 2, k.height() / 2),
            k.anchor("center"),
            k.color(k.rgb(255, 215, 0)),
            "leaderboard"
        ]);

        // Display each high score
        highScores.forEach((score, index) => {
            const isCurrentScore = score.score === currentScore && score.name === nameInput;
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  ";
            k.add([
                k.text(`${medal} ${score.name} - ${score.score}`, {
                    font: "mania",
                    size: 36
                }),
                k.pos(k.width() / 2, k.height() / 2 + 80 + (index * 50)),
                k.anchor("center"),
                k.color(isCurrentScore ? k.rgb(255, 215, 0) : k.rgb(255, 255, 255)),
                "leaderboard"
            ]);
        });
    }

    // Create replay button
    const replayBtn = k.add([
        k.rect(200, 60),
        k.pos(k.width() / 2, k.height() - 100),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.outline(4, k.rgb(255, 215, 0)),
        k.area()
    ]);

    // Add button text
    const replayText = k.add([
        k.text("Replay", {
            font: "mania",
            size: 36
        }),
        k.pos(k.width() / 2, k.height() - 100),
        k.anchor("center"),
        k.color(255, 255, 255)
    ]);

    // Add button hover effect
    replayBtn.onHover(() => {
        replayBtn.color = k.rgb(50, 50, 50);
    });

    replayBtn.onHoverEnd(() => {
        replayBtn.color = k.rgb(0, 0, 0);
    });

    // Add click handler
    replayBtn.onClick(() => {
        k.go("game");
    });

    return {
        destroy() {
            currentScoreText.destroy();
            replayBtn.destroy();
            replayText.destroy();
            if (inputField) {
                inputField.destroy();
            }
            if (cursorBlink) {
                cursorBlink.destroy();
            }
            const leaderboardElements = k.get("leaderboard");
            leaderboardElements.forEach(el => el.destroy());
        }
    };
}
