import { BsClipboardCheck, BsFillArchiveFill, BsList, BsGrid1X2Fill, BsPeopleFill } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaCoins, FaCogs, FaIndustry, FaCommentDollar, FaChartPie, FaTools, FaBuilding, FaBullhorn, FaArchive, FaUsersCog, FaSignOutAlt } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { FaListCheck } from "react-icons/fa6";
import { TbChecklist } from "react-icons/tb";
import { MdFiberNew } from "react-icons/md";
import { AiOutlineHome ,AiOutlineInbox, AiOutlineLink  } from "react-icons/ai";
import { FiCheckCircle, FiSettings } from "react-icons/fi";
import { HiOutlineChartBar } from "react-icons/hi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const linkClasses =
  "flex items-center gap-4 px-3 py-2 text-gray-200 hover:bg-blue-700 hover:text-white rounded-md transition-colors duration-200 no-underline";

const linkClassesHeader =
  "flex items-center gap-4 px-3 py-2 mt-4 text-gray-200 hover:bg-blue-700 hover:text-white font-semibold rounded-md transition-colors duration-200 no-underline";


const Sidebar = ({ isOpen, toggleSidebar, projectsData }) => {
  const { displayname, isManager, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState({});
  const [selectedMenu, setSelectedMenu] = useState(""); // Track selected menu
  const navigate = useNavigate();
  const [sendLogout, { isSuccess }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const handleMenuClick = (path) => {
    setSelectedMenu(path); // Set the selected menu
  };

  const toggleMenu = (key) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuDataTop = [
    {
      title: "Dashboard",
      icon: <AiOutlineHome  />,
      key: "home",
      children: [
        { label: "Dashboard", path: "/dash", icon: <IoNewspaperOutline  /> },
      ],
    },
    {
      title: "Transaction",
      icon: <AiOutlineHome  />,
      key: "home",
      children: [
        { label: "Transaction", path: "/dash/transactions", icon: <IoNewspaperOutline  /> },
      ],
    },
    {
      title: "Report",
      icon: <AiOutlineInbox />,
      key: "sourceDocuments",
      children: [
        { label: "Finance Report", path: "/dash/report", icon: <AiOutlineInbox /> },
      ],
    }
  ]

  const menuDataBottom = [
    
  ];


  return (
    <>
      <div className={`bg-blue-600 flex flex-col h-full p-2 text-white fixed top-0 left-0 z-50`} style={{ width: isOpen ? "16rem" : "3rem" }}>
      {/* div utama */}
      <div className="relative flex flex-col h-full justify-between">
        {/* Sidebar toggle button */}
        <div className="flex flex-col items-center absolute top-2.5 right-0">
          <button id="menu-button" onClick={toggleSidebar} className="p-2 bg-blue-600 font-bold">
            <BsList fontSize={20} />
          </button>

          {/* div ketika side bar collapsed !isOpen*/}
          {!isOpen && (
            <div
              id="vertical-label"
              className="writing-mode-vertical flex items-center justify-center h-full text-center pl-1"
              style={{ writingMode: "vertical-lr", textOrientation: "mixed", transform: "rotate(180deg)"}}
            >
              Click the list to see the menu
            </div>
          )}
        </div>


        {/* Percobaan untuk flex cols supaya numpuk ke atas fragmen blue di side bar */}
        <div className="flex flex-col">
          {/* 0. Side Bar Menu Header, title is here */}
          {isOpen && (
            <>
              <div className="flex flex-col">
                {/* div for application title */}
                <div className="flex items-center gap-2 px-2 py-3 text-white">
                  <img src="/img/sdg-white.png" alt="sdg" className="w-8" />
                  <span className="text-neutral-100 text-md">Finance App X</span>
                </div>
              </div>           
            </>
          )}


          {/* 1. Side Bar Menu TOP Part */}
          {isOpen && (
            <>
              <div className="flex flex-col">


                {/* div for menu side bar TOP Part*/}
                <ul className="flex flex-col gap-1 mt-2">
                  {menuDataTop.map((menu) => (
                    <li key={menu.key} className="cursor-pointer" onClick={() => toggleMenu(menu.key)}>
                      <div className={linkClasses}>
                        {menu.icon}
                        <span>{menu.title}</span>
                      </div>
                      {collapsed[menu.key] && (
                      <ul className="pl-4">
                        {menu.children.map((child, index) => (
                          <li
                            key={index}
                            className={`${linkClasses} ${selectedMenu === child.path ? "bg-neutral-700" : ""}`} // Highlight selected menu
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent collapsing the parent
                              handleMenuClick(child.path);
                            }}
                          >
                          <NavLink
                            to={child.path}
                            className={`w-full flex items-center gap-2 p-1 rounded-sm ${
                              selectedMenu === child.path
                                ? "text-white bg-neutral-700" // Selected menu: white text with a slightly darker background
                                : "text-gray-300 hover:text-white hover:bg-neutral-800" // Normal and hover states
                            }`}
                          >
                            {child.icon}
                            {child.label}
                          </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* <>
            <hr></hr>
          </> */}

          {/* 2. Side Bar Menu BOTTOM Part */}
          {isOpen && (
            <>
              <div className="flex flex-col">
                {/* <span className="text-sm text-gray-400">Campaign: {selectedCampaign}</span>
                <span className="text-sm text-gray-400">Scheme Name: {selectedSchemeName}</span>

                {isSuccess && (
                  <div className="text-gray-800">
                    <select className="rounded-md text-sm mt-5" id="campaignSelect" value={selectedCampaignStatus} onChange={handleSelectCampaignStatus}>
                      <option value="open" >Open campaign</option>
                      <option value="closed" >Closed campaign</option>
                    </select>

                    <select className="rounded-md text-sm mt-5" id="campaignSelect" value={selectedCampaign} onChange={handleSelectChange}>
                      <option value="" disabled>--Select a campaign--</option>
                      {campaignsList.map((campaign, index) => (
                        <option key={index} value={campaign.title}>
                          {campaign.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}
              

              </div>
            </>
          )}        
        
          {/* 3. Side Bar Menu FOOTER Part */}
          {isOpen && (
            <>
              <div className="pt-10">
                <button  onClick={sendLogout}>Sign Out</button>
              </div>

              
            </>
          )}
        </div>

      </div>
      </div>   
    </>


    
  );
};

export default Sidebar;
