export type TTrackingCoordinate = {
  lat: number;
  lng: number;
  timestamp: string; // ISO String from backend
};

export type TParcel = {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  pickupAddress: string;
  deliveryAddress: string;
  parcelType: string;
  isCOD: boolean;
  amount: number;
  status: "Booked" | "Picked Up" | "In Transit" | "Delivered" | "Failed";
  assignedAgent?: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
  trackingCoordinates: TTrackingCoordinate[];
  createdAt: string;
  updatedAt: string;
};
