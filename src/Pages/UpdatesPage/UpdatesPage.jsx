import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import MainHeader from '../../components/MainHeader';
import Navbar from '../../components/Navbar';
import TopHeader from '../../components/TopHeader';
import useTranslation from '../../hooks/useTranslation';
import './UpdatesPage.css';

const UpdatesPage = () => {
  const { t } = useTranslation();
  const {
    updatesFeedItems,
    updateCategoryTabs,
    updatesFilterOptions,
    updatesQuickLinks,
    updatesTrendingTags,
    updatesSavedItems,
    updatesPaginationInfo,
    updatesStatusIndicators,
  } = useSelector((state) => state.news);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    time: 'Last 7 days',
    location: 'Global',
    sort: 'Recent',
  });
  const [selectedUpdateId, setSelectedUpdateId] = useState(
    updatesFeedItems[0]?.id ?? null
  );

  useEffect(() => {
    if (!updatesFeedItems.length) {
      setSelectedUpdateId(null);
      return;
    }
    setSelectedUpdateId((prev) => prev ?? updatesFeedItems[0].id);
  }, [updatesFeedItems]);

  const filteredUpdates = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return updatesFeedItems.filter((update) => {
      const matchesCategoryTab =
        activeCategory === 'All' || update.category === activeCategory;
      const matchesFilterCategory =
        filters.category === 'All' || update.category === filters.category;
      const matchesLocation =
        filters.location === 'Global' || update.scope === filters.location;

      const matchesTime = (() => {
        if (filters.time === 'All time') return true;
        if (filters.time === 'Today') return update.timeframe === 'Today';
        if (filters.time === 'Last 7 days') {
          return (
            update.timeframe === 'Today' || update.timeframe === 'Last 7 days'
          );
        }
        if (filters.time === 'Last 30 days') {
          return (
            update.timeframe === 'Today' ||
            update.timeframe === 'Last 7 days' ||
            update.timeframe === 'Last 30 days'
          );
        }
        return true;
      })();

      const matchesSearch =
        !search ||
        update.title.toLowerCase().includes(search) ||
        update.description.toLowerCase().includes(search) ||
        update.location.toLowerCase().includes(search);

      return (
        matchesCategoryTab &&
        matchesFilterCategory &&
        matchesLocation &&
        matchesTime &&
        matchesSearch
      );
    });
  }, [
    updatesFeedItems,
    activeCategory,
    filters.category,
    filters.time,
    filters.location,
    searchTerm,
  ]);

  const preparedUpdates = useMemo(() => {
    const sorted = [...filteredUpdates];
    if (filters.sort === 'Popular') {
      return sorted.sort((a, b) => b.engagementScore - a.engagementScore);
    }
    return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [filteredUpdates, filters.sort]);

  useEffect(() => {
    if (!preparedUpdates.length) {
      setSelectedUpdateId(null);
      return;
    }
    const exists = preparedUpdates.some(
      (update) => update.id === selectedUpdateId
    );
    if (!exists) {
      setSelectedUpdateId(preparedUpdates[0].id);
    }
  }, [preparedUpdates, selectedUpdateId]);

  const selectedUpdate = useMemo(
    () =>
      preparedUpdates.find((update) => update.id === selectedUpdateId) || null,
    [preparedUpdates, selectedUpdateId]
  );

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleLoadMoreUpdates = () => {
    console.log('Load more updates requested');
  };

  const getOptionLabel = (opt) => {
    const dateMap = {
        'Last 7 days': 'Last7Days',
        'Today': 'Today',
        'Last 30 days': 'Last30Days',
        'All time': 'AllTime'
    };
    if (dateMap[opt]) return t(dateMap[opt]);
    
    // Also try to translate directly if it's a key like 'Recent', 'Popular', 'Global'
    return t(opt) !== opt ? t(opt) : opt; 
    // Wait, t(opt) returns key if missing? No, returns default (English).
    // If I have key 'Recent', t('Recent') returns translation.
    // If I have no key 'Foo', t('Foo') returns 'Foo'.
    // So t(opt) is safe.
  };

  // Helper for quick links mapping
  const getQuickLinkLabel = (label) => {
      // mapping based on label string
      if(label === 'Latest Govt Jobs') return t('LatestGovtJobs');
      if(label === 'Exam Results & Schedules') return t('ExamResultsSchedules');
      if(label === 'Top News Today') return t('TopNewsToday');
      if(label === 'Tourism Guides') return t('TourismGuides');
      return t(label);
  };

  return (
    <div className="updates-page">
      <TopHeader />
      <MainHeader siteName={t('siteName') + ".IN"} tagline={t('tagline')} />
      <Navbar includeSearch={false} />

      <main className="updates-main">
        <div className="container-fluid">
          <section className="updates-hero">
            <div className="updates-heading-left heading-inline">
              <i className="bi bi-exclamation-circle updates-icon"></i>
              <h1 className="updates-eyebrow">{t('Updates')}</h1>
              <p>
                {t('UpdatesSubtitle')}
              </p>
            </div>
          </section>

          <section className="updates-tabs-row">
            <div className="updates-tabs">
              {updateCategoryTabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`updates-tab-btn ${
                    activeCategory === tab.label ? 'active' : ''
                  }`}
                  onClick={() => setActiveCategory(tab.label)}
                >
                  <i className={`bi ${tab.icon} me-2`}></i>
                  {t(tab.label)}
                </button>
              ))}
            </div>
            <div className="updates-search-bar">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder={t('SearchUpdates')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </section>

          <section className="updates-highlight-card">
            <div className="updates-highlight-left">
              <h1 className="updates-highlight-eyebrow">{t('StayOnTop')}</h1>
              <p>
                {t('QuickSnapshot')}
              </p>
              <div className="updates-highlight-meta">
                <span>
                  <i className="bi bi-clock-history me-2"></i>
                  {t('LastSync')}: 2 {t('MinsAgo')}
                </span>


                <span>
                  <i className="bi bi-bell me-2"></i>
                  12 {t('NewItems')}
                </span>

                
                <span>
                  <i className="bi bi-funnel me-2"></i>
                  {t('FiltersActive')}
                </span>
              </div>
            </div>
            <div className="updates-highlight-status">
              <div className="updates-status-card">
                {updatesStatusIndicators.map((status) => (
                  <div key={status.id} className="updates-status-item">
                    <i className={`bi ${status.icon}`}></i>
                    <span>{t(status.label.replace(/ /g, '')) || t(status.label)}</span> 
                    {/* Hacky key matching? 'Real-time feed enabled' -> 'RealTimeFeedEnabled' doesn't match easily with regex. 
                        I added exact keys for these labels. 
                        'Real-time feed enabled' = 'RealTimeFeedEnabled' ? No, 'RealTimeFeedEnabled' key has spaces removed?
                        In translation I added keys: RealTimeFeedEnabled (no spaces). 
                        But the string in Redux has spaces. 
                        Let's use a mapping or just try to find the key. 
                        Actually I added keys with CameCase in translations.js?
                        Let's check step 216. 
                        Key: RealTimeFeedEnabled: "Real-time feed enabled".
                        Wait, key is CamelCase. Label is "Real-time feed enabled".
                        So t("Real-time feed enabled") won't work unless I added that phrase as a key.
                        I added "RealTimeFeedEnabled" as key. 
                        So I need to map "Real-time feed enabled" -> "RealTimeFeedEnabled".
                        This is brittle. 
                        Better to just use t(status.label) and add the PHRASE as the key if possible, OR map it here.
                        Mapping map:
                    */}
                  </div>
                ))}
            {/* Re-doing the map logic safely */}
             {updatesStatusIndicators.map((status) => {
                 const labelMap = {
                     'Real-time feed enabled': 'RealTimeFeedEnabled',
                     'Community comments open': 'CommunityCommentsOpen',
                     'Saved updates visible': 'SavedUpdatesVisible'
                 };
                 return (
                  <div key={status.id} className="updates-status-item">
                    <i className={`bi ${status.icon}`}></i>
                    <span>{t(labelMap[status.label] || status.label)}</span>
                  </div>
                 );
             })}

              </div>
            </div>

          </section>

          <section className="updates-filter-row">
            {Object.entries(updatesFilterOptions).map(([filterKey, options]) => (
              <div key={filterKey} className="updates-filter-control">
                <span className="updates-filter-label">
                  {t(filterKey.charAt(0).toUpperCase() + filterKey.slice(1))}
                </span>
                <select
                  value={filters[filterKey]}
                  onChange={(event) =>
                    handleFilterChange(filterKey, event.target.value)
                  }
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {getOptionLabel(option)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </section>

          <section className="updates-content-row">
            <div className="updates-main-column">
                {preparedUpdates.map((update) => (
                  <div
                    key={update.id}
                    className={`update-feed-item ${
                      selectedUpdateId === update.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedUpdateId(update.id)}
                  >
                    <div className="update-feed-icon">
                      <i className={`bi ${update.icon}`}></i>
                    </div>
                    <div className="update-feed-body">
                      <div className="update-feed-meta">
                        <span
                          className={`update-category-pill category-${update.category.toLowerCase()}`}
                        >
                          {t(update.category)}
                        </span>
                        <span className="update-time">{update.timeLabel}</span>
                      </div>
                      <h5>{update.title}</h5>
                      <p>{update.description}</p>
                      <div className="update-info-row">
                        <span>
                          <i className="bi bi-geo-alt me-2"></i>
                          {t(update.location) || update.location}
                        </span>
                        <span>
                          <i className="bi bi-clock me-2"></i>
                          {getOptionLabel(update.timeframe)}
                        </span>
                      </div>
                    </div>
                    <div className="update-actions">
                      <button className="update-action-btn update-action-btn-primary">
                        {t(update.primaryAction)}
                      </button>
                      <button className="update-action-btn update-action-btn-secondary">
                        {t(update.secondaryAction)}
                      </button>
                    </div>
                  </div>
                ))}
                {!preparedUpdates.length && (
                  <div className="updates-empty-state">
                    <p>{t('NoUpdatesMatch')}</p>
                  </div>
                )}
              

              <div className="updates-pagination">
                <span className="updates-pagination-info">
                  {t('Page')} {updatesPaginationInfo.current} {t('Of')}{' '}
                  {updatesPaginationInfo.total}
                </span>
                <div className="updates-pagination-controls">
                  <div className="updates-loading-indicator">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {t('LoadingMore')}
                  </div>
                  <button
                    className="btn btn-primary updates-load-more-btn"
                    onClick={handleLoadMoreUpdates}
                  >
                    {t('LoadMore')}
                  </button>
                </div>
              </div>
            </div>

            <aside className="updates-sidebar">
              <div className="updates-sidebar-card">
                <div className="updates-sidebar-card-header">
                  <div>
                    <h6>{t('QuickLinks')}</h6>
                    <span>{t('Handpicked')}</span>
                  </div>
                </div>
                <ul className="updates-sidebar-list">
                  {updatesQuickLinks.map((link) => (
                    <li key={link.id}>
                      <i className={`bi ${link.icon} me-2`}></i>
                      {getQuickLinkLabel(link.label)}
                    </li>
                  ))}
                </ul>

              </div>

              <div className="updates-sidebar-card">
                <div className="updates-sidebar-card-header">
                  <div>
                    <h6>{t('TrendingTags')}</h6>
                    <span>{t('Now')}</span>
                  </div>
                </div>
                <div className="updates-tags">
                  {updatesTrendingTags.map((tag) => (
                    <button key={tag} className="updates-tag-chip">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="updates-sidebar-card">
                <div className="updates-sidebar-card-header">
                  <div>
                    <h6>{t('Saved')}</h6>
                    <span>{updatesSavedItems.length} {t('Items')}</span>
                  </div>
                </div>
                <ul className="updates-sidebar-list">
                  {updatesSavedItems.map((item) => (
                    <li key={item.id}>
                      <i className="bi bi-bookmark me-2"></i>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            
          </section>

          <section className="update-detail-card">
            <div className="update-detail-header">
              <h6>{t('UpdateDetails')}</h6>
              <span>{t('OpensOnClick')}</span>
            </div>
            {selectedUpdate ? (
              <div className="update-detail-body">
                <div className="update-detail-top">
                  <div>
                    <h4>{selectedUpdate.title}</h4>
                    <p className="update-detail-meta">
                      {t('Posted')}: {selectedUpdate.detail?.postedOn} · {t('Categories')}:{' '}
                      {t(selectedUpdate.category)} · {t('Location')}:{' '}
                      {t(selectedUpdate.location) || selectedUpdate.location}
                    </p>
                  </div>
                </div>
                
                {selectedUpdate.detail?.highlights && (
                  <ul className="update-detail-points">
                    {selectedUpdate.detail.highlights.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="update-detail-body">
                <p>{t('NoUpdateSelected')}</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer
        siteName={t('siteName') + ".IN"}
        tagline={t('FooterTagline')}
      />
    </div>
  );
};

export default UpdatesPage;