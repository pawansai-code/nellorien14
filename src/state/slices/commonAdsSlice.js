import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    commonAds: [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=250&fit=crop',
            title: 'Festival Electronics Sale',
            buttonText: 'Shop',
            buttonColor: 'blue',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop',
            title: 'Coaching Admissions Open',
            buttonText: 'Enroll',
            buttonColor: 'gray',
        },
    ],
    sponsored: [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop',
            title: 'Explore Maldives & Sri Lanka',
            subtitle: 'Curated packages from Chennai',
            buttonText: 'Book Now',
            buttonColor: 'blue',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop',
            title: 'Nellore Meals Festival',
            subtitle: '20% off this week',
            buttonText: 'Visit',
            buttonColor: 'gray',
        },
    ],
};

const commonAdsSlice = createSlice({
    name: 'commonAds',
    initialState,
    reducers: {},
});

export default commonAdsSlice.reducer;

