export type TTrackingCoordinate = {
  lat: number;
  lng: number;
  timestamp: string; // ISO String from backend
};

export type TUser = {
  _id: string;
  name: string;
  email: string;
  image: string;
  role?: string;
  isBlocked: boolean;
};

export type TParcel = {
  _id: string;
  sender: TUser;
  pickupAddress: string;
  deliveryAddress: string;
  parcelType: string;
  isCOD: boolean;
  amount: number;
  status: "Booked" | "Picked Up" | "In Transit" | "Delivered" | "Failed";
  assignedAgent?: TUser;
  trackingCoordinates: TTrackingCoordinate[];
  createdAt: string;
  updatedAt: string;
};

export type TParcelForm = {
  pickupAddress: string;
  deliveryAddress: string;
  parcelType: string;
  amount: number;
  isCOD: boolean;
};
