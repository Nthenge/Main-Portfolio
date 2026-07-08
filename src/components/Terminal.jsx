import { useState, useRef, useEffect, useCallback } from "react";
import { SECTIONS, HELP_TEXT, NAME, ROLE } from "../data/content";
import { useSectionNav } from "../context/SectionContext";
import { API_BASE_URL } from "../config/api";
import { refreshProjects } from "../hooks/useProjects";
import { refreshSkills } from "../hooks/useSkills";
import { refreshServices } from "../hooks/useServices";
import "./Terminal.css";

const ADMIN_HELP_TEXT = `Admin commands:
  submissions                                view contact leads
  set-availability true|false                toggle availability badge
  add-skill <name>|<sortOrder>
  add-project <name>|<domain>|<description>|<link>|<sortOrder>
  add-service <number>|<title>|<subtitle>|<wide:true/false>|<sortOrder>
  logout                                     end admin session`;

const ADMIN_COMMANDS = [
  "submissions",
  "set-availability",
  "add-skill",
  "add-project",
  "add-service",
  "admin-help",
];

export default function Terminal() {
  const { scrollToSection } = useSectionNav();
  const [history, setHistory] = useState([
    {
      type: "output",
      text: "Lets interact, the backend way :~. Type 'help' to get started.",
    },
  ]);
  const [value, setValue] = useState("");
  const [authMode, setAuthMode] = useState("idle"); // idle | awaiting-username | awaiting-password
  const [pendingUsername, setPendingUsername] = useState("");
  const [authHeader, setAuthHeader] = useState(null); // "Basic base64..."
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = useCallback(
    async (rawInput) => {
      const trimmed = rawInput.trim();
      const cmd = trimmed.toLowerCase();
      if (cmd === "") return null;

      if (cmd === "help") return HELP_TEXT;

      if (SECTIONS.includes(cmd)) {
        scrollToSection(cmd);
        return `Navigating to ${cmd}...`;
      }

      if (cmd.startsWith("cd ")) {
        const target = cmd.replace("cd ", "").trim();
        if (SECTIONS.includes(target)) {
          scrollToSection(target);
          return `Navigating to ${target}...`;
        }
        return `cd: no such section: ${target}`;
      }

      if (cmd === "whoami") {
        return `${NAME} — ${ROLE}.\nMANTRA - Limits? What are those!!!`;
      }

      if (cmd === "ls") {
        return "home.tsx  work.tsx  services.tsx  about.tsx  contact.tsx";
      }

      if (cmd === "clear" || cmd === "cls") {
        setHistory([]);
        return null;
      }

      if (cmd === "sudo make-coffee") {
        return "Permission granted. Brewing... coffee is ready.";
      }

      if (cmd === "status") {
        try {
          const res = await fetch(`${API_BASE_URL}/api/health`);
          if (!res.ok) throw new Error("non-200 response");
          const data = await res.json();
          const mins = Math.floor(data.uptimeSeconds / 60);
          const secs = data.uptimeSeconds % 60;
          return `server: ${data.status} · uptime: ${mins}m ${secs}s · checked ${new Date(
            data.timestamp
          ).toLocaleTimeString()}`;
        } catch {
          return "status: could not reach backend. Is the Spring Boot server running?";
        }
      }

      // --- hidden admin flow, deliberately excluded from HELP_TEXT ---

      if (cmd === "login") {
        if (authHeader) return "Already logged in. Type 'logout' first to switch accounts.";
        setAuthMode("awaiting-username");
        return null;
      }

      if (cmd === "logout") {
        setAuthHeader(null);
        setAuthMode("idle");
        return authHeader ? "Logged out." : "Not logged in.";
      }

      const isAdminCommand = ADMIN_COMMANDS.some(
        (c) => cmd === c || cmd.startsWith(c + " ")
      );

      if (isAdminCommand && !authHeader) {
        return "Admin login required. Type 'login' to authenticate.";
      }

      if (cmd === "admin-help") return ADMIN_HELP_TEXT;

      if (cmd === "submissions") {
        try {
          const res = await fetch(`${API_BASE_URL}/api/contact/submissions`, {
            headers: { Authorization: authHeader },
          });
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data.length === 0) return "No submissions yet.";
          return data
            .map(
              (s) =>
                `#${s.id}  ${s.name} <${s.email}> — ${s.service || "n/a"} (${new Date(
                  s.createdAt
                ).toLocaleString()})`
            )
            .join("\n");
        } catch {
          return "Failed to load submissions.";
        }
      }

      if (cmd.startsWith("set-availability ")) {
        const arg = cmd.replace("set-availability ", "").trim();
        if (arg !== "true" && arg !== "false") {
          return "Usage: set-availability true|false";
        }
        try {
          const res = await fetch(`${API_BASE_URL}/api/availability`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({ available: arg === "true" }),
          });
          if (!res.ok) throw new Error();
          return `Availability set to ${arg}. Refresh the hero badge to see it update.`;
        } catch {
          return "Failed to update availability.";
        }
      }

      if (cmd.startsWith("add-skill ")) {
        const [name, sortOrder] = trimmed
          .slice("add-skill ".length)
          .split("|")
          .map((s) => s.trim());
        if (!name) return "Usage: add-skill <name>|<sortOrder>";
        try {
          const res = await fetch(`${API_BASE_URL}/api/skills`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({ name, sortOrder: Number(sortOrder) || 0 }),
          });
          if (!res.ok) throw new Error();
          await refreshSkills();
          return `Skill "${name}" added.`;
        } catch {
          return "Failed to add skill.";
        }
      }

      if (cmd.startsWith("add-project ")) {
        const [name, domain, description, link, sortOrder] = trimmed
          .slice("add-project ".length)
          .split("|")
          .map((s) => s.trim());
        if (!name || !domain || !description) {
          return "Usage: add-project <name>|<domain>|<description>|<link>|<sortOrder>";
        }
        try {
          const res = await fetch(`${API_BASE_URL}/api/projects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({
              name,
              domain,
              description,
              link: link || "",
              sortOrder: Number(sortOrder) || 0,
            }),
          });
          if (!res.ok) throw new Error();
          await refreshProjects();
          return `Project "${name}" added.`;
        } catch {
          return "Failed to add project.";
        }
      }

      if (cmd.startsWith("add-service ")) {
        const [number, title, subtitle, wide, sortOrder] = trimmed
          .slice("add-service ".length)
          .split("|")
          .map((s) => s.trim());
        if (!number || !title || !subtitle) {
          return "Usage: add-service <number>|<title>|<subtitle>|<wide:true/false>|<sortOrder>";
        }
        try {
          const res = await fetch(`${API_BASE_URL}/api/services`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({
              number,
              title,
              subtitle,
              wide: wide === "true",
              sortOrder: Number(sortOrder) || 0,
            }),
          });
          if (!res.ok) throw new Error();
          await refreshServices();
          return `Service "${title}" added.`;
        } catch {
          return "Failed to add service.";
        }
      }

      return `bash: command not found: ${cmd}. Type 'help' to see available commands.`;
    },
    [scrollToSection, authHeader]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.trim() === "") return;
    const typed = value;
    setValue("");

    if (authMode === "awaiting-username") {
      setPendingUsername(typed.trim());
      setHistory((prev) => [...prev, { type: "input", text: typed }]);
      setAuthMode("awaiting-password");
      return;
    }

    if (authMode === "awaiting-password") {
      const masked = "•".repeat(typed.length);
      setHistory((prev) => [...prev, { type: "input", text: masked }]);

      const credentials = btoa(`${pendingUsername}:${typed}`);
      try {
        const res = await fetch(`${API_BASE_URL}/api/contact/submissions`, {
          headers: { Authorization: `Basic ${credentials}` },
        });
        if (!res.ok) throw new Error();
        setAuthHeader(`Basic ${credentials}`);
        setAuthMode("idle");
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            text: "✓ Authenticated. Type 'admin-help' to see admin commands.",
          },
        ]);
      } catch {
        setAuthMode("idle");
        setHistory((prev) => [
          ...prev,
          { type: "output", text: "✗ Authentication failed." },
        ]);
      }
      setPendingUsername("");
      return;
    }

    setHistory((prev) => [...prev, { type: "input", text: typed }]);
    const output = await runCommand(typed);
    if (output !== null) {
      setHistory((prev) => [...prev, { type: "output", text: output }]);
    }
  };

  const promptLabel =
    authMode === "awaiting-username"
      ? "Username:"
      : authMode === "awaiting-password"
      ? "Password:"
      : "abraham@backend:~$";

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-bar">
        <span className="terminal-dot live" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">abraham@backend: ~/portfolio</span>
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {history.map((line, i) =>
          line.type === "input" ? (
            <div key={i} className="terminal-line-input">
              {line.text}
            </div>
          ) : (
            <div key={i} className="terminal-line-output">
              {line.text}
            </div>
          )
        )}
      </div>

      <form className="terminal-form" onSubmit={handleSubmit}>
        <span className="terminal-prompt">{promptLabel}</span>
        <input
          ref={inputRef}
          className="terminal-input focusable"
          type={authMode === "awaiting-password" ? "password" : "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="type 'help'"
          aria-label="Terminal command input"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
}