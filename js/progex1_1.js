// Initialize CodeMirror with persisted code or default code
const editor = CodeMirror(document.getElementById("editor"), {
    value: localStorage.getItem("userCode") || `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
    mode: "text/x-java", // Enable Java syntax highlighting
    lineNumbers: true,   // Show line numbers
    theme: "default",    // Use a basic theme
    matchBrackets: true, // Highlight matching brackets
    autoCloseBrackets: true, // Automatically close brackets
    readOnly: false, // Ensure the editor is editable
});

// Save the user's code to local storage on every change
editor.on("change", () => {
    const userCode = editor.getValue();
    localStorage.setItem("userCode", userCode);
});

// Expected output
const expectedOutput = `Once upon a time\nThere was a dog.\nHe was a good boy.`;

// Function to send code to the Piston API
async function runCode(studentCode) {
    const payload = {
        language: "java",
        version: "15.0.2",
        files: [
            {
                name: "Main.java",
                content: studentCode,
            },
        ],
    };

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    return response.json();
}

// Handle "Test Code" button click
document.getElementById("test-code").addEventListener("click", async () => {
    const studentCode = editor.getValue();
    const resultMessage = document.getElementById("result-message");

    if (!studentCode.trim()) {
        resultMessage.innerHTML = `<span style="color: red;">Please write your code!</span>`;
        return;
    }

    try {
        const result = await runCode(studentCode);

        if (result.run.stderr) {
            resultMessage.innerHTML = `<pre style="color: red;">${result.run.stderr}</pre>`;
        } else {
            resultMessage.innerHTML = `<pre style="color: green;">Output:\n${result.run.stdout}</pre>`;
        }
    } catch (err) {
        resultMessage.innerHTML = `<span style="color: red;">Error: ${err.message}</span>`;
    }
});

// Handle "Submit Code" button click
document.getElementById("submit-code").addEventListener("click", async () => {
    const studentCode = editor.getValue();
    const resultMessage = document.getElementById("result-message");

    if (!studentCode.trim()) {
        resultMessage.innerHTML = `<span style="color: red;">Please write your code!</span>`;
        return;
    }

    try {
        const result = await runCode(studentCode);

        if (result.run.stderr) {
            resultMessage.innerHTML = `<pre style="color: red;">${result.run.stderr}</pre>`;
        } else {
            const studentOutput = result.run.stdout.trim();
            if (studentOutput === expectedOutput) {
                resultMessage.innerHTML = `<pre style="color: green;">Good job! Your program works as expected.</pre>`;
            } else {
                resultMessage.innerHTML = `<pre style="color: red;">Incorrect output! Expected:\n"${expectedOutput}"\n\nBut got:\n"${studentOutput}"</pre>`;
            }
        }
    } catch (err) {
        resultMessage.innerHTML = `<span style="color: red;">Error: ${err.message}</span>`;
    }
});