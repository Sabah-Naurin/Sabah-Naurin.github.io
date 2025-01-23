document.getElementById("runCode").addEventListener("click", async () => {
  const code = document.getElementById("codeInput").value; // Get the code from the textarea

  const payload = {
    language: "java",
    version: "15.0.2", // Correct version from the runtime list
    files: [
      {
        name: "Main.java", // Required file name
        content: code, // User's Java code
      },
    ],
  };

  console.log("Payload:", JSON.stringify(payload, null, 2)); // Log payload for debugging

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

    // Display the output or error
    document.getElementById("output").textContent =
      result.run.stdout || result.run.stderr || "No output";
  } catch (error) {
    console.error("Error during API call:", error);
    document.getElementById("output").textContent =
      "An error occurred while making the API call.";
  }
});