import { useSelector } from 'react-redux';
import './BreakingNews.css';

const BreakingNews = () => {
  const breakingNews = useSelector((state) => state.news.breakingNews);

  const newsContent = breakingNews.map((news, index) => (
    <span key={index} className="news-item">
      {news}
      {index < breakingNews.length - 1 && <span className="separator"> • </span>}
    </span>
  ));

  return (
    <div className="breaking-news-container">
        <div className="d-flex align-items-center">
          <div className="breaking-news-banner">
            <span className="pulse-icon">((o))</span>
            <span className="breaking-news-text">BREAKING NEWS</span>
          </div>
          <div className="news-ticker">
            <div className="ticker-wrapper">
              <div className="ticker-content">
                {newsContent}

                <span className="ticker-spacer"> • </span>
                {newsContent}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default BreakingNews;

