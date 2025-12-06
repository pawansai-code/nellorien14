import { useSelector } from 'react-redux';
import './CommonAds.css';

const CommonAds = () => {
  const { commonAds, sponsored } = useSelector((state) => state.commonAds);

  return (
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
  );
};

export default CommonAds;
