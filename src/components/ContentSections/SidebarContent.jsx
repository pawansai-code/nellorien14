import React from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SidebarContent.css';

const SidebarContent = () => {
  const { newsLines, sponsored, commonAds } = useSelector((state) => state.news);

  return (
    <aside className="sidebar-content">

      <div className="sidebar-section">
        <h5 className="sidebar-section-title">News Lines</h5>
        <ul className="news-lines-list">
          {newsLines.map((item) => (
            <li key={item.id} className="news-line-item">
              <i className={`bi ${item.icon} news-line-icon`}></i>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>


      {/* <div className="sidebar-section">
        <h5 className="sidebar-section-title">Sponsored</h5>
        <div className="ad-cards">
          {sponsored.map((ad) => (
            <div key={ad.id} className="ad-card">
              <div className="ad-card-image">
                <img src={ad.image} alt={ad.title} />
              </div>
              <div className="ad-card-content">
                <h6 className="ad-card-title">{ad.title}</h6>
                {ad.subtitle && (
                  <p className="ad-card-subtitle">{ad.subtitle}</p>
                )}
                <button className={`btn btn-${ad.buttonColor === 'blue' ? 'primary' : 'light'} btn-sm ad-card-button`}>
                  {ad.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div> */}


      <div className="sidebar-section">
        <h5 className="sidebar-section-title">Common Ads</h5>
        <div className="ad-cards">
          {commonAds.map((ad) => (
            <div key={ad.id} className="ad-card">
              <div className="ad-card-image">
                <img src={ad.image} alt={ad.title} />
              </div>
              <div className="ad-card-content">
                <h6 className="ad-card-title">{ad.title}</h6>
                <button className={`btn btn-${ad.buttonColor === 'blue' ? 'primary' : 'light'} btn-sm ad-card-button`}>
                  {ad.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="ad-cards">
          {sponsored.map((ad) => (
            <div key={ad.id} className="ad-card">
              <div className="ad-card-image">
                <img src={ad.image} alt={ad.title} />
              </div>
              <div className="ad-card-content">
                <h6 className="ad-card-title">{ad.title}</h6>
                {ad.subtitle && (
                  <p className="ad-card-subtitle">{ad.subtitle}</p>
                )}
                <button className={`btn btn-${ad.buttonColor === 'blue' ? 'primary' : 'light'} btn-sm ad-card-button`}>
                  {ad.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarContent;

