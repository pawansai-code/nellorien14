import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import MainHeader from '../../components/MainHeader';
import Navbar from '../../components/Navbar';
import TopHeader from '../../components/TopHeader';
import useTranslation from '../../hooks/useTranslation';
import { setJobsLoading, setJobsPage } from '../../state/slices/newsSlice';
import './JobsPage.css';



const JobsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { govtJobs = [], privateJobs = [], internships = [] } = useSelector((state) => state.news);
  const { currentPage, totalPages, isLoading } = useSelector((state) => state.news.jobsPage);

  // Combine all jobs into a single array with normalized properties for filtering
  const allJobs = useMemo(() => {
    const normalizeJob = (job, category) => ({
      ...job,
      category, // Normalize category ('Government', 'Private', 'Internships')
      // Ensure postedDate is treated consistently if needed, though we use the raw string for display
    });

    return [
      ...govtJobs.map(j => normalizeJob(j, 'Government')),
      ...privateJobs.map(j => normalizeJob(j, 'Private')),
      ...internships.map(j => normalizeJob(j, 'Internships'))
    ];
  }, [govtJobs, privateJobs, internships]);

  // Extract unique locations dynamically from the job data
  const uniqueLocations = useMemo(() => {
    const locs = new Set();
    allJobs.forEach(job => {
      if (job.location) locs.add(job.location);
    });
    return Array.from(locs).sort();
  }, [allJobs]);

  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    date: 'All time',
  });

  // State for filters that are actually applied to the list
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'All',
    location: 'All',
    date: 'All time',
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

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

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (filterType) => {
    setOpenDropdown(openDropdown === filterType ? null : filterType);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    // Optional: Scroll to top of results or show a toast
  };

  // Helper to parse date strings like "2d ago", "Posted Today"
  const getDaysAgo = (dateStr) => {
    if (!dateStr) return Infinity;
    const str = dateStr.toLowerCase();
    
    if (str.includes('today') || str.includes('just now') || str.includes('min') || str.includes('hr')) {
      return 0;
    }
    if (str.includes('yesterday')) {
      return 1;
    }
    
    // Match "Xd ago" pattern
    const daysMatch = str.match(/(\d+)\s*d\s*ago/);
    if (daysMatch) {
      return parseInt(daysMatch[1], 10);
    }

    // Match "Xw ago" or "X weeks" pattern for approximate days
    const weeksMatch = str.match(/(\d+)\s*(w|week)/);
    if (weeksMatch) {
      return parseInt(weeksMatch[1], 10) * 7;
    }

    // If it's something like "Fresher", "3+ yrs", treat as not matching specific date ranges
    return Infinity;
  };

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // 1. Category Filter
      if (appliedFilters.category !== 'All' && job.category !== appliedFilters.category) {
        return false;
      }

      // 2. Location Filter
      if (appliedFilters.location !== 'All' && job.location !== appliedFilters.location) {
        return false;
      }

      // 3. Date Filter
      if (appliedFilters.date !== 'All time') {
        const daysAgo = getDaysAgo(job.postedDate);
        if (daysAgo === Infinity) return false; // Exclude non-date values when date filter is active? 
        // Or render them? Assuming if I filter for "Last 7 days", I only want recent posts.
        
        if (appliedFilters.date === 'Last 7 days' && daysAgo > 7) return false;
        if (appliedFilters.date === 'Last 14 days' && daysAgo > 14) return false;
        if (appliedFilters.date === 'Last 30 days' && daysAgo > 30) return false;
      }

      return true;
    });
  }, [allJobs, appliedFilters]);

  const handlePageChange = (page) => {
    dispatch(setJobsLoading(true));
    setTimeout(() => {
      dispatch(setJobsPage(page));
      dispatch(setJobsLoading(false));
    }, 300);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleJobAction = (job, actionType) => {
    if (actionType === 'apply') {
      navigate(`/hub/jobs/${job.id}/apply`);
    } else {
      navigate(`/hub/jobs/${job.id}`);
    }
  };

  const renderJobCard = (job) => {
    const metaParts = [job.company];
    if (job.location) metaParts.push(job.location);
    if (job.postedDate) metaParts.push(job.postedDate);
    const jobMeta = metaParts.join(' · ');

    return (
      <div key={job.id} className="job-card">
        <h6 className="job-title">{job.title}</h6>
        <p className="job-meta">{jobMeta}</p>
        <p className="job-description">{job.description}</p>
        <button
          className={`job-action-btn ${job.buttonType === 'apply' ? 'job-action-btn-apply' : 'job-action-btn-view'}`}
          onClick={() => handleJobAction(job, job.buttonType)}
        >
          {job.buttonType === 'apply' ? t('Apply') : t('View Details')}
        </button>
      </div>
    );
  };

  // Helper to determine active class for filter buttons
  const getFilterBtnClass = (isActive) => `filter-pill-btn ${isActive ? 'filter-pill-btn-active' : ''}`;

  const getDateLabel = (dateStr) => {
    const map = {
      'All time': 'AllTime',
      'Last 7 days': 'Last7Days',
      'Last 14 days': 'Last14Days',
      'Last 30 days': 'Last30Days'
    };
    return map[dateStr] ? t(map[dateStr]) : dateStr;
  }

  return (
    <div className="jobs-page">
      <TopHeader />
      <MainHeader 
        siteName={t('siteName') + ".IN"} 
        tagline={t('tagline')} 
      />
      <Navbar includeSearch={false} />

      <div className="jobs-filter-section">
        <div className="container-fluid">
          <div className="jobs-section-heading">
            <i className="bi bi-briefcase me-2"></i>
            <h2 className="jobs-heading-title">{t('Jobs')}</h2>
          </div>
          <div className="jobs-filter-row" ref={dropdownRef}>
            <div className="filter-buttons-container">
              
              {/* Category Filter */}
              <div className="filter-button-wrapper">
                <button
                  className={getFilterBtnClass(filters.category !== 'All' || openDropdown === 'category')}
                  onClick={() => toggleDropdown('category')}
                >
                  <i className="bi bi-stack me-2"></i>
                  <span>{filters.category === 'All' ? t('Categories') : t(filters.category)}</span>
                </button>
                {openDropdown === 'category' && (
                  <div className="filter-dropdown">
                    <button onClick={() => handleFilterChange('category', 'All')}>{t('AllCategories')}</button>
                    <button onClick={() => handleFilterChange('category', 'Government')}>{t('Government')}</button>
                    <button onClick={() => handleFilterChange('category', 'Private')}>{t('Private')}</button>
                    <button onClick={() => handleFilterChange('category', 'Internships')}>{t('Internships')}</button>
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div className="filter-button-wrapper">
                <button
                  className={getFilterBtnClass(filters.location !== 'All' || openDropdown === 'location')}
                  onClick={() => toggleDropdown('location')}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  <span>{filters.location === 'All' ? t('Location') : filters.location}</span>
                </button>
                {openDropdown === 'location' && (
                  <div className="filter-dropdown">
                    <button onClick={() => handleFilterChange('location', 'All')}>{t('AllLocations')}</button>
                    {uniqueLocations.map(loc => (
                      <button key={loc} onClick={() => handleFilterChange('location', loc)}>
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Filter */}
              <div className="filter-button-wrapper">
                <button
                  className={getFilterBtnClass(filters.date !== 'All time' || openDropdown === 'date')}
                  onClick={() => toggleDropdown('date')}
                >
                  <i className="bi bi-calendar me-2"></i>
                  <span>{filters.date === 'All time' ? t('Date') : getDateLabel(filters.date)}</span>
                </button>
                {openDropdown === 'date' && (
                  <div className="filter-dropdown">
                    <button onClick={() => handleFilterChange('date', 'All time')}>{t('AllTime')}</button>
                    <button onClick={() => handleFilterChange('date', 'Last 7 days')}>{t('Last7Days')}</button>
                    <button onClick={() => handleFilterChange('date', 'Last 14 days')}>{t('Last14Days')}</button>
                    <button onClick={() => handleFilterChange('date', 'Last 30 days')}>{t('Last30Days')}</button>
                  </div>
                )}
              </div>
            </div>

            <button
              className="btn btn-primary apply-filters-btn"
              onClick={handleApplyFilters}
            >
              {t('ApplyFilters')}
            </button>
          </div>
        </div>
      </div>

      <main className="jobs-main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="jobs-grid">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(renderJobCard)
                ) : (
                  <div className="no-jobs-found text-center py-5">
                    <h5 className="text-muted">{t('NoJobsFound')}</h5>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* pagination section */}
      <section className="jobs-pagination-section">
        <div className="container-fluid">
          <div className="jobs-pagination-panel">
            <div className="pagination-controls-group">
              <span className="pagination-status-chip">
                {t('Page')} {currentPage} {t('Of')} {totalPages}
              </span>
              <div className="pagination-controls">
                <button
                  className="btn pagination-chip-btn"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  1
                </button>
                <button
                  className="btn pagination-chip-btn"
                  onClick={() => handlePageChange(2)}
                  disabled={currentPage === 2}
                >
                  2
                </button>
                <button
                  className="btn pagination-chip-btn"
                  onClick={() => handlePageChange(3)}
                  disabled={currentPage === 3}
                >
                  3
                </button>
                <button
                  className="btn pagination-chip-btn pagination-chip-btn-primary"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages || isLoading}
                >
                  {t('Next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer 
        siteName={t('siteName') + ".IN"}
        tagline={t('FooterTagline')}
      />
    </div>
  );
};

export default JobsPage;
