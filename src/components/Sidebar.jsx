const definicoesLinksNavegacao = [
  ["Início", "⌂"],
  ["Descobrir", "⌁"],
  ["Em breve", "◷"],
  ["Filmes", "▰"],
  ["Séries", "◉"],
  ["Ajustes", "⚙"],
];

function BarraLateral({ isSidebarOpen, onSidebarClose }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${isSidebarOpen ? "is-visible" : ""}`}
        onClick={onSidebarClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <nav aria-label="Navegação principal">
          {definicoesLinksNavegacao.map(([rotuloLink, iconeLink], indiceLink) => (
            <a
              key={rotuloLink}
              className={`sidebar-link ${indiceLink === 0 ? "is-active" : ""}`}
              href="#home"
              onClick={onSidebarClose}
            >
              <span aria-hidden="true">{iconeLink}</span>
              <em>{rotuloLink}</em>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
export default BarraLateral;
