import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import newsReducer from './slices/newsSlice';
import homepageReducer from './slices/homepageSlice';
import resultsReducer from './slices/resultsSlice';
import notificationReducer from './slices/notificationSlice';
import famousStaysReducer from './slices/famousStaysSlice';
import famousFoodsReducer from './slices/famousFoodsSlice';
import eventsReducer from './slices/eventsSlice';
import sportsReducer from './slices/sportsSlice';
import articlesReducer from './slices/articlesSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    news: newsReducer,
    homepage: homepageReducer,
    results: resultsReducer,
    notifications: notificationReducer,
    famousStays: famousStaysReducer,
    famousFoods: famousFoodsReducer,
    events: eventsReducer,
    sports: sportsReducer,
    articles: articlesReducer,
  },
});