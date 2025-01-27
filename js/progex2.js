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


// Handle "Test Code" button click
document.getElementById("test-code").addEventListener("click", async () => {
    const studentCode = editor.getValue(); // Get the code from CodeMirror
    const resultMessage = document.getElementById("result-message");

    if (!studentCode.trim()) {
        resultMessage.innerHTML = `<span style="color: red;">Please enter your code!</span>`;
        return;
    }

    const payload = {
        language: "java",
        version: "15.0.2", // Correct version of Java runtime
        files: [
            {
                name: "Main.java", // Filename required by the API
                content: studentCode, // User's code
            },
        ],
        stdin: "", // No input needed for this test
    };

    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Display the output or error
        if (result.run.stderr) {
            resultMessage.innerHTML = `<pre style="color: red;">${result.run.stderr}</pre>`;
        } else {
            resultMessage.innerHTML = `<pre style="color: green;">${result.run.stdout}</pre>`;
        }
    } catch (err) {
        console.error("API error:", err);
        resultMessage.innerHTML = `<span style="color: red;">Error submitting code: ${err.message}</span>`;
    }
});

// Handle "Submit Code" button click
document.getElementById("submit-code").addEventListener("click", async () => {
    const studentCode = editor.getValue(); // Get the code from CodeMirror
    const studentName = document.getElementById("input-name").value.trim(); // Get the student's name
    const studentId = document.getElementById("input-id").value.trim(); // Get the student's ID
    const studentDepartment = document.getElementById("input-department").value.trim(); // Get the student's department
    const resultMessage = document.getElementById("result-message");

    // Validate inputs
    if (!studentName || !studentId || !studentDepartment) {
        resultMessage.innerHTML = `<span style="color: red;">Please fill out all fields (Name, ID, and Department)!</span>`;
        return;
    }

    const idPattern = /^\d{7}$/; // Regex to validate exactly 7 digits
    if (!idPattern.test(studentId)) {
        resultMessage.innerHTML = `<span style="color: red;">Invalid ID! It must be exactly 7 digits.</span>`;
        return;
    }

    const expectedOutput = `Hello, I am ${studentName}. My ID is ${studentId}. My department is ${studentDepartment}.`;

    const payload = {
        language: "java",
        version: "15.0.2", // Correct version of Java runtime
        files: [
            {
                name: "Main.java", // Filename required by the API
                content: studentCode, // User's code
            },
        ],
    };

    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Display the output or error
        if (result.run.stderr) {
            resultMessage.innerHTML = `<pre style="color: red;">${result.run.stderr}</pre>`;
        } else {
            const studentOutput = result.run.stdout.trim(); // Get the program output and trim whitespace

            // Compare student's output with the expected output
            if (studentOutput === expectedOutput) {
                resultMessage.innerHTML = `<pre style="color: green;">Good job! Your program works as expected.</pre>`;
            } else {
                resultMessage.innerHTML = `<pre style="color: red;">Incorrect output! Expected: "${expectedOutput}", but got: "${studentOutput}".</pre>`;
            }
        }
    } catch (err) {
        console.error("API error:", err);
        resultMessage.innerHTML = `<span style="color: red;">Error submitting code: ${err.message}</span>`;
    }
});
