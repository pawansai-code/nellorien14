import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import useTranslation from "../../hooks/useTranslation";
import { resetFilters, setEventsTimeFilter } from "../../state/slices/eventsSlice";
import "./EventsPage.css";

const EventsPage = () => {
  const dispatch = useDispatch();
  const {
    timeFilters,
    locationFilters,
    categoryFilters,
    featuredEvents,
    upcomingEvents,
    planAheadEvents,
    todayInfo,
    topDestinations,
    commonAds,
    filterCategories,
    filterDates,
    filterLocations,
    activeFilters,
  } = useSelector((state) => state.events);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTimeFilter, setActiveTimeFilterState] = useState("This Week");
  const { t } = useTranslation();

  /* Local Filter State */
  const [activeLocalFilters, setActiveLocalFilters] = useState({
    category: 'All',
    location: 'All',
    time: 'All'
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Consolidate events for filter extraction
  const allEvents = useMemo(() => {
    return [...featuredEvents, ...upcomingEvents, ...planAheadEvents];
  }, [featuredEvents, upcomingEvents, planAheadEvents]);

  // Extract unique values
  const uniqueLocations = useMemo(() => {
    const locs = new Set(allEvents.map(e => e.location));
    return ['All', ...Array.from(locs)];
  }, [allEvents]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(allEvents.map(e => e.category));
    return ['All', ...Array.from(cats)];
  }, [allEvents]);

  const timeOptions = ['All', 'Today', 'Tomorrow', 'This Week', 'Next Month'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleFilterChange = (key, value) => {
    setActiveLocalFilters(prev => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const handleTimeFilterChange = (filterLabel) => {
    handleFilterChange('time', filterLabel);
    dispatch(setEventsTimeFilter(filterLabel));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setActiveLocalFilters({ category: 'All', location: 'All', time: 'All' });
  };

  const handleEventAction = (event, actionType) => {
    console.log(`Action: ${actionType} for event: ${event.title}`);
  };

  const handleDestinationAction = (destination, actionType) => {
    console.log(`Action: ${actionType} for destination: ${destination.name}`);
  };

  const handleAdClick = (ad) => {
    console.log("Ad clicked:", ad.title);
  };

  const filteredEvents = useMemo(() => {
    let filtered = [...featuredEvents, ...upcomingEvents, ...planAheadEvents];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(term) ||
          event.location?.toLowerCase().includes(term) ||
          event.category?.toLowerCase().includes(term)
      );
    }

    // Filter by Active Local Filters
    if (activeLocalFilters.category !== 'All') {
      filtered = filtered.filter(e => e.category === activeLocalFilters.category);
    }

    if (activeLocalFilters.location !== 'All') {
      filtered = filtered.filter(e => e.location === activeLocalFilters.location);
    }

    if (activeLocalFilters.time !== 'All') {
        // Mock time filtering logic - real implementation depends on date parsing
        // For now, assuming exact match or simple logic if dates were proper objects
        // filtering loosely based on string presence or logic
         if (activeLocalFilters.time === 'Today') {
             // simplified for demo
         }
    }

    return filtered;
  }, [
    featuredEvents,
    upcomingEvents,
    planAheadEvents,
    searchTerm,
    activeFilters,
    activeLocalFilters
  ]);



  return (
    <div className="events-page">
      <TopHeader />
      <MainHeader
        siteName={t('siteName') + ".IN"}
        tagline={t('tagline')}
      />
      <Navbar includeSearch={false} />

      <main className="events-main">
          {/* Header Section */}
          <section className="events-header">
            <div className="events-header-content">
              <div className="events-title-section" ref={dropdownRef}>
                <h1 className="events-title">{t('EventsInNellore')}</h1>
                
                {/* Time Filter */}
                <div className="filter-wrapper">
                    <button 
                        className="events-time-filter-btn"
                        onClick={() => toggleDropdown('time')}
                    >
                        <i className="bi bi-calendar-event"></i> {activeLocalFilters.time === 'All' ? t('Search') : activeLocalFilters.time}
                    </button>
                    {openDropdown === 'time' && (
                        <div className="filter-dropdown">
                            {timeOptions.map(time => (
                                <button
                                    key={time}
                                    className={activeLocalFilters.time === time ? 'selected' : ''}
                                    onClick={() => handleTimeFilterChange(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
              </div>
              <div className="events-header-filters">
                <div className="events-search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder={t('SearchEvents')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="events-quick-filters">
                  {/* Location Filter */}
                  <div className="filter-wrapper">
                      <button 
                        className={`events-location-btn ${activeLocalFilters.location !== 'All' ? 'active' : ''}`}
                        onClick={() => toggleDropdown('location')}
                      >
                        <i className="bi bi-geo-alt"></i> 
                        {activeLocalFilters.location === 'All' ? t('Location') : activeLocalFilters.location}
                      </button>
                      {openDropdown === 'location' && (
                        <div className="filter-dropdown">
                            {uniqueLocations.map(loc => (
                                <button
                                    key={loc}
                                    className={activeLocalFilters.location === loc ? 'selected' : ''}
                                    onClick={() => handleFilterChange('location', loc)}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                      )}
                  </div>

                  {/* Category Filter */}
                  <div className="filter-wrapper">
                      <button 
                        className={`events-filter-btn ${activeLocalFilters.category !== 'All' ? 'active' : ''}`}
                        onClick={() => toggleDropdown('category')}
                      >
                        <i className="bi bi-funnel"></i> 
                        {activeLocalFilters.category === 'All' ? t('SelectCategory') : activeLocalFilters.category}
                      </button>
                      {openDropdown === 'category' && (
                         <div className="filter-dropdown">
                            {uniqueCategories.map(cat => (
                                <button
                                    key={cat}
                                    className={activeLocalFilters.category === cat ? 'selected' : ''}
                                    onClick={() => handleFilterChange('category', cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                         </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </section>


        <div className="container-fluid">
          {/* Content Wrapper */}
          <div className="events-content-wrapper">
            {/* Main Content */}
            <div className="events-main-content">
              {/* Featured Events Section */}
              <section className="events-section">
                <div className="events-section-header">
                  <h2 className="events-section-title">{t('FeaturedEvents')}</h2>
                  <span className="events-section-label">{t('Handpicked')}</span>
                </div>
                <div className="events-featured-grid">
                  {featuredEvents.map((event) => (
                    <div key={event.id} className="events-featured-card">
                      <div className="events-card-image">
                        <img src={event.image} alt={event.title} />
                        <span className="events-card-category">
                          {event.category}
                        </span>
                      </div>
                      <div className="events-card-content">
                        <h3 className="events-card-title">{event.title}</h3>
                        <div className="events-card-details">
                          <span className="events-card-date">{event.date}</span>
                          <span className="events-card-location">
                            {event.location}
                          </span>
                        </div>
                        <div className="events-card-actions">
                          <button
                            className="events-primary-btn"
                            onClick={() =>
                              handleEventAction(event, event.primaryAction)
                            }
                          >
                            {event.primaryAction}
                          </button>
                          <button
                            className="events-secondary-btn"
                            onClick={() =>
                              handleEventAction(event, event.secondaryAction)
                            }
                          >
                            {event.secondaryAction}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Upcoming This Week Section */}
              <section className="events-section">
                <div className="events-section-header">
                  <h2 className="events-section-title">{t('UpcomingThisWeek')}</h2>
                  <span className="events-section-label">{t('NelloreNearby')}</span>
                </div>
                <div className="events-upcoming-list">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="events-upcoming-item">
                      <div className="events-upcoming-content">
                        <h4 className="events-upcoming-title">{event.title}</h4>
                        <div className="events-upcoming-details">
                          <span className="events-upcoming-date">
                            {event.date}
                          </span>
                          <span className="events-upcoming-location">
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <span className="events-upcoming-category">
                        {event.category}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Plan Ahead Section */}
              <section className="events-section">
                <div className="events-section-header">
                  <h2 className="events-section-title">{t('PlanAhead')}</h2>
                  <span className="events-section-label">{t('NextMonth')}</span>
                </div>
                <div className="events-plan-ahead-grid">
                  {planAheadEvents.map((event) => (
                    <div key={event.id} className="events-plan-card">
                      <div className="events-card-image">
                        <img src={event.image} alt={event.title} />
                        <span className="events-card-category">
                          {event.category}
                        </span>
                      </div>
                      <div className="events-card-content">
                        <h3 className="events-card-title">{event.title}</h3>
                        <div className="events-card-details">
                          <span className="events-card-date">{event.date}</span>
                          <span className="events-card-location">
                            {event.location}
                          </span>
                        </div>
                        <div className="events-card-actions">
                          <button
                            className="events-primary-btn"
                            onClick={() =>
                              handleEventAction(event, event.primaryAction)
                            }
                          >
                            {event.primaryAction}
                          </button>
                          <button
                            className="events-secondary-btn"
                            onClick={() =>
                              handleEventAction(event, event.secondaryAction)
                            }
                          >
                            {event.secondaryAction}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Filters Section */}
              {/* Filters Section */}
              <section className="events-filters-section">
                <div className="events-filters-header">
                  <h3 className="events-filters-title">{t('Filters')}</h3>
                  <button 
                    className="events-filters-refine"
                    onClick={() => {
                        handleResetFilters();
                        const topSection = document.querySelector('.events-header');
                        if (topSection) topSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {t('ClearAll')}
                  </button>
                </div>
                <div className="events-filters-content">
                  <div className="events-filter-group">
                    <label className="events-filter-label">{t('SelectCategory')}:</label>
                    <div className="events-filter-options">
                      {uniqueCategories.filter(c => c !== 'All').map((cat, idx) => (
                        <button
                          key={idx}
                          className={`events-filter-option ${
                            activeLocalFilters.category === cat ? "active" : ""
                          }`}
                          onClick={() => handleFilterChange('category', activeLocalFilters.category === cat ? 'All' : cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="events-filter-group">
                    <label className="events-filter-label">{t('PickDates')}:</label>
                    <div className="events-filter-options">
                      {timeOptions.filter(t => t !== 'All').map((date, idx) => (
                        <button
                          key={idx}
                          className={`events-filter-option ${
                            activeLocalFilters.time === date ? "active" : ""
                          }`}
                          onClick={() => handleFilterChange('time', activeLocalFilters.time === date ? 'All' : date)}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="events-filter-group">
                    <label className="events-filter-label">{t('Location')}:</label>
                    <div className="events-filter-options">
                      {uniqueLocations.filter(l => l !== 'All').map((loc, idx) => (
                        <button
                          key={idx}
                          className={`events-filter-option ${
                            activeLocalFilters.location === loc ? "active" : ""
                          }`}
                          onClick={() => handleFilterChange('location', activeLocalFilters.location === loc ? 'All' : loc)}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="events-filters-actions">
                  <button 
                    className="events-apply-btn"
                    onClick={() => {
                        const topSection = document.querySelector('.events-main-content');
                        if (topSection) topSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {t('ViewResults')}
                  </button>
                  <button
                    className="events-reset-btn"
                    onClick={handleResetFilters}
                  >
                    {t('Reset')}
                  </button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="events-sidebar">
              {/* Today in Nellore */}
              <section className="events-sidebar-section">
                <h3 className="events-sidebar-title">{t('TodayInNellore')}</h3>
                <div className="events-today-info">
                  <div className="events-weather-info">
                    <div className="events-info-content">
                      <span className="events-info-label">{t('Weather')}:</span>
                      <span className="events-info-value">
                        {todayInfo.weather.temperature} -{" "}
                        {todayInfo.weather.condition}
                      </span>
                    </div>
                    <button className="events-info-btn">
                      {todayInfo.weather.source}
                    </button>
                  </div>
                  <div className="events-traffic-info">
                    <div className="events-info-content">
                      <span className="events-info-label">{t('Traffic')}:</span>
                      <span className="events-info-value">
                        {todayInfo.traffic.status}
                      </span>
                    </div>
                    <button className="events-info-btn">
                      {todayInfo.traffic.action}
                    </button>
                  </div>
                </div>
              </section>

              {/* Top Destinations */}
              <section className="events-sidebar-section">
                <h3 className="events-sidebar-title">{t('TopDestinations')}</h3>
                <div className="events-destinations-list">
                  {topDestinations.map((destination) => (
                    <div
                      key={destination.id}
                      className="events-destination-card"
                    >
                      <div className="events-destination-image">
                        <img src={destination.image} alt={destination.name} />
                      </div>
                      <div className="events-destination-content">
                        <h4 className="events-destination-name">
                          {destination.name}
                        </h4>
                        <p className="events-destination-desc">
                          {destination.description}
                        </p>
                        <button
                          className="events-destination-btn"
                          onClick={() =>
                            handleDestinationAction(
                              destination,
                              destination.action
                            )
                          }
                        >
                          {destination.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Common Ads */}
              <section className="events-sidebar-section">
                <h3 className="events-sidebar-title">{t('CommonAds')}</h3>
                <div className="events-ads-list">
                  {commonAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="events-ad-card"
                      onClick={() => handleAdClick(ad)}
                    >
                      <div className="events-ad-image">
                        <img src={ad.image} alt={ad.title} />
                      </div>
                      <div className="events-ad-content">
                        <h4 className="events-ad-title">{ad.title}</h4>
                        <button className="events-ad-btn">{ad.action}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer
        siteName={t('siteName') + ".IN"}
        tagline={t('FooterTagline')}
      />
    </div>
  );
};

export default EventsPage;
