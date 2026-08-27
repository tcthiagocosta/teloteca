const links = [
  ["Início", "⌂"],
  ["Descobrir", "⌁"],
  ["Em breve", "◷"],
  ["Filmes", "▰"],
  ["Séries", "◉"],
  ["Ajustes", "⚙"],
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
        <nav aria-label="Navegação principal">
          {links.map(([label, icon], index) => (
            <a
              key={label}
              className={`sidebar-link ${index === 0 ? "is-active" : ""}`}
              href="#home"
              onClick={onClose}
            >
              <span aria-hidden="true">{icon}</span>
              <em>{label}</em>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
export default Sidebar;
