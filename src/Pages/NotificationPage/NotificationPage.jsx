import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonPageLayout from "../../components/CommonPageLayout";
import useTranslation from "../../hooks/useTranslation";
import {
    setNotificationsLoading,
    setNotificationsPage,
} from "../../state/slices/notificationSlice";
import "./NotificationPage.css";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    notificationsList,
    notificationsFilters,
    notificationsPage,
    recentlyOpened,
    importantNotificationLinks,
    notificationTools,
  } = useSelector((state) => state.notifications);

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationId, setNotificationId] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [notificationMobile, setNotificationMobile] = useState("");

  const filteredNotifications = useMemo(() => {
    let filtered = notificationsList.filter((notification) => {
      const matchesFilter =
        activeFilter === "All" || notification.category === activeFilter;

      if (!matchesFilter) {
        return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          notification.title.toLowerCase().includes(term) ||
          notification.description.toLowerCase().includes(term) ||
          notification.tags.some((tag) => tag.toLowerCase().includes(term))
        );
      }

      return true;
    });

    // Sort by published date (most recent first)
    filtered.sort(
      (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)
    );

    return filtered;
  }, [notificationsList, activeFilter, searchTerm]);

  const handleFilterChange = (filterLabel) => {
    setActiveFilter(filterLabel);
  };

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber === notificationsPage.currentPage ||
      pageNumber < 1 ||
      pageNumber > notificationsPage.totalPages
    ) {
      return;
    }
    dispatch(setNotificationsLoading(true));
    setTimeout(() => {
      dispatch(setNotificationsPage(pageNumber));
      dispatch(setNotificationsLoading(false));
    }, 400);
  };

  const handleLoadMore = () => {
    if (notificationsPage.currentPage >= notificationsPage.totalPages) return;
    handlePageChange(notificationsPage.currentPage + 1);
  };

  const handleNotificationAction = (notification, actionType) => {
    console.log(`Action: ${actionType} for notification: ${notification.id}`);
  };

  const handleFindNotification = () => {
    if (notificationId.trim()) {
      console.log("Finding notification with ID:", notificationId);
      // Logic to find and scroll to notification or highlight it
    }
  };

  const handleSubscribe = () => {
    console.log("Subscribed:", notificationEmail, notificationMobile);
  };
  
  const handleManageTopics = () => {
    console.log("Managing topics...");
  };

  const handleSetAlert = () => {
    console.log("Setting up notification alerts...");
  };

  // Find Section Left
  const findSectionLeft = (
    <>
      <h2 className="notification-find-title">
        {t('FindNotificationQuickly')}
      </h2>
      <p className="notification-find-instructions">
        {t('NotificationInstructions')}
      </p>
      <div className="notification-alert-box">
        <i className="bi bi-exclamation-triangle"></i>
        <span>
          {t('EnableAlerts')}
        </span>
      </div>
    </>
  );

  // Find Section Right
  const findSectionRight = (
    <div className="notification-quick-actions-panel">
  
      {/* Title */}
      <h4 className="notification-sidebar-title">{t('QuickSubscriptions')}</h4>
  
      {/* Email Input */}
      <div className="notification-input-wrapper">
        <i className="bi bi-envelope"></i>
        <input
          type="text"
          placeholder={t('EnterEmail')}
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
          className="notification-input"
        />
      </div>
  
      {/* Mobile Input */}
      <div className="notification-input-wrapper">
        <i className="bi bi-telephone"></i>
        <input
          type="text"
          placeholder={t('EnterMobile')}
          value={notificationMobile}
          onChange={(e) => setNotificationMobile(e.target.value)}
          className="notification-input"
        />
      </div>
  
      {/* Subscribe Button */}
      <button
        className="notification-subscribe-btn"
        onClick={handleSubscribe}
      >
        <i className="bi bi-bell-plus me-2"></i>
        {t('Subscribe')}
      </button>
  
      {/* Manage Topics */}
      <button
        className="notification-manage-btn"
        onClick={handleManageTopics}
      >
        <i className="bi bi-sliders me-2"></i>
        {t('ManageTopics')}
      </button>
  
    </div>
  );
  

  // Main Content
  const mainContent = (
    <div className="notifications-list">
      {filteredNotifications.map((notification) => (
        <div key={notification.id} className="notification-card">
          <div className="notification-card-header">
            <h3 className="notification-card-title">{notification.title}</h3>
            <div className="notification-card-tags">
              {notification.tags.map((tag, idx) => (
                <span key={idx} className="notification-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="notification-card-description">
            {notification.description}
          </p>
          <div className="notification-card-footer">
            <span className="notification-meta">
              {notification.board} • {notification.session}
            </span>
            <div className="notification-actions">
              {notification.actions.map((action, idx) => (
                <button
                  key={idx}
                  className={`notification-action-btn ${
                    idx === 0
                      ? "notification-action-primary"
                      : "notification-action-secondary"
                  }`}
                  onClick={() => handleNotificationAction(notification, action)}
                >
                  {t(action) || action}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Sidebar Content
  const sidebarContent = (
    <>
      {/* Notification Tools Section */}
      <div className="notification-sidebar-section">
        <div className="notification-sidebar-header">
          <h4 className="notification-sidebar-title">{t('NotificationTools')}</h4>
          <a href="#" className="notification-sidebar-link">
            {t('Tools')}
          </a>
        </div>
        <div className="notification-tools-list">
          {notificationTools.map((tool) => (
            <div key={tool.id} className="notification-tool-item">
              <i className={`bi ${tool.icon}`}></i>
              <span>{t(tool.label) || tool.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Important Links Section */}
      <div className="notification-sidebar-section">
        <div className="notification-sidebar-header">
          <h4 className="notification-sidebar-title">{t('ImportantLinks')}</h4>
          <a href="#" className="notification-sidebar-link">
            {t('Links')}
          </a>
        </div>
        <div className="notification-links-list">
          {importantNotificationLinks.map((link) => (
            <a key={link.id} href={link.url} className="notification-link-item">
              <i className="bi bi-box-arrow-up-right"></i>
              <span>{t(link.label) || link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recently Opened Section */}
      <div className="notification-sidebar-section">
        <div className="notification-sidebar-header">
          <h4 className="notification-sidebar-title">{t('RecentlyOpened')}</h4>
          <a href="#" className="notification-sidebar-link">
            {t('You')}
          </a>
        </div>
        <div className="notification-recent-list">
          {recentlyOpened.map((item) => (
            <div key={item.id} className="notification-recent-item">
              <i className="bi bi-clock-history"></i>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Pagination
  const pagination = (
    <>
      <span className="notification-pagination-status">
        {t('Page')} {notificationsPage.currentPage} {t('Of')} {notificationsPage.totalPages}
      </span>
      <div className="notification-pagination-controls">
        {notificationsPage.isLoading ? (
          <>
            <span className="notification-loading-text">{t('LoadingMore')}</span>
            <span
              className="spinner-border spinner-border-sm ms-2"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        ) : (
          <>
            <span className="notification-loading-text">{t('LoadingMore')}</span>
            <button
              className="notification-load-more-btn"
              onClick={handleLoadMore}
              disabled={
                notificationsPage.currentPage >= notificationsPage.totalPages
              }
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              {t('LoadMore')}
            </button>
          </>
        )}
      </div>
    </>
  );
  
  const localizedFilters = notificationsFilters.map(f => ({
      ...f,
      label: t(f.label) || f.label
  }));

  return (
    <CommonPageLayout
      pageTitle={t('Notifications')}
      pageIcon="bi bi-bell"
      pageSubtitle={t('NotificationsSubtitle')}
      filterTabs={localizedFilters}
      activeFilter={activeFilter}
      onFilterChange={handleFilterChange}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder={t('SearchNotifications')}
      includeSearch={true}
      findSectionLeft={findSectionLeft}
      findSectionRight={findSectionRight}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
      pagination={pagination}
      footerTagline={t('NotificationFooterTagline')}
      includeNavbarSearch={false}
    />
  );
};

export default NotificationPage;
