export type TTrackingCoordinate = {
  lat: number;
  lng: number;
  timestamp: string;
};

export type TUser = {
  _id: string;
  name: string;
  email: string;
  image: string;
  role?: string;
  isBlocked: boolean;
};

export type TParcelStatus =
  | "Pending"
  | "Booked"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Failed";

export type TParcel = {
  _id: string;
  sender: TUser;
  pickupAddress: string;
  deliveryAddress: string;
  parcelType: string;
  isCOD: boolean;
  amount: number;
  status: TParcelStatus;
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
