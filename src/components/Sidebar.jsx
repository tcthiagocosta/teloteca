const navigationLinkDefinitions = [
  ["Início", "⌂"],
  ["Descobrir", "⌁"],
  ["Em breve", "◷"],
  ["Filmes", "▰"],
  ["Séries", "◉"],
  ["Ajustes", "⚙"],
];

function Sidebar({ isSidebarOpen, onSidebarClose }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${isSidebarOpen ? "is-visible" : ""}`}
        onClick={onSidebarClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <nav aria-label="Navegação principal">
          {navigationLinkDefinitions.map(([linkLabel, linkIcon], linkIndex) => (
            <a
              key={linkLabel}
              className={`sidebar-link ${linkIndex === 0 ? "is-active" : ""}`}
              href="#home"
              onClick={onSidebarClose}
            >
              <span aria-hidden="true">{linkIcon}</span>
              <em>{linkLabel}</em>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
export default Sidebar;
