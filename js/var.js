// Define the Piston API endpoint
const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

// Function to send a request to the Piston API
async function runJavaCode(javaCode) {
    try {
        // Prepare the request body
        const requestBody = {
            language: "java",
            version: "15.0.2", // Ensure this matches the runtime version you're using
            files: [
                {
                    name: "Main.java",
                    content: javaCode,
                },
            ],
        };

        // Send the POST request
        const response = await fetch(PISTON_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        // Parse the JSON response
        const result = await response.json();

        // Handle the output
        if (result.run) {
            return result.run.stdout || result.run.stderr;
        } else {
            console.error("Unexpected response format:", result);
            return "No output received";
        }
    } catch (error) {
        console.error("Error running code:", error);
        return "An error occurred while executing the code.";
    }
}

// Function to execute the code from a <pre><code> block
async function executeCode(exampleId, exampleOutput) {
    const codeElement = document.getElementById(exampleId);
    if (codeElement) {
        const javaCode = codeElement.innerText.trim(); // Get the code from the <code> element
        const output = await runJavaCode(javaCode); // Run the code using the Piston API
        document.getElementById(exampleOutput).innerText = output; // Display the result in the output section
    } else {
        console.error("Element with ID", exampleId, "not found.");
    }
}