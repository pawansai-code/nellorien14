import {
  FaAddressCard,
  FaBell,
  FaBook,
  FaBriefcase,
  FaCalendarAlt,
  FaChartLine,
  FaHistory,
  FaHome,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaNewspaper,
  FaPhone,
  FaTrophy,
  FaUtensils,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = ({ includeSearch = false }) => {
  const location = useLocation();

  const navItems = [
    { icon: FaHome, label: "Home", path: "/" },
    { icon: FaBriefcase, label: "Jobs", path: "/jobs" },
    { icon: FaNewspaper, label: "News", path: "/news" },
    { icon: FaInfoCircle, label: "Updates Info", path: "/updates" },
    { icon: FaTrophy, label: "Results", path: "/results" },
    { icon: FaBell, label: "Notifications", path: "/notifications" },
    { icon: FaChartLine, label: "Sports", path: "/sports" },
    { icon: FaUtensils, label: "Famous food", path: "/famousfood" },
    { icon: FaHistory, label: "Nellore History", path: "/history" },
    { icon: FaMapMarkerAlt, label: "Famous Stay", path: "/famousstay" },
    { icon: FaCalendarAlt, label: "Events", path: "/events" },
    { icon: FaBook, label: "Articles", path: "/articles" },
    { icon: FaAddressCard, label: "Contact Us", path: "/contact" },
  ];

  const hubNavItems = [
    { icon: FaHome, label: "Home", path: "/HomePage" },
    { icon: FaBriefcase, label: "Jobs", path: "/hub/jobs" },
    { icon: FaNewspaper, label: "News", path: "/hub/news" },
    { icon: FaInfoCircle, label: "Updates", path: "/hub/updates" },
    { icon: FaTrophy, label: "Events", path: "/hub/events" },
    { icon: FaChartLine, label: "Sports", path: "/hub/sports" },
    { icon: FaPhone, label: "Contact Us", path: "/hub/contact" },
  ];

  const isHubPage = location.pathname.startsWith("/hub");
  let items = isHubPage ? hubNavItems : navItems;

  // if (location.pathname === '/history') {
  //   items = [...items, { icon: FaHistory, label: 'Nellore History', path: '/history' }];
  // }

  return (
    <nav className="main-navigation">
        <div className="d-flex justify-content-center align-items-center">
          <div className="nav-links">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          {includeSearch && (
            <div className="nav-search">
              <input
                type="text"
                placeholder="Search jobs, news, destinations..."
                className="search-input"
              />
            </div>
          )}
        </div>
    </nav>
  );
};

export default Navigation;
