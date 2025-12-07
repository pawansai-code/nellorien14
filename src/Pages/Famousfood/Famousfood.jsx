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
import "./Famousfood.css";

const Famousfood = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    signatureDishes = [],
    todaysSpecials = [],
    topRatedSpots = [],
    commonAds = [],
    editorsPicks = [],
    foodTourPlan = {},
    filters: reduxFilters,
  } = useSelector((state) => state.famousFoods || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [tourDate, setTourDate] = useState("");
  const [peopleCount, setPeopleCount] = useState("");

  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Normalize dishes and add mock locations for filtering demonstration
  const allDishes = useMemo(() => {
    const locations = ['Nellore', 'Gudur', 'Nellore', 'Kavali'];
    return signatureDishes.map((dish, index) => ({
      ...dish,
      location: locations[index % locations.length] || 'Nellore' 
    }));
  }, [signatureDishes]);

  // Extract unique categories and locations
  const uniqueCategories = useMemo(() => {
    const cats = new Set(allDishes.map(d => d.category || d.tag)); // Use category or tag
    return ['All', ...Array.from(cats)];
  }, [allDishes]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set(allDishes.map(d => d.location));
    return ['All', ...Array.from(locs)];
  }, [allDishes]);

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

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  // Filter logic
  const filteredDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      // Category filter
      if (filters.category !== 'All' && (dish.category !== filters.category && dish.tag !== filters.category)) {
        return false;
      }

      // Location filter
      if (filters.location !== 'All' && dish.location !== filters.location) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          dish.name?.toLowerCase().includes(q) ||
          dish.description?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [allDishes, filters, searchTerm]);

  const handleDishAction = (dish, action) => {
    console.log(`${action} for ${dish.name}`);
    if (action === "Where to eat" || action === "Popular spots") {
      navigate(`/food/${dish.id}/locations`);
    } else if (action === "Map") {
      navigate(`/food/${dish.id}/map`);
    }
  };

  const handleLocalFavorites = () => {
    console.log("Navigate to local favorites");
    navigate("/food/local-favorites");
  };

  const handleLocationChange = () => {
    // Legacy handler, now handled by dropdown
  };

  const handleSpecialClick = (special) => {
    console.log("Navigate to:", special.name);
    navigate(`/food/specials/${special.id}`);
  };

  const handleSpotClick = (spot) => {
    console.log("Navigate to:", spot.name);
    navigate(`/food/restaurants/${spot.id}`);
  };

  const handleAdClick = (ad) => {
    console.log("Ad clicked:", ad.title);
  };

  const handleEditorPickClick = (pick, action) => {
    console.log(`${action} for ${pick.title}`);
    navigate(`/food/${pick.id}/${action.toLowerCase()}`);
  };

  const handleCreateItinerary = () => {
    if (tourDate && peopleCount) {
      dispatch(updateFoodTourPlan({ date: tourDate, peopleCount }));
      console.log("Creating itinerary with:", { tourDate, peopleCount });
      navigate("/food/itinerary");
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleShare = () => {
    console.log("Share food tour plan");
    // Implement share functionality
  };

  return (
    <div className="famousfood-page">
      <TopHeader />
      <MainHeader
        siteName={t('siteName') + ".IN"}
        tagline={t('tagline')}
      />
      <Navbar includeSearch={false} />

      <main className="famousfood-main">
          {/* Header Section */}
          <section className="famousfood-header">
            <div className="famousfood-header-content">
              <div className="famousfood-title-section">
                <h1 className="famousfood-title">{t('FamousFoodsOfNellore')}</h1>
                <button
                  className="famousfood-local-btn"
                  onClick={handleLocalFavorites}
                >
                  <i className="bi bi-utensils"></i>
                  {t('LocalFavorites')}
                </button>
              </div>

              <div className="famousfood-controls" ref={dropdownRef}>
                <div className="famousfood-search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder={t('SearchDishes')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="famousfood-filter-buttons">
                  {/* Category Dropdown */}
                  <div className="filter-wrapper">
                    <button 
                      className={`famousfood-filter-btn ${filters.category !== 'All' || openDropdown === 'category' ? 'active' : ''}`}
                      onClick={() => toggleDropdown('category')}
                    >
                      <i className="bi bi-tags"></i>
                      {filters.category === 'All' ? t('SelectCategory') : filters.category}
                    </button>
                    {openDropdown === 'category' && (
                      <div className="filter-dropdown">
                        {uniqueCategories.map(cat => (
                          <button 
                            key={cat} 
                            onClick={() => handleFilterChange('category', cat)}
                            className={filters.category === cat ? 'selected' : ''}
                          >
                            {cat === 'All' ? t('All') : cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Dropdown */}
                  <div className="filter-wrapper">
                    <button 
                      className={`famousfood-filter-btn ${filters.location !== 'All' || openDropdown === 'location' ? 'active' : ''}`}
                      onClick={() => toggleDropdown('location')}
                    >
                      <i className="bi bi-geo-alt"></i>
                      {filters.location === 'All' ? t('Location') + ': ' + t('All') : filters.location}
                    </button>
                    {openDropdown === 'location' && (
                      <div className="filter-dropdown">
                        {uniqueLocations.map(loc => (
                          <button 
                            key={loc} 
                            onClick={() => handleFilterChange('location', loc)}
                            className={filters.location === loc ? 'selected' : ''}
                          >
                            {loc === 'All' ? t('All') : loc}
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
          <div className="famousfood-content-wrapper">
            {/* Main Content */}
            <div className="famousfood-main-content">
              {/* Signature Dishes Section */}
              <section className="famousfood-signature-dishes">
                <div className="famousfood-section-header">
                  <h2 className="famousfood-section-title">{t('SignatureDishes')}</h2>
                  <button className="famousfood-must-try-btn">{t('MustTry')}</button>
                </div>

                <div className="famousfood-dishes-list">
                  {filteredDishes.map((dish) => (
                    <div key={dish.id} className="famousfood-dish-card">
                      <div className="famousfood-dish-image">
                        <img src={dish.image} alt={dish.name} />
                      </div>
                      <div className="famousfood-dish-body">
                        <h3 className="famousfood-dish-name">{dish.name}</h3>
                        <p className="famousfood-dish-description">
                          {dish.description}
                        </p>
                        <div className="famousfood-dish-footer">
                          <span
                            className={`famousfood-dish-tag ${dish.tag.toLowerCase()}`}
                          >
                            {dish.tag}
                          </span>
                          <button
                            className="famousfood-dish-action-btn"
                            onClick={() =>
                              handleDishAction(dish, dish.actionLabel)
                            }
                          >
                            {dish.actionLabel}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="famousfood-sidebar">
              {/* Today's Specials */}
              <div className="famousfood-sidebar-section">
                <h4 className="famousfood-sidebar-title">{t('TodaysSpecials')}</h4>
                <div className="famousfood-specials-list">
                  {todaysSpecials.map((special) => (
                    <div
                      key={special.id}
                      className="famousfood-special-item"
                      onClick={() => handleSpecialClick(special)}
                    >
                      <i className={`bi ${special.icon}`}></i>
                      <div className="famousfood-special-content">
                        <h5 className="famousfood-special-name">
                          {special.name}
                        </h5>
                        <p className="famousfood-special-details">
                          {special.details}
                        </p>
                        <span
                          className={`famousfood-special-label ${special.label.toLowerCase()}`}
                        >
                          {special.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Rated Spots */}
              <div className="famousfood-sidebar-section">
                <h4 className="famousfood-sidebar-title">{t('TopRatedSpots')}</h4>
                <div className="famousfood-spots-list">
                  {topRatedSpots.map((spot) => (
                    <div
                      key={spot.id}
                      className="famousfood-spot-item"
                      onClick={() => handleSpotClick(spot)}
                    >
                      <i className={`bi ${spot.icon}`}></i>
                      <div className="famousfood-spot-content">
                        <h5 className="famousfood-spot-name">{spot.name}</h5>
                        <p className="famousfood-spot-description">
                          {spot.description}
                        </p>
                        <div className="famousfood-spot-rating">
                          <i className="bi bi-star-fill"></i>
                          <span>{spot.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Ads */}
              <div className="famousfood-sidebar-section">
                <h4 className="famousfood-sidebar-title">{t('CommonAds')}</h4>
                <div className="famousfood-ads-list">
                  {commonAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="famousfood-ad-card"
                      onClick={() => handleAdClick(ad)}
                    >
                      <div className="famousfood-ad-image">
                        <img src={ad.image} alt={ad.title} />
                      </div>
                      <div className="famousfood-ad-content">
                        {ad.subtitle && (
                          <p className="famousfood-ad-subtitle">
                            {ad.subtitle}
                          </p>
                        )}
                        <h5 className="famousfood-ad-title">{ad.title}</h5>
                        <button className="famousfood-ad-btn">
                          {ad.actionLabel}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Editor's Picks Section */}
          <section className="famousfood-editors-picks-section">
            <div className="famousfood-editors-picks-card">
              <div className="famousfood-card-header">
                <h2 className="famousfood-card-title">{t('EditorsPicks')}</h2>
                <span className="famousfood-card-badge trusted">{t('Trusted')}</span>
              </div>
              <div className="famousfood-editors-picks-list">
                {editorsPicks.map((pick) => (
                  <div
                    key={pick.id}
                    className="famousfood-editor-pick-item"
                    onClick={() =>
                      handleEditorPickClick(pick, pick.actionLabel)
                    }
                  >
                    <i className={`bi ${pick.icon}`}></i>
                    <div className="famousfood-editor-pick-content">
                      <h3 className="famousfood-editor-pick-title">
                        {pick.title}
                      </h3>
                      <p className="famousfood-editor-pick-subtitle">
                        {pick.subtitle}
                      </p>
                    </div>
                    <button className="famousfood-editor-pick-btn">
                      {pick.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Plan Your Food Tour Section */}
          <section className="famousfood-tour-plan-section">
            <div className="famousfood-tour-plan-card">
              <div className="famousfood-card-header">
                <h2 className="famousfood-card-title">{t('PlanYourFoodTour')}</h2>
                <span className="famousfood-card-badge weekend">{t('Weekend')}</span>
              </div>
              <div className="famousfood-tour-plan-inputs">
                <div className="famousfood-tour-input-field">
                  <i className="bi bi-calendar3"></i>
                  <input
                    type="text"
                    placeholder={t('PickDates')}
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                  />
                </div>
                <div className="famousfood-tour-input-field">
                  <i className="bi bi-people"></i>
                  <input
                    type="text"
                    placeholder={t('PeopleCount')}
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(e.target.value)}
                  />
                </div>
              </div>
              <div className="famousfood-tour-plan-actions">
                <button
                  className="famousfood-tour-create-btn"
                  onClick={handleCreateItinerary}
                >
                  {t('CreateItinerary')}
                </button>
                <button
                  className="famousfood-tour-share-btn"
                  onClick={handleShare}
                >
                  {t('Share')}
                </button>
              </div>
            </div>
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

export default Famousfood;
