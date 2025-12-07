import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import useTranslation from '../../hooks/useTranslation';
import { updateFilters } from "../../state/slices/famousStaysSlice";
import "./FamousstayPage.css";

const FamousstayPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
  const [activeFilters, setActiveFilters] = useState({
    price: 'All',
    rating: 'All',
    location: 'All'
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Extract unique locations from stays
  const uniqueLocations = useMemo(() => {
    // Extract unique locations. Assuming stay.location is a string.
    const locs = new Set(topPicks.map(stay => stay.location));
    return ['All', ...Array.from(locs)];
  }, [topPicks]);

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

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const handleLocalFilterChange = (type, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setOpenDropdown(null);
  };

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

    // Rating filter (Redux)
    if (reduxFilters.rating === "4.0+") {
      filtered = filtered.filter((stay) => stay.rating >= 4.0);
    }

    // New Filter Logic from Top Dropdowns
    
    // Price Filter
    if (activeFilters.price !== 'All') {
      if (activeFilters.price === '< ₹2000') {
        filtered = filtered.filter(stay => stay.price < 2000);
      } else if (activeFilters.price === '₹2000 - ₹5000') {
        filtered = filtered.filter(stay => stay.price >= 2000 && stay.price <= 5000);
      } else if (activeFilters.price === '> ₹5000') {
        filtered = filtered.filter(stay => stay.price > 5000);
      }
    }

    // Rating Filter (Dropdown)
    if (activeFilters.rating !== 'All') {
      if (activeFilters.rating === '4.0+') {
        filtered = filtered.filter(stay => stay.rating >= 4.0);
      } else if (activeFilters.rating === '4.5+') {
        filtered = filtered.filter(stay => stay.rating >= 4.5);
      }
    }

    // Location Filter
    if (activeFilters.location !== 'All') {
      filtered = filtered.filter(stay => stay.location === activeFilters.location);
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
  }, [topPicks, searchTerm, reduxFilters, activeFilters]);

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
    const mapSection = document.querySelector('.famousstay-map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="famousstay-page">
      <TopHeader />
      <MainHeader
        siteName={t('siteName') + ".IN"}
        tagline={t('tagline')}
      />
      <Navbar includeSearch={false} />

      <main className="famousstay-main">
        {/* Hero Header Section */}
        <section className="famousstay-hero">
          <div className="famousstay-hero-banner">
            <div className="famousstay-hero-content">
              <h1 className="famousstay-hero-title">{t('FamousStaysInNellore')}</h1>
              <p className="famousstay-hero-subtitle">
                {t('StaysSubtitle')}
              </p>

              <div className="famousstay-search-controls" ref={dropdownRef}>
                <div className="famousstay-search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder={t('SearchHotel')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Price Filter */}
                <div className="filter-wrapper">
                  <button 
                    className={`famousstay-filter-btn ${activeFilters.price !== 'All' || openDropdown === 'price' ? 'active' : ''}`}
                    onClick={() => toggleDropdown('price')}
                  >
                    <i className="bi bi-tag"></i>
                    {activeFilters.price === 'All' ? 'Price' : activeFilters.price}
                  </button>
                  {openDropdown === 'price' && (
                    <div className="filter-dropdown">
                      {['All', '< ₹2000', '₹2000 - ₹5000', '> ₹5000'].map(price => (
                        <button 
                          key={price}
                          className={activeFilters.price === price ? 'selected' : ''}
                          onClick={() => handleLocalFilterChange('price', price)}
                        >
                          {price}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="filter-wrapper">
                  <button 
                    className={`famousstay-filter-btn ${activeFilters.rating !== 'All' || openDropdown === 'rating' ? 'active' : ''}`}
                    onClick={() => toggleDropdown('rating')}
                  >
                    <i className="bi bi-star"></i>
                    {activeFilters.rating === 'All' ? 'Rating' : activeFilters.rating}
                  </button>
                  {openDropdown === 'rating' && (
                    <div className="filter-dropdown">
                      {['All', '4.0+', '4.5+'].map(rating => (
                        <button 
                          key={rating}
                          className={activeFilters.rating === rating ? 'selected' : ''}
                          onClick={() => handleLocalFilterChange('rating', rating)}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Filter */}
                <div className="filter-wrapper">
                  <button 
                    className={`famousstay-filter-btn ${activeFilters.location !== 'All' || openDropdown === 'location' ? 'active' : ''}`}
                    onClick={() => toggleDropdown('location')}
                  >
                    <i className="bi bi-geo-alt"></i>
                    {activeFilters.location === 'All' ? t('Location') : activeFilters.location}
                  </button>
                  {openDropdown === 'location' && (
                    <div className="filter-dropdown">
                      {uniqueLocations.map(loc => (
                        <button 
                          key={loc}
                          className={activeFilters.location === loc ? 'selected' : ''}
                          onClick={() => handleLocalFilterChange('location', loc)}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
                    <h2 className="famousstay-section-title">{t('TopPicks')}</h2>
                    <span className="famousstay-editor-label">
                      {t('EditorsChoice')}
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
                            {t('EditorsChoice')}
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
                              {t(action.replace(/\s/g, '')) || action}
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
                  <h2 className="famousstay-section-title">{t('MapNearby')}</h2>
                  <button className="famousstay-explore-btn">{t('Explore')}</button>
                </div>
                <div className="famousstay-map-container">
                  <div className="famousstay-map-placeholder">
                    <i className="bi bi-map"></i>
                    <p>Interactive Map View</p>
                  </div>
                </div>
                <div className="famousstay-nearby-filters">
                  <span className="famousstay-nearby-label">
                    {t('ShowStaysNear')}
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
                  <button className="famousstay-refine-btn">{t('Refine')}</button>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="famousstay-sidebar">
              {/* Quick Filters */}
              <div className="famousstay-sidebar-section">
                <h4 className="famousstay-sidebar-title">{t('QuickFilters')}</h4>
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
                  {t('NearbyFamousFoods')}
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
                <h4 className="famousstay-sidebar-title">{t('CommonAds')}</h4>
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
        siteName={t('siteName') + ".IN"}
        tagline={t('FooterTagline')}
      />
    </div>
  );
};

export default FamousstayPage;
