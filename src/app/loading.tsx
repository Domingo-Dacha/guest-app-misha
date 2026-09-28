export default function Loading() {
  return (
    <main
      className="loading-page"
      aria-busy="true"
      aria-label="Загрузка страницы"
    >
      <div className="skeleton-card">
        <span />
        <span />
        <span />
      </div>
      <div className="skeleton-card">
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}
