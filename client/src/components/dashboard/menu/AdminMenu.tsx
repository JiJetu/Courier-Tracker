import MenuItem from "./MenuItem";
import { BsPeople, BsBox } from "react-icons/bs";
import { MdOutlineTrackChanges } from "react-icons/md";

const AdminMenu = () => {
  return (
    <>
      {/* <MenuItem icon={BsGraphUp} label="Statistics" address="/dashboard" /> */}
      <MenuItem
        icon={BsPeople}
        label="Manage Users"
        address="/dashboard/manage-users"
      />
      <MenuItem
        icon={BsBox}
        label="Manage Parcels"
        address="/dashboard/manage-parcels"
      />
      <MenuItem
        icon={MdOutlineTrackChanges}
        label="All Tracking"
        address="/dashboard/all-tracking"
      />
    </>
  );
};

export default AdminMenu;
