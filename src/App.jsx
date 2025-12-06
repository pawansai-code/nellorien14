import { Navigate, Route, Routes } from "react-router-dom";
import BreakingNews from "./components/BreakingNews";
import { MainContentArea } from "./components/ContentSections";
import Footer from "./components/Footer";
// import { HeroSection, SidebarNavigation } from "./components/HomePage";
import MainHeader from "./components/MainHeader";
import Navbar from "./components/Navbar";
import TopHeader from "./components/TopHeader";
import Banner from "./Layout/CustomHeader/Banner";
import Famousfood from "./Pages/Famousfood/Famousfood.jsx";
import FamousstayPage from "./Pages/FamousstayPage/FamousstayPage.jsx";
import HistoryPage from "./Pages/HistoryPage/HistoryPage.jsx";
import { HubHomePage } from "./Pages/HomePage/HubHomePage";
import JobsPage from "./Pages/JobsPage";
import NewsPage from "./Pages/NewsPage";
import NotificationPage from "./Pages/NotificationPage/NotificationPage.jsx";
import ResultsPage from "./Pages/ResultsPage/ResultsPage.jsx";
import UpdatesPage from "./Pages/UpdatesPage";
import "./styles/App.css";
import EventsPage from "./Pages/EventsPage/EventsPage.jsx";
import SportsPage from "./Pages/SportsPage/SportsPage.jsx";
import ArticlesPage from "./Pages/ArticlesPage/ArticlesPage.jsx";

function HomePage() {
  return (
    <div>
      <TopHeader />
      <MainHeader
        siteName="NELLORIENS.IN"
        tagline="Explore, Discover, Connect"
      />
      <BreakingNews />
      <Navbar />
      <Banner />
      {/* <main className="main-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <HeroSection />
            </div>
            <div className="col-lg-4">
              <SidebarNavigation />
            </div>
          </div>
        </div>
      </main> */}
      <MainContentArea />

      <Footer
        siteName="NELLORIENS.IN"
        tagline="Your trusted gateway to explore Nellore - connecting you with opportunities, news, and destinations."
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hub" element={<HubHomePage />} />
      <Route path="/hub/jobs" element={<JobsPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/hub/updates" element={<UpdatesPage />} />
      <Route path="/updates" element={<UpdatesPage />} />
      <Route path="/hub/news" element={<NewsPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/hub/results" element={<ResultsPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/hub/history" element={<HistoryPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/hub/notifications" element={<NotificationPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/hub/famousstay" element={<FamousstayPage />} />
      <Route path="/famousstay" element={<FamousstayPage />} />
      <Route path="/hub/famousFood" element={<Famousfood />} />
      <Route path="/famousFood" element={<Famousfood />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/hub/Events" element={<EventsPage />} />
      <Route path="/sports" element={<SportsPage />} />
      <Route path="/hub/Sports" element={<SportsPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/hub/Articles" element={<ArticlesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
