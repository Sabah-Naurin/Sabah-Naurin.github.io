// Initialize CodeMirror with default code
const editor = CodeMirror(document.getElementById("editor"), {
    value: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");
    }
}`,
    mode: "text/x-java", // Enable Java syntax highlighting
    lineNumbers: true,   // Show line numbers
    theme: "default",    // Use a basic theme
    matchBrackets: true, // Highlight matching brackets
    autoCloseBrackets: true, // Automatically close brackets
    readOnly: false, // Ensure the editor is editable
});

// Add event listener to the Go Back button
document.getElementById("go-back").addEventListener("click", () => {
    window.location.href = "index.html"; // Navigate to the index page
});

// Define test cases for validation
const testCases = [
    { input: "3\n5", expectedOutput: "8" },
    { input: "10\n20", expectedOutput: "30" },
    { input: "-1\n1", expectedOutput: "0" },
];

// Handle code submission
document.getElementById("submit-code").addEventListener("click", async () => {
    const studentCode = editor.getValue(); // Get the code from CodeMirror
    const resultMessage = document.getElementById("result-message");

    if (!studentCode.trim()) {
        resultMessage.textContent = "Please enter your code!";
        resultMessage.style.color = "red";
        return;
    }

    let allCorrect = true;

    for (const testCase of testCases) {
        const payload = {
            language: "java",
            version: "15.0.2", // Correct version of Java runtime
            files: [
                {
                    name: "Main.java", // Filename required by the API
                    content: studentCode, // User's code
                },
            ],
            stdin: testCase.input, // Input for the program
        };

        console.log("Payload:", JSON.stringify(payload, null, 2)); // Log the payload for debugging

        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            const studentOutput = result.run.stdout.trim(); // Get the program output
            console.log("Student Output:", studentOutput);

            // Compare the student's output with the expected output
            if (studentOutput !== testCase.expectedOutput) {
                allCorrect = false;
                resultMessage.textContent = `Wrong answer for input: ${testCase.input}.
                Your output was: "${studentOutput}", expected: "${testCase.expectedOutput}"`;
                resultMessage.style.color = "red";
                break;
            }
        } catch (error) {
            console.error("Error during API call:", error);
            resultMessage.textContent =
                "An error occurred while making the API call.";
            resultMessage.style.color = "red";
            return;
        }
    }

    if (allCorrect) {
        resultMessage.textContent = "Good job! All test cases passed.";
        resultMessage.style.color = "green";
    }
});
