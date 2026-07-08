import { useState, useRef, useEffect, useCallback } from "react";
import { NAME, ROLE } from "../data/content";
import { useServices } from "../hooks/useServices";
import { useProjects } from "../hooks/useProjects";
import { useSkills } from "../hooks/useSkills";
import "./Terminal.css";

const SKILLS_HELP = `Available commands:
  skills              list my core skills & stack
  services            what I offer
  projects            list recent projects
  projects <name>     details on a specific project
  whoami              who am I
  contact             how to reach me
  clear               clear the terminal`;

export default function SkillsTerminal() {
  const { projects } = useProjects();
  const { skills } = useSkills();
  const { services } = useServices();
  const [history, setHistory] = useState([
  { type: "output", text: "$ connecting to abraham@about..." },
  { type: "output", text: "$ loading skill registry... done" },
  { type: "output", text: "$ loading project index... done" },
  { type: "output", text: "" },
  { type: "output", text: "Query my stack. Type 'help' to get started." },
]);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = useCallback(
    (raw) => {
      const cmd = raw.trim().toLowerCase();
      if (cmd === "") return null;

      if (cmd === "help") return SKILLS_HELP;

      if (cmd === "skills") {
        if (skills.length === 0) return "No skills loaded yet.";
        return skills.map((s) => s.name).join("  ·  ");
      }

      if (cmd === "services") {
        if (services.length === 0) return "No services loaded yet.";
        return services
          .map((s) => `${s.number}  ${s.title} — ${s.subtitle}`)
          .join("\n");
      }

      if (cmd === "projects") {
        if (projects.length === 0) {
          return "No projects loaded yet — check back in a moment.";
        }
        return (
          projects.map((p) => `- ${p.name} (${p.domain})`).join("\n") +
          "\n\nType 'projects <name>' for details."
        );
      }

      if (cmd.startsWith("projects ")) {
        const target = cmd.replace("projects ", "").trim();
        const match = projects.find(
          (p) =>
            String(p.id) === target ||
            p.name.toLowerCase() === target ||
            p.name.toLowerCase().includes(target)
        );
        if (!match) {
          return `No project found matching "${target}". Type 'projects' to see the list.`;
        }
        return `${match.name}\n${match.domain}\n${match.description}`;
      }

      if (cmd === "whoami") {
        return `${NAME} — ${ROLE}.`;
      }

      if (cmd === "contact") {
        return "hello@abrahammutinda.dev — or scroll down, there's a whole form for it.";
      }

      if (cmd === "clear" || cmd === "cls") {
        setHistory([]);
        return null;
      }

      return `bash: command not found: ${cmd}. Type 'help' to see available commands.`;
    },
    [projects, skills, services]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === "") return;
    const output = runCommand(value);
    setHistory((prev) => {
      const next = [...prev, { type: "input", text: value }];
      if (output !== null) next.push({ type: "output", text: output });
      return next;
    });
    setValue("");
  };

  return (
    <div
      className="terminal terminal-compact"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-bar">
        <span className="terminal-dot live" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">abraham@about: ~/skills</span>
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
        <span className="terminal-prompt">abraham@about:~$</span>
        <input
          ref={inputRef}
          className="terminal-input focusable"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="try 'skills' or 'projects'"
          aria-label="Skills terminal command input"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
}