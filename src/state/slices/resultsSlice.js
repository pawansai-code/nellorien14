import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resultsFilters: [
    { id: 1, label: 'All' },
    { id: 2, label: 'Schools' },
    { id: 3, label: 'Universities' },
    { id: 4, label: 'Govt Exams' },
    { id: 5, label: 'Medical' },
  ],
  resultsList: [
    {
      id: 1,
      title: 'Polytechnic Semester Results - Oct 2025',
      category: 'Universities',
      board: 'AP',
      session: '2024-25',
      tags: ['State Board', 'Published 2h ago', 'AP'],
      passPercentage: '72.4',
      description: 'Revaluation window from Oct 29-Nov 2. Help desks available at regional centers.',
      actions: ['View', 'Download PDF'],
      publishedDate: new Date('2025-10-27'),
    },
    {
      id: 2,
      title: 'Group-IV Merit List (Provisional)',
      category: 'Govt Exams',
      board: 'AP',
      session: '2024-25',
      tags: ['Govt Exams', 'Today', 'District'],
      description: 'Roll numbers shortlisted for certificate verification phase 1.',
      actions: ['Open', 'Cutoff'],
      publishedDate: new Date('2025-10-27'),
    },
    {
      id: 3,
      title: 'NEET Counselling Round 2 Seat Allotment',
      category: 'Medical',
      board: 'AP',
      session: '2024-25',
      tags: ['Medical', 'Updated 1h', 'State'],
      description: 'Download allotment list and report to institutes before Nov 3.',
      actions: ['Allotment', 'Instructions'],
      publishedDate: new Date('2025-10-27'),
    },
    {
      id: 4,
      title: 'SSC Supply Results - September 2025',
      category: 'Schools',
      board: 'AP',
      session: '2024-25',
      tags: ['Schools', 'Released', 'AP SSC'],
      description: 'Enter 10-digit hall ticket number to view detailed marks memo.',
      actions: ['Check', 'Marks Memo'],
      publishedDate: new Date('2025-10-26'),
    },
    {
      id: 5,
      title: 'Diploma Revaluation Results - Aug 2025',
      category: 'Universities',
      board: 'AP',
      session: '2024-25',
      tags: ['Revaluation', 'Now Live', 'AP SBTET'],
      description: 'Search by Pin/Reg No. Changes, if any, reflect in new consolidated marks.',
      actions: ['Search', 'Notification'],
      publishedDate: new Date('2025-10-25'),
    },
    {
      id: 6,
      title: 'Intermediate 1st Year Results - March 2025',
      category: 'Schools',
      board: 'AP',
      session: '2024-25',
      tags: ['Schools', 'Published 3h ago', 'AP BIE'],
      passPercentage: '68.2',
      description: 'Results declared for all streams. Download mark sheets from official portal.',
      actions: ['View', 'Download PDF'],
      publishedDate: new Date('2025-10-27'),
    },
    {
      id: 7,
      title: 'APPSC Group-2 Mains Results',
      category: 'Govt Exams',
      board: 'AP',
      session: '2024-25',
      tags: ['Govt Exams', 'Yesterday', 'State'],
      description: 'Merit list published. Document verification schedule to be announced soon.',
      actions: ['View Result', 'Merit List'],
      publishedDate: new Date('2025-10-26'),
    },
    {
      id: 8,
      title: 'Engineering 2nd Year Results - June 2025',
      category: 'Universities',
      board: 'AP',
      session: '2024-25',
      tags: ['Universities', 'Published 5h ago', 'JNTU'],
      passPercentage: '75.8',
      description: 'Regular and supply exam results available. Revaluation applications open.',
      actions: ['Check Result', 'Revaluation'],
      publishedDate: new Date('2025-10-27'),
    },
  ],
  resultsPage: {
    currentPage: 1,
    totalPages: 9,
    isLoading: false,
  },
  recentlyViewed: [
    { id: 1, title: 'Group-IV Merit List (Provisional)' },
    { id: 2, title: 'SSC Supply Results - Sep 2025' },
    { id: 3, title: 'Diploma Revaluation Results - Aug 2025' },
  ],
  importantLinks: [
    { id: 1, label: 'AP SBTET Official Portal', url: '#' },
    { id: 2, label: 'AP SSC Results', url: '#' },
    { id: 3, label: 'NEET Counselling', url: '#' },
  ],
  resultTools: [
    { id: 1, label: 'Select Exam Date', icon: 'bi-calendar-event' },
    { id: 2, label: 'Choose Region / District', icon: 'bi-geo-alt' },
    { id: 3, label: 'Set Alerts', icon: 'bi-bell' },
    { id: 4, label: 'Save this filter', icon: 'bi-bookmark' },
  ],
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResultsPage: (state, action) => {
      state.resultsPage.currentPage = action.payload;
    },
    setResultsLoading: (state, action) => {
      state.resultsPage.isLoading = action.payload;
    },
    addToRecentlyViewed: (state, action) => {
      const result = action.payload;
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(item => item.id !== result.id);
      // Add to beginning
      state.recentlyViewed.unshift({ id: result.id, title: result.title });
      // Keep only last 5
      state.recentlyViewed = state.recentlyViewed.slice(0, 5);
    },
  },
});

export const { 
  setResultsPage,
  setResultsLoading,
  addToRecentlyViewed
} = resultsSlice.actions;
export default resultsSlice.reducer;