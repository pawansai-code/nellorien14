import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import "./Famousfood.css";

const Famousfood = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Filter logic
  const filteredDishes = useMemo(() => {
    let filtered = [...signatureDishes];

    // Category filter
    if (activeCategoryFilter !== "All") {
      filtered = filtered.filter((dish) => {
        if (activeCategoryFilter === "Veg") {
          return dish.category === "Veg";
        } else if (activeCategoryFilter === "Non-Veg") {
          return dish.category === "Non-Veg";
        } else if (activeCategoryFilter === "Sweets") {
          return dish.category === "Sweets";
        }
        return true;
      });
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dish) =>
          dish.name?.toLowerCase().includes(q) ||
          dish.description?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [signatureDishes, searchTerm, activeCategoryFilter]);

  const handleCategoryFilter = (category) => {
    setActiveCategoryFilter(
      activeCategoryFilter === category ? "All" : category
    );
  };

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
    console.log("Change location");
    // Could open a location picker modal
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
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
      <Navbar includeSearch={false} />

      <main className="famousfood-main">
          {/* Header Section */}
          <section className="famousfood-header">
            <div className="famousfood-header-content">
              <div className="famousfood-title-section">
                <h1 className="famousfood-title">Famous Foods of Nellore</h1>
                <button
                  className="famousfood-local-btn"
                  onClick={handleLocalFavorites}
                >
                  <i className="bi bi-utensils"></i>
                  Local Favorites
                </button>
              </div>

              <div className="famousfood-controls">
                <div className="famousfood-search-bar">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    placeholder="Search dishes or restaurants"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="famousfood-filter-buttons">
                  <button className="famousfood-filter-btn">
                    <i className="bi bi-tags"></i>
                    Veg - Non-Veg - Sweets
                  </button>
                </div>

                <div
                  className="famousfood-location-filter"
                  onClick={handleLocationChange}
                >
                  <i className="bi bi-geo-alt"></i>
                  <span>{reduxFilters.location || "Nellore - Gudur"}</span>
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
                  <h2 className="famousfood-section-title">Signature Dishes</h2>
                  <button className="famousfood-must-try-btn">Must Try</button>
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
                <h4 className="famousfood-sidebar-title">Today's Specials</h4>
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
                <h4 className="famousfood-sidebar-title">Top Rated Spots</h4>
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
                <h4 className="famousfood-sidebar-title">Common Ads</h4>
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
                <h2 className="famousfood-card-title">Editor's Picks</h2>
                <span className="famousfood-card-badge trusted">Trusted</span>
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
                <h2 className="famousfood-card-title">Plan Your Food Tour</h2>
                <span className="famousfood-card-badge weekend">Weekend</span>
              </div>
              <div className="famousfood-tour-plan-inputs">
                <div className="famousfood-tour-input-field">
                  <i className="bi bi-calendar3"></i>
                  <input
                    type="text"
                    placeholder="Pick dates · Lunch/Dinner"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                  />
                </div>
                <div className="famousfood-tour-input-field">
                  <i className="bi bi-people"></i>
                  <input
                    type="text"
                    placeholder="2 - 6 people"
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
                  Create itinerary
                </button>
                <button
                  className="famousfood-tour-share-btn"
                  onClick={handleShare}
                >
                  Share
                </button>
              </div>
            </div>
          </section>
        </div>  
      </main>

      <Footer
        siteName="NELLORIENS.IN"
        tagline="Your trusted gateway for updates, alerts & information across Nellore."
      />
    </div>
  );
};

export default Famousfood;
