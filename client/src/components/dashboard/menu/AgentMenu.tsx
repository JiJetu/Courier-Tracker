import MenuItem from "./MenuItem";
import { BsBoxSeam, BsMap } from "react-icons/bs";

const AgentMenu = () => {
  return (
    <>
      <MenuItem
        icon={BsBoxSeam}
        label="Assigned Parcels"
        address="/dashboard/my-assigned-parcels"
      />
      <MenuItem
        icon={BsMap}
        label="Live Tracking"
        address="/dashboard/live-tracking"
      />
    </>
  );
};

export default AgentMenu;
