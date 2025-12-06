import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import {
    resetFilters,
    setEventsCategoryFilter,
    setEventsDateFilter,
    setEventsLocationFilter,
    setEventsTimeFilter,
} from "../../state/slices/eventsSlice";
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

  const handleTimeFilterChange = (filterLabel) => {
    setActiveTimeFilterState(filterLabel);
    dispatch(setEventsTimeFilter(filterLabel));
  };

  const handleCategoryFilterChange = (category) => {
    dispatch(
      setEventsCategoryFilter(
        activeFilters.category === category ? null : category
      )
    );
  };

  const handleDateFilterChange = (date) => {
    dispatch(setEventsDateFilter(activeFilters.date === date ? null : date));
  };

  const handleLocationFilterChange = (location) => {
    dispatch(
      setEventsLocationFilter(
        activeFilters.location === location ? null : location
      )
    );
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
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

    if (activeFilters.category) {
      filtered = filtered.filter(
        (event) => event.category === activeFilters.category
      );
    }

    if (activeFilters.location) {
      filtered = filtered.filter(
        (event) => event.location === activeFilters.location
      );
    }

    return filtered;
  }, [
    featuredEvents,
    upcomingEvents,
    planAheadEvents,
    searchTerm,
    activeFilters,
  ]);

  return (
    <div className="events-page">
      <TopHeader />
      <MainHeader
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
      <Navbar includeSearch={false} />

      <main className="events-main">
          {/* Header Section */}
          <section className="events-header">
            <div className="events-header-content">
              <div className="events-title-section">
                <h1 className="events-title">Events in Nellore</h1>
                <button className="events-time-filter-btn">
                  <i className="bi bi-calendar-event"></i> {activeTimeFilter}
                </button>
              </div>
              <div className="events-header-filters">
                <div className="events-search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search events"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="events-quick-filters">
                  <button className="events-location-btn">
                    <i className="bi bi-geo-alt"></i> Nellore, Gudur
                  </button>
                  <button className="events-filter-btn">
                    <i className="bi bi-funnel"></i> Free - Paid - Cultural
                  </button>
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
                  <h2 className="events-section-title">Featured Events</h2>
                  <span className="events-section-label">Handpicked</span>
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
                  <h2 className="events-section-title">Upcoming This Week</h2>
                  <span className="events-section-label">Nellore & Nearby</span>
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
                  <h2 className="events-section-title">Plan Ahead</h2>
                  <span className="events-section-label">Next Month</span>
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
              <section className="events-filters-section">
                <div className="events-filters-header">
                  <h3 className="events-filters-title">Filters</h3>
                  <a href="#" className="events-filters-refine">
                    Refine
                  </a>
                </div>
                <div className="events-filters-content">
                  <div className="events-filter-group">
                    <label className="events-filter-label">Category:</label>
                    <div className="events-filter-options">
                      {filterCategories.map((cat, idx) => (
                        <button
                          key={idx}
                          className={`events-filter-option ${
                            activeFilters.category === cat ? "active" : ""
                          }`}
                          onClick={() => handleCategoryFilterChange(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="events-filter-group">
                    <label className="events-filter-label">Date:</label>
                    <div className="events-filter-options">
                      {filterDates.map((date, idx) => (
                        <button
                          key={idx}
                          className={`events-filter-option ${
                            activeFilters.date === date ? "active" : ""
                          }`}
                          onClick={() => handleDateFilterChange(date)}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="events-filter-group">
                    <label className="events-filter-label">Location:</label>
                    <div className="events-filter-options">
                      {filterLocations.map((loc, idx) => (
                        <button
                          key={idx}
                          className={`events-filter-option ${
                            activeFilters.location === loc ? "active" : ""
                          }`}
                          onClick={() => handleLocationFilterChange(loc)}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="events-filters-actions">
                  <button className="events-apply-btn">Apply</button>
                  <button
                    className="events-reset-btn"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="events-sidebar">
              {/* Today in Nellore */}
              <section className="events-sidebar-section">
                <h3 className="events-sidebar-title">Today in Nellore</h3>
                <div className="events-today-info">
                  <div className="events-weather-info">
                    <div className="events-info-content">
                      <span className="events-info-label">Weather:</span>
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
                      <span className="events-info-label">Traffic:</span>
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
                <h3 className="events-sidebar-title">Top Destinations</h3>
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
                <h3 className="events-sidebar-title">Common Ads</h3>
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
        siteName="NELLORIENS.IN"
        tagline="Your trusted gateway to explore Nellore - connecting you with opportunities, news, and destinations."
      />
    </div>
  );
};

export default EventsPage;
