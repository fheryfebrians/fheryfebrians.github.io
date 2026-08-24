export const pad = (s, n) =>
    s.length >= n ? s + " " : s + " ".repeat(n - s.length);

export const printHeading = (text) => [
    { text, variant: "heading" },
    { text: "-".repeat(text.length), variant: "dim" },
];

export const findProject = (projects, slug) => {
    const normalized = slug.replace(/^projects\//, "");
    return projects.find((project) => project.slug === normalized);
};