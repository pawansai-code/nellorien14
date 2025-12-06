import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import {
  resetSportsFilters,
  setSportsCategory,
  setSportsRegion,
} from "../../state/slices/sportsSlice";
import "./SportsPage.css";

const SportsPage = () => {
  const dispatch = useDispatch();
  const {
    heroImage,
    categories,
    regions,
    liveScores,
    upcomingFixtures,
    sportsNews,
    newsLines,
    standings,
    sponsored,
    activeFilters,
  } = useSelector((state) => state.sports);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All");

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    dispatch(setSportsCategory(category));
  };

  const handleRegionChange = (region) => {
    setActiveRegion(region);
    dispatch(setSportsRegion(region));
  };

  const handleResetFilters = () => {
    dispatch(resetSportsFilters());
    setActiveCategory("All");
    setActiveRegion("All");
  };

  const filteredFixtures = useMemo(() => {
    let filtered = [...upcomingFixtures];

    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (fixture) => fixture.category === activeCategory
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (fixture) =>
          fixture.title?.toLowerCase().includes(term) ||
          fixture.location?.toLowerCase().includes(term) ||
          fixture.category?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [upcomingFixtures, activeCategory, searchTerm]);

  const filteredNews = useMemo(() => {
    let filtered = [...sportsNews];

    if (activeCategory !== "All") {
      filtered = filtered.filter(
        (news) => news.tag?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((news) =>
        news.title?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [sportsNews, activeCategory, searchTerm]);

  return (
    <div className="sports-page">
      <TopHeader />
      <MainHeader
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
      <Navbar includeSearch={false} />

      <main className="sports-main">
        <div className="container-fluid">
          {/* Top Section: Hero, Filters, and Sidebar */}
          <div className="sports-top-section">
            {/* Filters Section and Hero - placed side-by-side on wide screens */}
            <div className="sports-hero-and-filters">
              <section className="sports-filters-section">
                <div className="sports-filters-row">
                  <div className="sports-search-bar">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search teams, tournaments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="sports-filter-dropdown">
                    <i className="bi bi-funnel"></i>
                    <select
                      value={activeCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.label}>
                          Category: {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sports-filter-dropdown">
                    <i className="bi bi-geo-alt"></i>
                    <select
                      value={activeRegion}
                      onChange={(e) => handleRegionChange(e.target.value)}
                    >
                      {regions.map((region) => (
                        <option key={region.id} value={region.label}>
                          Region: {region.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sports-time-indicator">
                  <i className="bi bi-calendar3"></i>
                  <span>This Week</span>
                </div>
              </section>

              {/* Hero Section */}
              <section className="sports-hero">
                <div
                  className="sports-hero-image"
                  style={{ backgroundImage: `url(${heroImage})` }}
                >
                  <div className="sports-hero-overlay">
                    <button className="sports-hub-btn">
                      <i className="bi bi-trophy"></i>
                      Sports Hub
                    </button>
                    <h1 className="sports-hero-title">
                      Scores, Fixtures, and Local Sports Updates
                    </h1>
                    <p className="sports-hero-subtitle">
                      Cricket, Volleyball, Kabaddi, Athletics and more across
                      Nellore & beyond.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sidebar - News Lines and Standings (beside hero/filters) */}
            <div className="sports-top-sidebar">
              {/* News Lines Section */}
              {/* <section className="sports-sidebar-section">
                <h3 className="sports-sidebar-title">News Lines</h3>
                <div className="sports-news-lines-list">
                  {newsLines.map((line) => (
                    <div key={line.id} className="sports-news-line-item">
                      <i className="bi bi-lightning-charge"></i>
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              </section> */}

              {/* Standings Section */}
              {/* <section className="sports-sidebar-section">
                <h3 className="sports-sidebar-title">
                  Standings - {standings.league}
                </h3>
                <div className="sports-standings-list">
                  {standings.teams.map((team, index) => (
                    <div key={team.id} className="sports-standing-item">
                      <div className="sports-standing-rank">{index + 1}</div>
                      <div className="sports-standing-team">
                        <span className="sports-standing-name">
                          {team.name}
                        </span>
                        <span className="sports-standing-stats">
                          P{team.played}, Pts {team.points}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section> */}
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="sports-content-wrapper">
            {/* Main Content - Left Column */}
            <div className="sports-main-content">
              {/* Live Scores Section */}
              <section className="sports-section">
                <div className="sports-section-header">
                  <h2 className="sports-section-title">Live Scores</h2>
                  <button className="sports-section-action-btn">
                    Updating
                  </button>
                </div>
                <div className="sports-live-scores-list">
                  {liveScores.map((score) => (
                    <div key={score.id} className="sports-score-card">
                      <div className="sports-score-content">
                        <h3 className="sports-score-match">{score.match}</h3>
                        <div className="sports-score-details">
                          <span className="sports-score-sport">
                            {score.sport}
                          </span>
                          <span className="sports-score-score">
                            {score.score}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`sports-score-badge ${score.type.toLowerCase()}`}
                      >
                        {score.type}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Upcoming Fixtures Section */}
              <section className="sports-section">
                <div className="sports-section-header">
                  <h2 className="sports-section-title">Upcoming Fixtures</h2>
                  <button className="sports-section-action-btn">
                    This Week
                  </button>
                </div>
                <div className="sports-fixtures-grid">
                  {filteredFixtures.map((fixture) => (
                    <div key={fixture.id} className="sports-fixture-card">
                      <h4 className="sports-fixture-title">{fixture.title}</h4>
                      <div className="sports-fixture-details">
                        <span className="sports-fixture-date">
                          {fixture.date} - {fixture.location} - {fixture.time}
                        </span>
                      </div>
                      <span className="sports-fixture-category">
                        {fixture.category}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sports News Section */}
              <section className="sports-section">
                <div className="sports-section-header">
                  <h2 className="sports-section-title">Sports News</h2>
                  <button className="sports-section-action-btn">
                    Local & National
                  </button>
                </div>
                <div className="sports-news-grid">
                  {filteredNews.map((news) => (
                    <div key={news.id} className="sports-news-card">
                      <h4 className="sports-news-title">{news.title}</h4>
                      <div className="sports-news-footer">
                        <span className="sports-news-posted">
                          {news.posted}
                        </span>
                        <span className="sports-news-tag">{news.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar - Right Column (only Sponsored now) */}
            <div className="sports-sidebar">


              <section className="sports-sidebar-section">
                <h3 className="sports-sidebar-title">News Lines</h3>
                <div className="sports-news-lines-list">
                  {newsLines.map((line) => (
                    <div key={line.id} className="sports-news-line-item">
                      <i className="bi bi-lightning-charge"></i>
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="sports-sidebar-section">
                <h3 className="sports-sidebar-title">
                  Standings - {standings.league}
                </h3>
                <div className="sports-standings-list">
                  {standings.teams.map((team, index) => (
                    <div key={team.id} className="sports-standing-item">
                      <div className="sports-standing-rank">{index + 1}</div>
                      <div className="sports-standing-team">
                        <span className="sports-standing-name">
                          {team.name}
                        </span>
                        <span className="sports-standing-stats">
                          P{team.played}, Pts {team.points}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* Sponsored Section */}
              {/* <section className="sports-sidebar-section">
                <h3 className="sports-sidebar-title">Sponsored</h3>
                <div className="sports-sponsored-content">
                  <p className="sports-sponsored-text">{sponsored.title}</p>
                  <div className="sports-sponsored-tags">
                    {sponsored.tags.map((tag, idx) => (
                      <span key={idx} className="sports-sponsored-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="sports-sponsored-btn">
                    {sponsored.action}
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </section> */}
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

export default SportsPage;
