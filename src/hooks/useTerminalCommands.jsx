import { COMMANDS } from "../data/commands";
import { pad, printHeading, findProject } from "../utils/terminalHelpers";
import { PROFILE } from "../data/profile";
import { SERVICES } from "../data/services"
import { SKILLS } from "../data/skills"
import { PROJECTS } from "../data/projects"

export function useTerminalCommands(push, setLines, setShake) {
  const prompt = `${PROFILE.handle}@${PROFILE.host}:~$`;

  const runCommand = (raw, cmdHistory, setCmdHistory, setHistIdx) => {
    const trimmed = raw.trim();

    push([{ text: `${prompt} ${raw}`, variant: "echo" }]);

    if (!trimmed) return;

    setCmdHistory((history) => [...history, trimmed]);
    setHistIdx(null);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const c = cmd.toLowerCase();

    switch (c) {
      case "help": {
        const desc = {
          help: "menampilkan daftar perintah",
          about: "tentang saya",
          whoami: "identitas singkat",
          services: "daftar pelayanan",
          skills: "daftar keahlian",
          projects: "daftar proyek",
          contact: "info kontak",
          ls: "lihat isi direktori",
          cat: "baca isi berkas",
          history: "riwayat perintah",
          date: "tanggal dan waktu",
          clear: "bersihkan layar",
          sudo: "akses administrator",
          exit: "keluar dari terminal",
        };

        push([
          { text: "perintah yang tersedia:", variant: "heading" },
          ...Object.entries(desc).map(([key, value]) => ({
            text: `  ${pad(key, 11)} ${value}`,
            variant: "dim",
          })),
        ]);
        break;
      }

      case "whoami":
        push([
          { text: `${PROFILE.handle} — ${PROFILE.name}`, variant: "heading" },
          { text: `role      ${PROFILE.role}` },
          { text: `location  ${PROFILE.location}` },
        ]);
        break;

      case "about":
      case "cat_about":
        push([
          ...printHeading("about.txt"),
          ...PROFILE.bio.map((text) => ({ text })),
        ]);
        break;

      case "services":
        push([
          ...printHeading("services.txt"),
          ...SERVICES.flatMap((service) => [
            { text: service.name, variant: "heading" },
            { text: service.description },
            { text: "", variant: "dim" },
          ]),
        ]);
        break;

      case "skills":
        push([
          ...printHeading("skills.txt"),
          ...SKILLS.map((skill) => ({
            text: `${pad(skill.group + ":", 12)} ${skill.items.join(", ")}`,
          })),
        ]);
        break;

      case "projects":
        push([
          ...printHeading("projects/"),
          ...PROJECTS.map((project) => ({
            text: `  ${pad(project.slug, 38)} ${project.title} (${project.year})`,
          })),
          { text: "", variant: "dim" },
          { text: "→ ketik 'cat projects/<nama>.md' untuk detail", variant: "dim" },
        ]);
        break;

      case "contact":
        push([
          ...printHeading("contact.txt"),
          { text: `email      ${PROFILE.email}`, href: `mailto:${PROFILE.email}` },
          { text: `github     ${PROFILE.github}`, href: PROFILE.github },
          { text: `linkedin   ${PROFILE.linkedin}`, href: PROFILE.linkedin },
          { text: `whatsapp   ${PROFILE.whatsapp}`, href: PROFILE.whatsapp },
          { text: `lokasi     ${PROFILE.location}` },
          { text: "telepon    081-214-585-744" },
        ]);
        break;

      case "ls": {
        if (args[0] === "projects") {
          push([{ text: PROJECTS.map((project) => project.slug).join("   ") }]);
        } else {
          push([{ text: "about.txt   services.txt   skills.txt   contact.txt   projects/" }]);
        }
        break;
      }

      case "cat": {
        if (!args[0]) {
          push([{ text: "cat: berkas tidak disebutkan", variant: "error" }]);
          break;
        }

        const file = args[0];

        if (file === "about.txt") {
          push([
            ...printHeading("about.txt"),
            ...PROFILE.bio.map((text) => ({ text })),
          ]);
        } else if (file === "services.txt") {
          push([
            ...printHeading("services.txt"),
            ...SERVICES.flatMap((service) => [
              { text: service.name, variant: "heading" },
              { text: service.description },
              { text: "", variant: "dim" },
            ]),
          ]);
        } else if (file === "skills.txt") {
          push([
            ...printHeading("skills.txt"),
            ...SKILLS.map((skill) => ({
              text: `${pad(skill.group + ":", 12)} ${skill.items.join(", ")}`,
            })),
          ]);
        } else if (file === "contact.txt") {
          push([
            ...printHeading("contact.txt"),
            { text: `email      ${PROFILE.email}`, href: `mailto:${PROFILE.email}` },
            { text: `github     ${PROFILE.github}`, href: PROFILE.github },
            { text: `linkedin   ${PROFILE.linkedin}`, href: PROFILE.linkedin },
            { text: `whatsapp   ${PROFILE.whatsapp}`, href: PROFILE.whatsapp },
            { text: `lokasi     ${PROFILE.location}` },
            { text: "telepon    081-214-585-744" },
          ]);
        } else if (file.startsWith("projects/")) {
          const project = findProject(PROJECTS, file);

          if (!project) {
            push([{ text: `cat: ${file}: berkas tidak ditemukan`, variant: "error" }]);
          } else {
            push([
              ...printHeading(project.slug),
              { text: project.title, variant: "heading" },
              { text: `tahun     ${project.year}` },
              { text: `peran     ${project.role}` },
              { text: `stack     ${project.stack}` },
              { text: "" },
              { text: project.link },
              ...(project.url ? [{ text: `website   ${project.url}`, href: project.url }] : []),
            ]);
          }
        } else {
          push([{ text: `cat: ${file}: berkas tidak ditemukan`, variant: "error" }]);
        }
        break;
      }

      case "history":
        push(
          cmdHistory.length
            ? cmdHistory.map((history, index) => ({
                text: `  ${index + 1}  ${history}`,
                variant: "dim",
              }))
            : [{ text: "riwayat kosong", variant: "dim" }]
        );
        break;

      case "date":
        push([{ text: new Date().toLocaleString("id-ID") }]);
        break;

      case "sudo":
        setShake(true);
        setTimeout(() => setShake(false), 400);
        push([
          { text: `${PROFILE.handle} tidak terdaftar di file sudoers. Kejadian ini akan dilaporkan.`, variant: "error" },
          { text: "(tenang, ini cuma portofolio)", variant: "dim" },
        ]);
        break;

      case "exit":
      case "logout":
        push([{ text: "tidak bisa keluar dari sini — ini portofolio, bukan sesi SSH ;)", variant: "dim" }]);
        break;

      case "clear":
        setLines([]);
        return;

      default:
        push([
          { text: `bash: ${c}: perintah tidak ditemukan`, variant: "error" },
          { text: "ketik 'help' untuk melihat daftar perintah.", variant: "dim" },
        ]);
    }
  };

  const handleKeyDown = (e, input, setInput, cmdHistory, setCmdHistory, histIdx, setHistIdx) => {
    if (e.key === "Enter") {
      runCommand(input, cmdHistory, setCmdHistory, setHistIdx); // 👈 Teruskan setCmdHistory di sini
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const idx = histIdx === null ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(cmdHistory[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const idx = histIdx + 1;
      if (idx >= cmdHistory.length) {
        setHistIdx(null);
        setInput("");
      } else {
        setHistIdx(idx);
        setInput(cmdHistory[idx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;

      const matches = COMMANDS.filter((command) => command.startsWith(partial));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      } else if (matches.length > 1) {
        push([{ text: matches.join("   "), variant: "dim" }]);
      }
    }
  };

  return { prompt, runCommand, handleKeyDown };
}