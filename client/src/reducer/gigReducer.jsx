export const INIT_STATE = {
  userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
  title: "",
  cat: "",
  cover: "",
  images: [],
  description: "",
  shortTitle: "",
  shortDesc: "",
  deliveryTime: 0,          // Will represent estimated service time in hours
  revisionNumber: 0,         // Less relevant for services, but maintaining for compatibility
  features: [],
  price: 0,
  
  // New fields for home services
  serviceArea: "",          // Geographic coverage area
  hourlyRate: 0,            // Optional hourly rate
  hasUrgent: false,         // Offers urgent/same-day service
  materialsCost: 0,         // Estimated materials cost
  certifications: [],       // Professional certifications
  insurance: false,         // Has insurance/bonding
  availability: {           // Service availability
    monday: true,
    tuesday: true,
    wednesday: true, 
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    evenings: false,
    holidays: false
  }
};

export const gigReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        cover: action.payload.cover,
        images: action.payload.images,
      };
    case "ADD_FEATURE":
      return { ...state, features: [...state.features, action.payload] };
    case "REMOVE_FEATURE":
      return {
        ...state,
        features: state.features.filter((feat) => feat != action.payload),
      };
    case "ADD_CERTIFICATION":
      return { ...state, certifications: [...state.certifications, action.payload] };
    case "REMOVE_CERTIFICATION":
      return {
        ...state,
        certifications: state.certifications.filter((cert) => cert != action.payload),
      };
    case "TOGGLE_AVAILABILITY":
      return {
        ...state,
        availability: {
          ...state.availability,
          [action.payload]: !state.availability[action.payload]
        }
      };
    case "SET_INSURANCE":
      return {
        ...state,
        insurance: action.payload
      };
    case "TOGGLE_URGENT":
      return {
        ...state,
        hasUrgent: !state.hasUrgent
      };
    default:
      return state;
  }
};