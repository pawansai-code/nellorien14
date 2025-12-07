import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonPageLayout from "../../components/CommonPageLayout";
import useTranslation from "../../hooks/useTranslation";
import {
    setResultsLoading,
    setResultsPage,
} from "../../state/slices/resultsSlice";
import "./ResultsPage.css";

const ResultsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    resultsList,
    resultsFilters,
    resultsPage,
    recentlyViewed,
    importantLinks,
    resultTools,
  } = useSelector((state) => state.results);

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    board: "AP",
    session: "2024-25",
    sort: "Recent",
  });
  const [rollNumber, setRollNumber] = useState("");

  const filteredResults = useMemo(() => {
    let filtered = resultsList.filter((result) => {
      const matchesFilter =
        activeFilter === "All" || result.category === activeFilter;
      const matchesCategory =
        filters.category === "All" || result.category === filters.category;
      const matchesBoard =
        filters.board === "All" || result.board === filters.board;
      const matchesSession =
        filters.session === "All" || result.session === filters.session;

      if (
        !matchesFilter ||
        !matchesCategory ||
        !matchesBoard ||
        !matchesSession
      ) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          result.title.toLowerCase().includes(term) ||
          result.description.toLowerCase().includes(term) ||
          result.tags.some((tag) => tag.toLowerCase().includes(term))
        );
      }

      return true;
    });

    // Filter options
    if (filters.sort === "Recent") {
      filtered.sort(
        (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
      );
    } else {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [resultsList, activeFilter, filters, searchTerm]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleFilterUpdate = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber === resultsPage.currentPage ||
      pageNumber < 1 ||
      pageNumber > resultsPage.totalPages
    ) {
      return;
    }
    dispatch(setResultsLoading(true));
    setTimeout(() => {
      dispatch(setResultsPage(pageNumber));
      dispatch(setResultsLoading(false));
    }, 400);
  };

  const handleLoadMore = () => {
    if (resultsPage.currentPage >= resultsPage.totalPages) return;
    handlePageChange(resultsPage.currentPage + 1);
  };

  const handleResultAction = (result, actionType) => {
    console.log(`Action: ${actionType} for result: ${result.id}`);
  };

  const handleCheckResult = () => {
    if (rollNumber.trim()) {
      console.log("Checking result for roll number:", rollNumber);
    }
  };

  // Find Section Left
  const findSectionLeft = (
    <>
      <h2 className="results-find-title">{t('FindResultFast')}</h2>
      <p className="results-find-instructions">
        {t('ResultInstructions')}
      </p>
      <div className="results-alert-box">
        <i className="bi bi-exclamation-triangle"></i>
        <span>
          {t('HighTrafficAlert')}
        </span>
      </div>
    </>
  );

  // Find Section Right
  const findSectionRight = (
    <div className="results-quick-actions-panel">
      <h4 className="results-sidebar-title">{t('QuickActions')}</h4>
      <div className="results-roll-input">
        <span className="results-roll-prefix">#</span>
        <input
          type="text"
          placeholder={t('EnterRollNumber')}
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
      </div>
      <div className="results-action-buttons">
        <button className="results-check-btn" onClick={handleCheckResult}>
          <i className="bi bi-search me-2"></i>
          {t('CheckResult')}
        </button>
        <button className="results-download-btn">
          <i className="bi bi-download me-2"></i>
          {t('DownloadScorecard')}
        </button>
      </div>
    </div>
  );

  // Filters Row
  const filtersRow = (
    <>
      <div className="results-filter-dropdown">
        <label>{t('Categories')}:</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterUpdate("category", e.target.value)}
        >
          <option value="All">{t('All')}</option>
          <option value="Schools">{t('Schools')}</option>
          <option value="Universities">{t('Universities')}</option>
          <option value="Govt Exams">{t('GovtExams')}</option>
          <option value="Medical">{t('Medical')}</option>
        </select>
      </div>
      <div className="results-filter-dropdown">
        <label>{t('BoardBody')}:</label>
        <select
          value={filters.board}
          onChange={(e) => handleFilterUpdate("board", e.target.value)}
        >
          <option value="AP">AP</option>
          <option value="TS">TS</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
        </select>
      </div>
      <div className="results-filter-dropdown">
        <label>{t('Session')}:</label>
        <select
          value={filters.session}
          onChange={(e) => handleFilterUpdate("session", e.target.value)}
        >
          <option value="2024-25">2024-25</option>
          <option value="2023-24">2023-24</option>
          <option value="2022-23">2022-23</option>
        </select>
      </div>
      <div className="results-filter-dropdown">
        <label>{t('Sort')}:</label>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterUpdate("sort", e.target.value)}
        >
          <option value="Recent">{t('Recent')}</option>
          <option value="Alphabetical">{t('Alphabetical')}</option>
        </select>
      </div>
    </>
  );

  // Main Content
  const mainContent = (
    <div className="results-list-container">
      {filteredResults.map((result) => (
        <div key={result.id} className="result-card">
          <div className="result-card-header">
            <h3 className="result-card-title">{result.title}</h3>
            <div className="result-card-tags">
              {result.tags.map((tag, idx) => (
                <span key={idx} className="result-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {result.passPercentage && (
            <div className="result-pass-badge">
              {t('PassPercentage')}: {result.passPercentage}
            </div>
          )}
          <p className="result-card-description">{result.description}</p>
          <div className="result-card-actions">
            {result.actions.map((action, idx) => (
              <button
                key={idx}
                className={`result-action-btn ${
                  idx === 0
                    ? "result-action-primary"
                    : "result-action-secondary"
                }`}
                onClick={() => handleResultAction(result, action)}
              >
                {t(action) || action}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Sidebar Content
  const sidebarContent = (
    <>
      {/* result tools section */}
      <div className="results-sidebar-section">
        <div className="results-sidebar-header">
          <h4 className="results-sidebar-title">{t('ResultTools')}</h4>
          <a href="#" className="results-sidebar-link">
            {t('Utilities')}
          </a>
        </div>
        <div className="results-tools-list">
          {resultTools.map((tool) => (
            <div key={tool.id} className="results-tool-item">
              <i className={`bi ${tool.icon}`}></i>
              <span>{t(tool.label) || tool.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* important links section */}
      <div className="results-sidebar-section">
        <div className="results-sidebar-header">
          <h4 className="results-sidebar-title">{t('ImportantLinks')}</h4>
          <a href="#" className="results-sidebar-link">
            {t('Boards')}
          </a>
        </div>
        <div className="results-links-list">
          {importantLinks.map((link) => (
            <a key={link.id} href={link.url} className="results-link-item">
              <i className="bi bi-box-arrow-up-right"></i>
              <span>{t(link.label) || link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* recently viewed section */}
      <div className="results-sidebar-section">
        <div className="results-sidebar-header">
          <h4 className="results-sidebar-title">{t('RecentlyViewed')}</h4>
          <a href="#" className="results-sidebar-link">
            {t('You')}
          </a>
        </div>
        <div className="results-recent-list">
          {recentlyViewed.map((item) => (
            <div key={item.id} className="results-recent-item">
              <i className="bi bi-clock-history"></i>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Pagination
  const pagination = (
    <>
      <span className="results-pagination-status">
        {t('Page')} {resultsPage.currentPage} {t('Of')} {resultsPage.totalPages}
      </span>
      <div className="results-pagination-controls">
        {resultsPage.isLoading ? (
          <>
            <span className="results-loading-text">{t('LoadingMore')}</span>
            <span
              className="spinner-border spinner-border-sm ms-2"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        ) : (
          <>
            <span className="results-loading-text">{t('LoadingMore')}</span>
            <button
              className="results-load-more-btn"
              onClick={handleLoadMore}
              disabled={resultsPage.currentPage >= resultsPage.totalPages}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              {t('LoadMore')}
            </button>
          </>
        )}
      </div>
    </>
  );

  const localizedFilters = resultsFilters.map(f => ({
      ...f,
      label: t(f.label) || f.label
  }));

  return (
    <CommonPageLayout
      pageTitle={t('Results')}
      pageIcon="bi bi-mortarboard"
      pageSubtitle={t('ResultsSubtitle')}
      filterTabs={localizedFilters}
      activeFilter={activeFilter}
      onFilterChange={handleFilterChange}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder={t('SearchResults')}
      includeSearch={true}
      findSectionLeft={findSectionLeft}
      findSectionRight={findSectionRight}
      filtersRow={filtersRow}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
      pagination={pagination}
      footerTagline={t('FooterTagline')}
      includeNavbarSearch={false}
      className="results-page"
      mainClassName="results-page-main"
    />
  );
};

export default ResultsPage;
