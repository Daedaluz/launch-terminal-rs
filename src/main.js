const { invoke } = window.__TAURI__.core;

function getCommand() {
  var elements = document.getElementsByName("command");

  for (var i=0, len=elements.length; i<len; ++i) {
    if (elements[i].checked) {
      const value = elements[i].value;
      if (value == "custom") {
        return document.getElementById("custom-command").value;
      }
      if (value == "kubectl") {
        return "kubectl get pods";
      }
      if (value == "kubectl-exec") {
        return `kubectl exec nginx-deployment-76455cb95c-62ndq --stdin --tty -- sh -c "clear; /bin/echo -e '\\033[1;4;32mCONTEXT\\033[0m 👉 Connected to container \\033[1;4;36mCONTAINER\\033[0m on pod \\033[1;4;36mNAMESPACE\\033[0m / \\033[1;4;36mPOD\\033[0m\\n'; (bash || ash || sh)"`;
      }
      return "echo 'Hello World'";
    }
  }
}

async function launchTerminal(terminal) {
  const errorEl = document.getElementById("error");
  try {
    errorEl.innerText = "";
    
    const isInstalled = await invoke("is_installed", { terminal });
    if (!isInstalled) {
      errorEl.innerText = `The terminal ${terminal} is not installed on your system.`;
      return;
    }

    await invoke("launch", { terminal, command: getCommand() });
  } catch (err) {
    errorEl.innerText = err;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const bt = document.getElementById("launch");
  const terminal = document.getElementById("terminal");
  bt.addEventListener("click", (e) => {
    launchTerminal(terminal.value);
  });
});
