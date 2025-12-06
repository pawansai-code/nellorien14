import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topPicks: [
    {
      id: 1,
      name: 'Hotel Grand Peninsula',
      rating: 4.5,
      location: 'Near Penna River Bridge',
      price: 2800,
      priceUnit: 'night',
      amenities: ['On-site restaurant', 'Breakfast', 'Free Wi-Fi'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      isEditorChoice: true,
      actions: ['Book now', 'Save', 'Share'],
    },
    {
      id: 2,
      name: 'Simhapuri Heritage Inn',
      rating: 4.7,
      location: 'Old Market, near fort remains',
      price: 3400,
      priceUnit: 'night',
      amenities: ['Tea lounge', 'Courtyard', '24x7 desk'],
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
      isEditorChoice: true,
      actions: ['Check availability', 'Save', 'Share'],
    },
    {
      id: 3,
      name: 'Riverfront Budget Stay',
      rating: 4.1,
      location: 'Penna ghats',
      price: 1200,
      priceUnit: 'night',
      amenities: ['Wi-Fi', 'Parking'],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
      isEditorChoice: false,
      actions: ['Book now', 'Save', 'Share'],
    },
    {
      id: 4,
      name: 'Venkatesa Business Hotel',
      rating: 4.3,
      location: 'Near bus stand',
      price: 2000,
      priceUnit: 'night',
      amenities: ['Gym', 'Wi-Fi'],
      image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400',
      isEditorChoice: false,
      actions: ['Book now', 'Save', 'Share'],
    },
  ],

  quickFilters: [
    { id: 1, label: 'Price', icon: 'bi-currency-rupee' },
    { id: 2, label: 'Rating 4.0+', icon: 'bi-star-fill' },
    { id: 3, label: 'Near landmark', icon: 'bi-geo-alt-fill' },
    { id: 4, label: 'Free Wi-Fi', icon: 'bi-wifi' },
    { id: 5, label: 'Breakfast', icon: 'bi-cup-hot' },
    { id: 6, label: 'Parking', icon: 'bi-p-circle' },
  ],

  nearbyFoods: [
    {
      id: 1,
      name: 'Nellore Chepala Pulusu',
      description: 'Best spots within 2 km',
      label: 'Popular',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300',
    },
    {
      id: 2,
      name: 'Ulavacharu Biryani',
      description: 'Family-friendly places',
      label: 'Hot',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300',
    },
  ],

  commonAds: [
    {
      id: 1,
      title: 'Weekend Stay Sale',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      actionLabel: 'Grab offer',
    },
    {
      id: 2,
      title: 'Airport Pickup + Hotel',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
      actionLabel: 'Bundle now',
    },
  ],

  mapNearbyFilters: [
    { id: 1, label: 'Temples' },
    { id: 2, label: 'Food streets' },
    { id: 3, label: 'Bus stand' },
  ],

  staysPage: {
    currentPage: 1,
    totalPages: 5,
    isLoading: false,
  },

  filters: {
    priceRange: 'All',
    rating: 'All',
    nearLandmark: false,
    freeWiFi: false,
    breakfast: false,
    parking: false,
  },
};

const famousStaysSlice = createSlice({
  name: 'famousStays',
  initialState,
  reducers: {
    setStaysPage: (state, action) => {
      state.staysPage.currentPage = action.payload;
    },
    setStaysLoading: (state, action) => {
      state.staysPage.isLoading = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setStaysPage, setStaysLoading, updateFilters, resetFilters } = famousStaysSlice.actions;
export default famousStaysSlice.reducer;

