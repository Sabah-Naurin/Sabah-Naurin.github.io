const files = []; // Store file data: { id, name, editorInstance }

// Add a default file on page load
document.addEventListener("DOMContentLoaded", () => {
    addTab("Main.java", `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`);
});

// Add event listener to the Go Back button
document.getElementById("go-back").addEventListener("click", () => {
    window.location.href = "index.html"; // Navigate to the index page
});

// Trigger the modal for adding a new file
document.getElementById("add-file-btn").addEventListener("click", () => {
    const addFileModal = new bootstrap.Modal(document.getElementById("addFileModal"));
    addFileModal.show();
});

// Handle file addition via modal
document.getElementById("saveFileButton").addEventListener("click", () => {
    const fileNameInput = document.getElementById("fileName");
    const fileName = fileNameInput.value.trim();

    if (fileName) {
        addTab(fileName, "");
        fileNameInput.value = ""; // Clear the input field
        const addFileModal = bootstrap.Modal.getInstance(document.getElementById("addFileModal"));
        addFileModal.hide();
    } else {
        alert("Please enter a valid file name.");
    }
});

// Function to add a new tab and initialize CodeMirror editor
function addTab(fileName, initialCode) {
    const tabId = `file${files.length}`; // Unique ID for tab and editor

    // Add a new tab button
    const tabButton = document.createElement("li");
    tabButton.className = "nav-item";
    tabButton.innerHTML = `
        <button class="nav-link ${files.length === 0 ? "active" : ""}" 
            id="tab-${tabId}" 
            data-bs-toggle="tab" 
            data-bs-target="#content-${tabId}" 
            type="button" role="tab">
            ${fileName}
        </button>`;
    document.getElementById("fileTabs").appendChild(tabButton);

    // Add tab content container
    const tabContent = document.createElement("div");
    tabContent.className = `tab-pane fade ${files.length === 0 ? "show active" : ""}`;
    tabContent.id = `content-${tabId}`;
    tabContent.innerHTML = `<div class="editor" id="editor-${tabId}"></div>`;
    document.getElementById("tabContent").appendChild(tabContent);

    // Initialize CodeMirror for this tab
    const editor = CodeMirror(document.getElementById(`editor-${tabId}`), {
        value: initialCode,
        mode: "text/x-java",
        lineNumbers: true,
        theme: "default",
        matchBrackets: true,
        autoCloseBrackets: true,
    });

    files.push({ id: tabId, name: fileName, editorInstance: editor });

    // Refresh the editor on tab switch
    document.getElementById(`tab-${tabId}`).addEventListener("shown.bs.tab", () => {
        editor.refresh(); // Refresh editor to fix rendering issues
    });
}

// Handle code submission
document.getElementById("submit-code").addEventListener("click", async () => {
    // Combine all classes into a single file
    const combinedCode = files.map((file) => file.editorInstance.getValue()).join("\n\n");

    // Prepare the payload with a single file
    const payload = {
        language: "java",
        version: "15.0.2",
        files: [
            {
                name: "Main.java", // Single combined file
                content: combinedCode,
            },
        ],
    };

    try {
        // Send the request to Piston API
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Display the output or error
        if (result.run.stderr) {
            document.getElementById("result-message").innerHTML =
                `<pre style="color: red;">${result.run.stderr}</pre>`;
        } else {
            document.getElementById("result-message").innerHTML =
                `<pre style="color: green;">${result.run.stdout}</pre>`;
        }
    } catch (err) {
        console.error("API error:", err);
        document.getElementById("result-message").innerHTML =
            `<span style="color: red;">Error submitting code: ${err.message}</span>`;
    }
});


