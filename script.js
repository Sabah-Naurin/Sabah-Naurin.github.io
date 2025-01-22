document.getElementById("runCode").addEventListener("click", async () => {
  const code = document.getElementById("codeInput").value; // Get the code from the textarea

  try {
    // Make the API call
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "java", // Specify the language
        version: "15.0.2", // Correct version for Java
        files: [
          {
            name: "Main.java", // Required file name
            content: code, // User's Java code
          },
        ],
      }),
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const result = await response.json();

    // Display the output or error
    document.getElementById("output").textContent =
      result.run.stdout || result.run.stderr || "No output";
  } catch (error) {
    // Catch any errors
    console.error("Error during API call:", error);
    document.getElementById("output").textContent =
      "An error occurred while making the API call.";
  }
});