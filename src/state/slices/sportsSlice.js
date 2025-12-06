import { createSlice } from "@reduxjs/toolkit";
import sportsHero from "../../assets/images/sports-hero.jpg";

const initialState = {
  // Hero Section
  heroImage: sportsHero,
  heroImageAlt: "Sports hero image",

  // Categories for filter
  categories: [
    { id: 1, label: "All" },
    { id: 2, label: "Cricket" },
    { id: 3, label: "Volleyball" },
    { id: 4, label: "Kabaddi" },
    { id: 5, label: "Athletics" },
    { id: 6, label: "Football" },
  ],

  // Regions for filter
  regions: [
    { id: 1, label: "All" },
    { id: 2, label: "Nellore" },
    { id: 3, label: "Gudur" },
    { id: 4, label: "Kavali" },
    { id: 5, label: "Mypadu" },
  ],

  // Live Scores
  liveScores: [
    {
      id: 1,
      match: "Nellore XI vs Gudur CC",
      sport: "Cricket",
      score: "134/6 (17.2)",
      type: "T20",
      isLive: true,
    },
    {
      id: 2,
      match: "District Qualifiers Court-2",
      sport: "Volleyball",
      score: "Set 2 - 18-16",
      type: "Live",
      isLive: true,
    },
  ],

  // Upcoming Fixtures
  upcomingFixtures: [
    {
      id: 1,
      title: "School Cricket Finals",
      date: "Fri",
      time: "3:30 PM",
      location: "Municipal Ground",
      category: "Cricket",
    },
    {
      id: 2,
      title: "Kabaddi Zonal Semis",
      date: "Sat",
      time: "6:00 PM",
      location: "Stadium Court A",
      category: "Kabaddi",
    },
    {
      id: 3,
      title: "10K City Marathon",
      date: "Sun",
      time: "5:30 AM",
      location: "Beach Road",
      category: "Athletics",
    },
    {
      id: 4,
      title: "Inter-school Volleyball Finals",
      date: "Sun",
      time: "4:00 PM",
      location: "Indoor Arena",
      category: "Volleyball",
    },
  ],

  // Sports News
  sportsNews: [
    {
      id: 1,
      title: "National Games: State clinches 3 golds in athletics",
      posted: "2h ago",
      tag: "Featured",
    },
    {
      id: 2,
      title: "District volleyball trials draw record turnout",
      posted: "4h ago",
      tag: "Local",
    },
    {
      id: 3,
      title: "School cricket league announces new format",
      posted: "Yesterday",
      tag: "Update",
    },
    {
      id: 4,
      title: "Nellore runner qualifies for state marathon finals",
      posted: "2d ago",
      tag: "Athletics",
    },
  ],

  // News Lines
  newsLines: [
    {
      id: 1,
      text: "Cricket: Rain delay expected at Municipal Ground",
    },
    {
      id: 2,
      text: "Volleyball qualifiers day-2 schedule updated",
    },
    {
      id: 3,
      text: "Marathon bib distribution from Friday 10 AM",
    },
  ],

  // Standings
  standings: {
    league: "School Cricket League",
    teams: [
      {
        id: 1,
        name: "Nellore Titans",
        played: 6,
        points: 10,
      },
      {
        id: 2,
        name: "Gudur Warriors",
        played: 6,
        points: 8,
      },
      {
        id: 3,
        name: "Sullur Stars",
        played: 6,
        points: 6,
      },
      {
        id: 4,
        name: "Kovur Kings",
        played: 6,
        points: 4,
      },
    ],
  },

  // Sponsored Content
  sponsored: {
    title: "Buy Sports Gear - Local Stores",
    tags: ["Cricket", "Volleyball", "Running"],
    action: "Explore Offers",
  },

  // Active filters
  activeFilters: {
    category: "All",
    region: "All",
  },
};

const sportsSlice = createSlice({
  name: "sports",
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeFilters.category = action.payload;
    },
    setActiveRegion: (state, action) => {
      state.activeFilters.region = action.payload;
    },
    resetFilters: (state) => {
      state.activeFilters = {
        category: "All",
        region: "All",
      };
    },
  },
});

export const setSportsCategory = sportsSlice.actions.setActiveCategory;
export const setSportsRegion = sportsSlice.actions.setActiveRegion;
export const resetSportsFilters = sportsSlice.actions.resetFilters;

export default sportsSlice.reducer;
