import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import MainHeader from '../../components/MainHeader';
import Navbar from '../../components/Navbar';
import TopHeader from '../../components/TopHeader';
import { setJobsLoading, setJobsPage } from '../../state/slices/newsSlice';
import './JobsPage.css';



const JobsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { govtJobs, privateJobs, internships } = useSelector((state) => state.news);
  const { currentPage, totalPages, isLoading } = useSelector((state) => state.news.jobsPage);

  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    date: 'Last 7 days',
    company: 'Any',
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
    // filters section
    console.log('Applying filters:', filters);
  };

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
          {job.buttonType === 'apply' ? 'Apply' : 'View Details'}
        </button>
      </div>
    );
  };


  return (
    <div className="jobs-page">
      <TopHeader />
      <MainHeader 
        siteName="NELLORIENS.IN" 
        tagline="Explore, Discover, Connect" 
      />
      <Navbar includeSearch={false} />

      <div className="jobs-filter-section">
        <div className="container-fluid">
          <div className="jobs-section-heading">
            <i className="bi bi-briefcase me-2"></i>
            <h2 className="jobs-heading-title">Jobs</h2>
          </div>
          <div className="jobs-filter-row" ref={dropdownRef}>
            <div className="filter-buttons-container">
              <div className="filter-button-wrapper">
                <button
                  className="filter-pill-btn filter-pill-btn-active"
                  onClick={() => toggleDropdown('category')}
                >
                  <i className="bi bi-stack me-2"></i>
                  <span>Categories</span>
                </button>
                {openDropdown === 'category' && (
                  <div className="filter-dropdown">
                    <button onClick={() => handleFilterChange('category', 'All')}>All</button>
                    <button onClick={() => handleFilterChange('category', 'Government')}>Government</button>
                    <button onClick={() => handleFilterChange('category', 'Private')}>Private</button>
                    <button onClick={() => handleFilterChange('category', 'Internships')}>Internships</button>
                  </div>
                )}
              </div>

              <div className="filter-button-wrapper">
                <button
                  className="filter-pill-btn"
                  onClick={() => toggleDropdown('location')}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  <span>Location: {filters.location}</span>
                </button>
                {openDropdown === 'location' && (
                  <div className="filter-dropdown">
                    <button onClick={() => handleFilterChange('location', 'All')}>All</button>
                    <button onClick={() => handleFilterChange('location', 'Nellore')}>Nellore</button>
                    <button onClick={() => handleFilterChange('location', 'Gudur')}>Gudur</button>
                    <button onClick={() => handleFilterChange('location', 'Kavali')}>Kavali</button>
                    <button onClick={() => handleFilterChange('location', 'Naidupeta')}>Naidupeta</button>
                  </div>
                )}
              </div>

              <div className="filter-button-wrapper">
                <button
                  className="filter-pill-btn"
                  onClick={() => toggleDropdown('date')}
                >
                  <i className="bi bi-calendar me-2"></i>
                  <span>Date: {filters.date}</span>
                </button>
                {openDropdown === 'date' && (
                  <div className="filter-dropdown">
                    <button onClick={() => handleFilterChange('date', 'Last 7 days')}>Last 7 days</button>
                    <button onClick={() => handleFilterChange('date', 'Last 14 days')}>Last 14 days</button>
                    <button onClick={() => handleFilterChange('date', 'Last 30 days')}>Last 30 days</button>
                    <button onClick={() => handleFilterChange('date', 'All time')}>All time</button>
                  </div>
                )}
              </div>
            </div>

            <button
              className="btn btn-primary apply-filters-btn"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <main className="jobs-main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="jobs-grid">
                {[...govtJobs, ...privateJobs, ...internships].map(renderJobCard)}
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
                Page {currentPage} of {totalPages}
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
                  Next
                </button>
              </div>
            </div>
            {/* <div className="pagination-loading-chip">
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading more...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Ready
                </>
              )}
            </div> */}
          </div>
        </div>
      </section>
      
      <Footer 
        siteName="NELLORIENS.IN"
        tagline="Your trusted gateway to explore Nellore - connecting you with opportunities, news, and destinations."
      />
    </div>
  );
};

export default JobsPage;
