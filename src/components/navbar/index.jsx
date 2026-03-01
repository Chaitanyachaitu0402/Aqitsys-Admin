import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import avatar from "assets/img/avatars/avatar4.png";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const navigate = useNavigate();

  // ✅ Logout Function
  const handleLogout = () => {
    // Clear any stored data (important if later using auth)
    localStorage.clear();
    sessionStorage.clear();

    // Redirect and replace history (disables back button)
    navigate("/auth/sign-in", { replace: true });

    // Extra protection: remove previous history entry
    window.history.pushState(null, null, "/auth/sign-in");
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white"
            href=" "
          >
            Pages
            <span className="mx-1"> / </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>

        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-fit items-center gap-4 rounded-full bg-white px-4 py-2 shadow-xl dark:!bg-navy-800">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        {/* Dark Mode Toggle */}
        {/* <div
    className="cursor-pointer text-gray-600 dark:text-white"
    onClick={() => {
      if (darkmode) {
        document.body.classList.remove("dark");
        setDarkmode(false);
      } else {
        document.body.classList.add("dark");
        setDarkmode(true);
      }
    }}
  >
    {darkmode ? (
      <RiSunFill className="h-5 w-5" />
    ) : (
      <RiMoonFill className="h-5 w-5" />
    )}
  </div> */}

        {/* Profile Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 cursor-pointer rounded-full"
              src={avatar}
              alt="Profile"
            />
          }
          children={
            <div className="flex w-56 flex-col rounded-[20px] bg-white shadow-xl dark:!bg-navy-700 dark:text-white">
              <div className="p-4">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  👋 Hey, JReddy
                </p>
              </div>

              <div className="h-px w-full bg-gray-200 dark:bg-white/20" />

              <div className="flex flex-col p-4">
                <button
                  onClick={handleLogout}
                  className="mt-3 text-left text-sm font-medium text-red-500 transition duration-150 hover:text-red-600"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[140px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
