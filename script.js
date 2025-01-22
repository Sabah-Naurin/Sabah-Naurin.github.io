document.getElementById("runCode").addEventListener("click", async () => {
    const code = document.getElementById("codeInput").value;
  
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "java",
        version: "latest",
        files: [{ name: "Main.java", content: code }],
      }),
    });
  
    const result = await response.json();
  
    document.getElementById("output").textContent =
      result.run.stdout || result.run.stderr || "No output";
  });
  