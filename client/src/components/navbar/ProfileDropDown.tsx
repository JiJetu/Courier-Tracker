import { Link } from "react-router-dom";
import avatarImg from "../../assets/images/placeholder.jpg";

const ProfileDropDown = () => {
  //   const user = "user";
  //   const dispatch = useAppDispatch();
  //   const [logoutUser] = useLogoutMutation();

  const handleLogout = async () => {
    // remove local storage data
    // dispatch(logout());
    // await logoutUser(undefined);
  };

  const ProfileDropDownItems = (
    <>
      <li>
        <Link to={"/dashboard/profile"}>Profile</Link>
      </li>
      <li>
        <Link to={"/dashboard"}>Dashboard</Link>
      </li>

      <li className="mt-2 font-bold">
        <button onClick={handleLogout}>Logout</button>
      </li>
    </>
  );
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="User image"
            referrerPolicy="no-referrer"
            src={avatarImg}
            // src={user && user?.image ? user?.image : avatarImg}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
      >
        {ProfileDropDownItems}
      </ul>
    </div>
  );
};

export default ProfileDropDown;
