import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import { setNewsLoading, setNewsPage } from "../../state/slices/newsSlice";
import "./NewsPage.css";

const NewsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    newsFeedArticles,
    newsFeedFilters,
    newsPage,
    featuredArticle,
    liveNewsFeed,
    headlines,
    liveNewsCount,
  } = useSelector((state) => state.news);
  const defaultFilter = newsFeedFilters?.[0]?.id ?? "local";
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArticles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return newsFeedArticles.filter((article) => {
      const matchesFilter =
        activeFilter === "All" ? true : article.filterCategory === activeFilter;

      if (!term) return matchesFilter;

      const text = `${article.title} ${article.categoryLabel}`.toLowerCase();
      return matchesFilter && text.includes(term);
    });
  }, [newsFeedArticles, activeFilter, searchTerm]);

  const handleFilterChange = (filterId) => {
    if (activeFilter === filterId) return;
    setActiveFilter(filterId);
    setSearchTerm("");
  };

  const commonAds = useSelector((state) => state.ads?.commonAds) || [];

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber === newsPage.currentPage ||
      pageNumber < 1 ||
      pageNumber > newsPage.totalPages
    ) {
      return;
    }
    dispatch(setNewsLoading(true));
    setTimeout(() => {
      dispatch(setNewsPage(pageNumber));
      dispatch(setNewsLoading(false));
    }, 400);
  };

  // const handleLoadMore = () => {
  //   if (newsPage.currentPage >= newsPage.totalPages) return;
  //   handlePageChange(newsPage.currentPage + 1);
  // };

  const handleReadFullArticle = (articleId) => {
    navigate(`/hub/news/${articleId}`);
  };

  const handleLoadNew = () => {
    // load new
    dispatch(setNewsLoading(true));
    setTimeout(() => {
      dispatch(setNewsPage(1));
      dispatch(setNewsLoading(false));
    }, 400);
  };

  const handleArticleImageClick = () => {
    handleReadFullArticle(featuredArticle.id);
  };

  const handleLiveNewsAction = (action, articleId) => {
    if (action === "Open") {
      handleReadFullArticle(articleId);
    } else if (action === "Share") {
      console.log("Share article:", articleId);
    } else if (action === "Save") {
      console.log("Save article:", articleId);
    } else if (action === "Discuss") {
      console.log("Discuss article:", articleId);
    } else if (action === "Source") {
      console.log("View source for article:", articleId);
    }
  };

  return (
    <div className="news-page">
      <TopHeader />
      <MainHeader
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
      <Navbar includeSearch={false} />

      <main className="news-page-main">
        <div className="container-fluid">
          <section className="news-page-panel">
            <div className="news-page-header">
              <div className="news-page-title">
                <span className="news-page-title-icon">
                  <i className="bi bi-newspaper"></i>
                </span>
                <div>
                  <h2 className="news-page-heading">News</h2>
                </div>
              </div>
              <div className="news-page-search">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search articles"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="news-page-tabs">
              {newsFeedFilters.map((tab) => (
                <button
                  key={tab.id}
                  className={`news-page-tab ${
                    activeFilter === tab.id ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange(tab.id)}
                >
                  <i className={`bi ${tab.icon} me-2`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

              <div className="news-content-layout">
                <div className="news-main-column">
                  <div className="news-page-grid">
                    {filteredArticles.map((article) => (
                      <article key={article.id} className="news-page-card">
                        <div className="news-page-card-image">
                          <img src={article.image} alt={article.title} />
                        </div>
                        <div className="news-page-card-body">
                          <h3 className="news-page-card-title">{article.title}</h3>
                          <p className="news-page-card-meta">
                            {article.categoryLabel} · {article.time}
                          </p>
                          <button
                            className="news-page-card-btn"
                            onClick={() => handleReadFullArticle(article.id)}
                          >
                            Read Full Article
                          </button>
                        </div>
                      </article>
                    ))}
                    {!filteredArticles.length && (
                      <div className="news-page-empty-state">
                        <i className="bi bi-emoji-neutral"></i>
                        <p>No news matches your search.</p>
                      </div>
                    )}
                  </div>
  
                  {/* pagination section */}
                  <div className="jobs-pagination-panel">
                    <div className="pagination-controls-group">
                      <span className="pagination-status-chip">
                        Page {newsPage.currentPage} of {newsPage.totalPages}
                      </span>
  
                      <div className="pagination-controls">
                        {[1, 2, 3].map((page) => (
                          <button
                            key={page}
                            className="btn pagination-chip-btn"
                            onClick={() => handlePageChange(page)}
                            disabled={newsPage.currentPage === page}
                          >
                            {page}
                          </button>
                        ))}
  
                        <button
                          className="btn pagination-chip-btn pagination-chip-btn-primary"
                          onClick={() => handlePageChange(newsPage.currentPage + 1)}
                          disabled={newsPage.currentPage >= newsPage.totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>

          </section>

          {/* Article Details, Live News Feed, and Headlines Section */}
          <section className="news-featured-section">
            {/* Article Details */}
            <div className="article-details-container">
              <div className="article-details-label">Article Details</div>
              <div className="article-details-content">
                <h2 className="article-details-title">
                  {featuredArticle.title}
                </h2>
                <p className="article-details-date">
                  Published: {featuredArticle.publishedDate}
                </p>
                <div
                  className="article-details-image-wrapper"
                  onClick={handleArticleImageClick}
                >
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="article-details-image"
                  />
                  <span className="article-details-hint">Opens on click</span>
                </div>
                <p className="article-details-summary">
                  {featuredArticle.summary}
                </p>
              </div>
            </div>

            <div className="news-feed-headlines-layout">
              <div className="live-news-feed-container">
                <h3 className="live-news-feed-title">Live News Feed</h3>
                <div className="live-news-feed-list">
                  {liveNewsFeed.map((item) => (
                    <div key={item.id} className="live-news-item">
                      <div className="live-news-item-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="live-news-item-content">
                        <h4 className="live-news-item-title">{item.title}</h4>
                        <p className="live-news-item-meta">
                          {item.category} • {item.time}
                        </p>
                        <div className="live-news-item-actions">
                          {item.actions.map((action, idx) => (
                            <button
                              key={idx}
                              className="live-news-action-btn"
                              onClick={() =>
                                handleLiveNewsAction(action, item.id)
                              }
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="live-news-indicator">
                  Live: {liveNewsCount} new posts
                </div>
              </div>

              {/* headlines section */}
              <div className="headlines-container">
                <h3 className="headlines-title">Headlines</h3>
                <ul className="headlines-list">
                  {headlines.list.map((headline, idx) => (
                    <li key={idx} className="headlines-list-item">
                      {headline}
                    </li>
                  ))}
                </ul>
                <div className="headlines-items">
                  {headlines.items.map((item) => (
                    <div key={item.id} className="headlines-item">
                      <div className="headlines-item-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="headlines-item-content">
                        <h4 className="headlines-item-title">{item.title}</h4>
                        <p className="headlines-item-meta">
                          {item.category} • {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* <button className="load-new-btn" onClick={handleLoadNew}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Load New
            </button> */}
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

export default NewsPage;
