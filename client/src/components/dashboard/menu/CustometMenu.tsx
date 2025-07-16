import { BsClipboardPlus, BsTruck } from "react-icons/bs";
import MenuItem from "./MenuItem";

const CustomerMenu = () => (
  <>
    <MenuItem
      icon={BsClipboardPlus}
      label="Book Parcel"
      address="/dashboard/book-parcel"
    />
    <MenuItem
      icon={BsTruck}
      label="My Parcels"
      address="/dashboard/my-parcels"
    />
  </>
);

export default CustomerMenu;
