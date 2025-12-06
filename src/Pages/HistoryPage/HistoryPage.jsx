import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from "../../components/Footer";
import MainHeader from "../../components/MainHeader";
import Navbar from "../../components/Navbar";
import TopHeader from "../../components/TopHeader";
import "./HistoryPage.css";

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();   
  const { commonAds, newsFeedArticles } = useSelector((state) => state.news);

  const timelineData = [
    {
      id: 1,
      title: "Early Mentions: Simhapuri",
      description: "Known as Vikrama Simhapuri in early texts; growth along the Penna river.",
      tags: ["Pre 6th c.", "Etymology"],
      image: "image yet to do", 
    },
    {
      id: 2,
      title: "Pallava Influence",
      description: "Administrative foothold and temple patronage shape regional culture.",
      tags: ["6th–9th c.", "Dynasty"],
      image: "image yet to do",
    },
    {
      id: 3,
      title: "Chola And Chalukya Links",
      description: "Trade corridors expand; maritime ties via coastal routes.",
      tags: ["10th–12th c.", "Trade"],
      image: "image yet to do",
    },
    {
      id: 4,
      title: "Vijayanagara To Nawabs",
      description: "Power transitions bring fortifications and market towns.",
      tags: ["14th–18th c.", "Polity"],
      image: "image yet to do",
    },
    {
      id: 5,
      title: "Colonial Administration",
      description: "Railways, education, and revenue systems reshape society.",
      tags: ["19th–20th c.", "Modernization"],
      image: "image yet to do",
    },
    {
      id: 6,
      title: "Post-Independence Growth",
      description: "Aquaculture, agriculture, and education hubs drive evolution.",
      tags: ["Since 1947", "Development"],
      image: "image yet to do",
    },
  ];

  const quickFacts = [
    { icon: "bi-geo-alt", title: "Region", desc: "Coastal Andhra, Penna delta", tag: "Geo" },
    { icon: "bi-graph-up", title: "Economy", desc: "Paddy, aquaculture, mica", tag: "Data" },
    { icon: "bi-people", title: "Culture", desc: "Telugu literature, fairs", tag: "Heritage" },
  ];

  const recommendedReads = [
    { icon: "bi-file-earmark-pdf", title: "Gazetteer Excerpts", desc: "Colonial records overview", tag: "PDF" },
    { icon: "bi-book", title: "Local Chronicles", desc: "Legends and folklore", tag: "Book" },
  ];

  const landmarks = [
    { icon: "bi-building", title: "Narasimha Swamy Temple", desc: "Ancient shrine tied to Simhapuri lore", tag: "Temple" },
    { icon: "bi-bricks", title: "Historic Fort Remains", desc: "Trade-era bastions near old market", tag: "Fort" },
    { icon: "bi-water", title: "Penna River Ghats", desc: "Cultural gatherings and trade ferries", tag: "River" },
    { icon: "bi-bank", title: "Museum & Archives", desc: "Local records and inscriptions", tag: "Archive" },
  ];

  return (
    <div className="history-page">
      <TopHeader />
      <MainHeader
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
      <Navbar includeSearch={false} />

      <main className="history-page-main">
          {/* hero section */}
          <section className="history-hero">
            <div className="history-hero-image">
               <img src="yet to do " alt="Nellore Landscape" />
            </div>
            <div className="history-hero-content">
              <h1>Nellore History</h1>
              <p>A concise journey through Nellore's timeline — from ancient dynasties to modern development.</p>
              <div className="history-hero-actions">
                <div className="search-bar">
                  <i className="bi bi-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search rulers, events, places" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-dropdown">
                  <i className="bi bi-funnel"></i>
                  <span>Dynasty · Culture · Trade</span>
                </div>
                <button className="download-btn">Download guide</button>
              </div>
            </div>
          </section>

        <div className="container-fluid">
          <div className="history-content-grid">
            {/* Left Column Wrapper */}
            <div className="history-main-column">
              {/* left side timeline section */}
              <div className="history-timeline-section">
                <div className="section-header">
                  <h3>Timeline Highlights</h3>
                  <span className="badge-curated">Curated</span>
                </div>
                
                <div className="timeline-list">
                  <div className="timeline-decoration text-center mb-3">
                    <i className="bi bi-three-dots-vertical text-primary fs-4"></i>
                  </div>
                  
                  {timelineData.map((item) => (
                    <div key={item.id} className="timeline-card">
                      <div className="timeline-img">
                        <img src={item.image} alt={item.title} />
                      </div>
                      <div className="timeline-info">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <div className="timeline-tags">
                          {item.tags.map((tag, idx) => (
                            <span key={idx} className={`tag ${idx === 0 ? 'tag-primary' : 'tag-secondary'}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Landmarks */}
              <div className="key-landmarks-section">
                <div className="landmarks-container">
                  <div className="section-header">
                    <h3>Key Landmarks</h3>
                    <button className="visit-btn">Visit</button>
                  </div>
                  <div className="landmark-list">
                    {landmarks.map((landmark, idx) => (
                      <div key={idx} className="landmark-item">
                        <div className="landmark-icon"><i className={`bi ${landmark.icon}`}></i></div>
                        <div className="landmark-details">
                          <h4>{landmark.title}</h4>
                          <p>{landmark.desc}</p>
                        </div>
                        <span className="landmark-tag">{landmark.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest News Section */}
              <div className="history-news-section">
                 <div className="section-header">
                    <h3>Latest News</h3>
                    <button className="visit-btn" onClick={() => navigate('/hub/news')}>View All</button>
                 </div>
                 <div className="news-cards-container">
                    {(newsFeedArticles || []).slice(0, 2).map((article) => (
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
                            onClick={() => navigate(`/hub/news/${article.id}`)}
                          >
                            Read Full Article
                          </button>
                        </div>
                      </article>
                    ))}
                 </div>
              </div>
            </div>

            {/* right side sidebar */}
            <div className="history-sidebar">
              {/* quick facts */}
              <div className="sidebar-card">
                <h3>Quick Facts</h3>
                <div className="fact-list">
                  {quickFacts.map((fact, idx) => (
                    <div key={idx} className="fact-item">
                      <div className="fact-icon"><i className={`bi ${fact.icon}`}></i></div>
                      <div className="fact-details">
                        <h4>{fact.title}</h4>
                        <p>{fact.desc}</p>
                      </div>
                      <span className="fact-tag">{fact.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* recommended reads section */}
              <div className="sidebar-card">
                <h3>Recommended Reads</h3>
                <div className="read-list">
                  {recommendedReads.map((read, idx) => (
                    <div key={idx} className="read-item">
                      <div className="read-icon"><i className={`bi ${read.icon}`}></i></div>
                      <div className="read-details">
                        <h4>{read.title}</h4>
                        <p>{read.desc}</p>
                      </div>
                      <span className="read-tag">{read.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* common ads section */}
              <div className="jobs-common-ads-card">
                <div className="common-ads-header">
                  <div>
                    <h5>Common Ads</h5>
                    <span>Promoted</span>
                  </div>
                  <i className="bi bi-megaphone"></i>
                </div>
                <div className="common-ads-list">
                  {(commonAds || []).map((ad) => (
                    <div key={ad.id} className="common-ad-item">
                      <div className="common-ad-thumb">
                        <img src={ad.image} alt={ad.title} />
                      </div>
                      <div className="common-ad-body">
                        <h6>{ad.title}</h6>
                        <button
                          className={`btn btn-sm common-ad-button ${
                            ad.buttonColor === 'blue'
                              ? 'btn-primary'
                              : 'btn-outline-secondary'
                          }`}
                        >
                          {ad.buttonText}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



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

export default HistoryPage;
