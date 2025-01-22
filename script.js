document.getElementById("runCode").addEventListener("click", async () => {
    const code = document.getElementById("codeInput").value;
  
    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "java", // Language
          version: "17.0.8", // Specify the correct version
          files: [
            {
              name: "Main.java",
              content: code, // Code content from textarea
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      // Display the output or errors
      document.getElementById("output").textContent =
        result.run.stdout || result.run.stderr || "No output";
    } catch (error) {
      console.error("Error during API call:", error);
      document.getElementById("output").textContent =
        "An error occurred while making the API call.";
    }
  });