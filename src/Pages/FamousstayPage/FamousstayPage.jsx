import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import { updateFilters } from "../../state/slices/famousStaysSlice";
import "./FamousstayPage.css";

const FamousstayPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    topPicks = [],
    quickFilters = [],
    nearbyFoods = [],
    commonAds = [],
    mapNearbyFilters = [],
    filters: reduxFilters,
  } = useSelector((state) => state.famousStays || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [activeNearbyFilter, setActiveNearbyFilter] = useState(null);

  // Filter logic
  const filteredStays = useMemo(() => {
    let filtered = [...topPicks];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (stay) =>
          stay.name?.toLowerCase().includes(q) ||
          stay.location?.toLowerCase().includes(q) ||
          stay.amenities?.some((amenity) => amenity.toLowerCase().includes(q))
      );
    }

    // Rating filter
    if (reduxFilters.rating === "4.0+") {
      filtered = filtered.filter((stay) => stay.rating >= 4.0);
    }

    // WiFi filter
    if (reduxFilters.freeWiFi) {
      filtered = filtered.filter((stay) =>
        stay.amenities?.some((a) => a.toLowerCase().includes("wi-fi"))
      );
    }

    // Breakfast filter
    if (reduxFilters.breakfast) {
      filtered = filtered.filter((stay) =>
        stay.amenities?.some((a) => a.toLowerCase().includes("breakfast"))
      );
    }

    // Parking filter
    if (reduxFilters.parking) {
      filtered = filtered.filter((stay) =>
        stay.amenities?.some((a) => a.toLowerCase().includes("parking"))
      );
    }

    return filtered;
  }, [topPicks, searchTerm, reduxFilters]);

  const handleFilterToggle = (filterKey) => {
    if (filterKey === "rating") {
      dispatch(
        updateFilters({
          rating: reduxFilters.rating === "4.0+" ? "All" : "4.0+",
        })
      );
    } else {
      dispatch(
        updateFilters({
          [filterKey]: !reduxFilters[filterKey],
        })
      );
    }
  };

  const handleStayAction = (stay, action) => {
    console.log(`${action} for ${stay.name}`);
    if (action === "Book now" || action === "Check availability") {
      navigate(`/stays/${stay.id}/book`);
    }
  };

  const handleFoodClick = (food) => {
    console.log("Navigate to:", food.name);
    navigate(`/food/${food.id}`);
  };

  const handleAdClick = (ad) => {
    console.log("Ad clicked:", ad.title);
  };

  const handleViewCityMap = () => {
    console.log("View city map clicked");
    // Navigate to map view or open map modal
  };

  return (
    <div className="famousstay-page">
      <TopHeader />
      <MainHeader
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
      <Navbar includeSearch={false} />

      <main className="famousstay-main">
        {/* Hero Header Section */}
        <section className="famousstay-hero">
          <div className="famousstay-hero-banner">
            <div className="famousstay-hero-content">
              <h1 className="famousstay-hero-title">Famous Stays in Nellore</h1>
              <p className="famousstay-hero-subtitle">
                Curated hotels, heritage stays, and budget picks—close to food
                streets and historic landmarks.
              </p>

              <div className="famousstay-search-controls">
                <div className="famousstay-search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search hotel, area, landmark."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="famousstay-filter-btn">
                  <i className="bi bi-funnel"></i>
                  Price - Rating - Near
                </button>
                <button
                  className="famousstay-map-btn"
                  onClick={handleViewCityMap}
                >
                  View city map
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container-fluid">
          <div className="famousstay-content-wrapper">
            {/* Main Content */}
            <div className="famousstay-main-content">
              {/* Top Picks Section */}
              <section className="famousstay-top-picks">
                <div className="famousstay-section-header">
                  <div>
                    <h2 className="famousstay-section-title">Top Picks</h2>
                    <span className="famousstay-editor-label">
                      Editor's choice
                    </span>
                  </div>
                </div>

                <div className="famousstay-stays-grid">
                  {filteredStays.map((stay) => (
                    <div key={stay.id} className="famousstay-stay-card">
                      <div className="famousstay-stay-image">
                        <img src={stay.image} alt={stay.name} />
                        {stay.isEditorChoice && (
                          <span className="famousstay-editor-badge">
                            Editor's choice
                          </span>
                        )}
                      </div>
                      <div className="famousstay-stay-body">
                        <div className="famousstay-stay-header">
                          <h3 className="famousstay-stay-name">{stay.name}</h3>
                          <div className="famousstay-stay-rating">
                            <i className="bi bi-star-fill"></i>
                            <span>{stay.rating}</span>
                          </div>
                        </div>
                        <p className="famousstay-stay-location">
                          <i className="bi bi-geo-alt"></i>
                          {stay.location}
                        </p>
                        <p className="famousstay-stay-price">
                          ₹{stay.price.toLocaleString()}/{stay.priceUnit}
                        </p>
                        <div className="famousstay-stay-amenities">
                          {stay.amenities.map((amenity, idx) => (
                            <span key={idx} className="famousstay-amenity-tag">
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="famousstay-stay-actions">
                          {stay.actions.map((action, idx) => (
                            <button
                              key={idx}
                              className={`famousstay-action-btn ${
                                idx === 0
                                  ? "famousstay-action-primary"
                                  : "famousstay-action-secondary"
                              }`}
                              onClick={() => handleStayAction(stay, action)}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Map & Nearby Section */}
              <section className="famousstay-map-section">
                <div className="famousstay-section-header">
                  <h2 className="famousstay-section-title">Map & Nearby</h2>
                  <button className="famousstay-explore-btn">Explore</button>
                </div>
                <div className="famousstay-map-container">
                  <div className="famousstay-map-placeholder">
                    <i className="bi bi-map"></i>
                    <p>Interactive Map View</p>
                  </div>
                </div>
                <div className="famousstay-nearby-filters">
                  <span className="famousstay-nearby-label">
                    Show stays near:
                  </span>
                  <div className="famousstay-nearby-buttons">
                    {mapNearbyFilters.map((filter) => (
                      <button
                        key={filter.id}
                        className={`famousstay-nearby-btn ${
                          activeNearbyFilter === filter.id ? "active" : ""
                        }`}
                        onClick={() =>
                          setActiveNearbyFilter(
                            activeNearbyFilter === filter.id ? null : filter.id
                          )
                        }
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  <button className="famousstay-refine-btn">Refine</button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="famousstay-sidebar">
              {/* Quick Filters */}
              <div className="famousstay-sidebar-section">
                <h4 className="famousstay-sidebar-title">Quick Filters</h4>
                <div className="famousstay-filters-grid">
                  {quickFilters.map((filter) => (
                    <button
                      key={filter.id}
                      className={`famousstay-filter-chip ${
                        (filter.label === "Rating 4.0+" &&
                          reduxFilters.rating === "4.0+") ||
                        (filter.label === "Free Wi-Fi" &&
                          reduxFilters.freeWiFi) ||
                        (filter.label === "Breakfast" &&
                          reduxFilters.breakfast) ||
                        (filter.label === "Parking" && reduxFilters.parking)
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        if (filter.label === "Rating 4.0+") {
                          handleFilterToggle("rating");
                        } else if (filter.label === "Free Wi-Fi") {
                          handleFilterToggle("freeWiFi");
                        } else if (filter.label === "Breakfast") {
                          handleFilterToggle("breakfast");
                        } else if (filter.label === "Parking") {
                          handleFilterToggle("parking");
                        }
                      }}
                    >
                      <i className={`bi ${filter.icon}`}></i>
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nearby Famous Foods */}
              <div className="famousstay-sidebar-section">
                <h4 className="famousstay-sidebar-title">
                  Nearby Famous Foods
                </h4>
                <div className="famousstay-foods-list">
                  {nearbyFoods.map((food) => (
                    <div
                      key={food.id}
                      className="famousstay-food-item"
                      onClick={() => handleFoodClick(food)}
                    >
                      <div className="famousstay-food-image">
                        <img src={food.image} alt={food.name} />
                      </div>
                      <div className="famousstay-food-content">
                        <h5 className="famousstay-food-name">{food.name}</h5>
                        <p className="famousstay-food-desc">
                          {food.description}
                        </p>
                        <span
                          className={`famousstay-food-label ${food.label.toLowerCase()}`}
                        >
                          {food.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Ads */}
              <div className="famousstay-sidebar-section">
                <h4 className="famousstay-sidebar-title">Common Ads</h4>
                <div className="famousstay-ads-list">
                  {commonAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="famousstay-ad-card"
                      onClick={() => handleAdClick(ad)}
                    >
                      <div className="famousstay-ad-image">
                        <img src={ad.image} alt={ad.title} />
                      </div>
                      <div className="famousstay-ad-content">
                        <h5 className="famousstay-ad-title">{ad.title}</h5>
                        <button className="famousstay-ad-btn">
                          {ad.actionLabel}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer
        siteName="NELLORIENS.IN"
        tagline="Your trusted gateway for updates, alerts & information across Nellore."
      />
    </div>
  );
};

export default FamousstayPage;
