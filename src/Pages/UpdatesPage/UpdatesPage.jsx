import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import TopHeader from '../../components/TopHeader';
import MainHeader from '../../components/MainHeader';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './UpdatesPage.css';

const UpdatesPage = () => {
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

  return (
    <div className="updates-page">
      <TopHeader />
      <MainHeader siteName="NELLORIENS.IN" tagline="Explore, Discover, Connect" />
      <Navbar includeSearch={false} />

      <main className="updates-main">
        <div className="container-fluid">
          <section className="updates-hero">
            <div className="updates-heading-left heading-inline">
              <i className="bi bi-exclamation-circle updates-icon"></i>
              <h1 className="updates-eyebrow">Updates</h1>
              <p>
                Latest changes from Jobs, News, Exams, Tourism and more
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
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="updates-search-bar">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search updates"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </section>

          <section className="updates-highlight-card">
            <div className="updates-highlight-left">
              <h1 className="updates-highlight-eyebrow">Stay on top of what's new</h1>
              <p>
                Quick snapshot of the latest additions and changes.
              </p>
              <div className="updates-highlight-meta">
                <span>
                  <i className="bi bi-clock-history me-2"></i>
                  Last sync: 2 mins ago
                </span>


                <span>
                  <i className="bi bi-bell me-2"></i>
                  12 new items
                </span>

                
                <span>
                  <i className="bi bi-funnel me-2"></i>
                  Filters active
                </span>
              </div>
            </div>
            <div className="updates-highlight-status">
              <div className="updates-status-card">
                {updatesStatusIndicators.map((status) => (
                  <div key={status.id} className="updates-status-item">
                    <i className={`bi ${status.icon}`}></i>
                    <span>{status.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </section>

          <section className="updates-filter-row">
            {Object.entries(updatesFilterOptions).map(([filterKey, options]) => (
              <div key={filterKey} className="updates-filter-control">
                <span className="updates-filter-label">
                  {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                </span>
                <select
                  value={filters[filterKey]}
                  onChange={(event) =>
                    handleFilterChange(filterKey, event.target.value)
                  }
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
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
                          {update.category}
                        </span>
                        <span className="update-time">{update.timeLabel}</span>
                      </div>
                      <h5>{update.title}</h5>
                      <p>{update.description}</p>
                      <div className="update-info-row">
                        <span>
                          <i className="bi bi-geo-alt me-2"></i>
                          {update.location}
                        </span>
                        <span>
                          <i className="bi bi-clock me-2"></i>
                          {update.timeframe}
                        </span>
                      </div>
                    </div>
                    <div className="update-actions">
                      <button className="update-action-btn update-action-btn-primary">
                        {update.primaryAction}
                      </button>
                      <button className="update-action-btn update-action-btn-secondary">
                        {update.secondaryAction}
                      </button>
                    </div>
                  </div>
                ))}
                {!preparedUpdates.length && (
                  <div className="updates-empty-state">
                    <p>No updates match your current filters.</p>
                  </div>
                )}
              

              <div className="updates-pagination">
                <span className="updates-pagination-info">
                  Page {updatesPaginationInfo.current} of{' '}
                  {updatesPaginationInfo.total}
                </span>
                <div className="updates-pagination-controls">
                  <div className="updates-loading-indicator">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading more...
                  </div>
                  <button
                    className="btn btn-primary updates-load-more-btn"
                    onClick={handleLoadMoreUpdates}
                  >
                    Load More
                  </button>
                </div>
              </div>
            </div>

            <aside className="updates-sidebar">
              <div className="updates-sidebar-card">
                <div className="updates-sidebar-card-header">
                  <div>
                    <h6>Quick Links</h6>
                    <span>Handpicked</span>
                  </div>
                </div>
                <ul className="updates-sidebar-list">
                  {updatesQuickLinks.map((link) => (
                    <li key={link.id}>
                      <i className={`bi ${link.icon} me-2`}></i>
                      {link.label}
                    </li>
                  ))}
                </ul>

              </div>

              <div className="updates-sidebar-card">
                <div className="updates-sidebar-card-header">
                  <div>
                    <h6>Trending Tags</h6>
                    <span>Now</span>
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
                    <h6>Saved</h6>
                    <span>{updatesSavedItems.length} items</span>
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
              <h6>Update Details</h6>
              <span>Opens on click</span>
            </div>
            {selectedUpdate ? (
              <div className="update-detail-body">
                <div className="update-detail-top">
                  <div>
                    <h4>{selectedUpdate.title}</h4>
                    <p className="update-detail-meta">
                      Posted: {selectedUpdate.detail?.postedOn} · Category:{' '}
                      {selectedUpdate.category} · Location:{' '}
                      {selectedUpdate.location}
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
                <p>No update selected.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer
        siteName="NELLORIENS.IN"
        tagline="Your trusted gateway to explore Nellore - connecting you with opportunities, news, and destinations."
      />
    </div>
  );
};

export default UpdatesPage;