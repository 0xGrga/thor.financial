import { MdOutlineDashboard } from "react-icons/md";
import { BiPieChartAlt2 } from "react-icons/bi";
import { SiReadthedocs } from "react-icons/si";
import { FaBurn } from "react-icons/fa";

import { Link } from "react-router-dom";

import "./sidebar.scss";

const Sidebar = ({ sidebar }) => {
  return (
    <nav className="sidebar">
      <Link to="/">
        <li>
          <MdOutlineDashboard size={23}/>
          <span>Dashboard</span>
        </li>
      </Link>
      <Link to="/buybacks">
        <li>
          <FaBurn size={23}/>
          <span>Buybacks</span>
        </li>
      </Link>
      <Link to="/portfolio">
        <li>
          <BiPieChartAlt2 size={23}/>
          <span>Portfolio</span>
        </li>
      </Link>
      {
        /*
        <Link to="/">
          <li>
            <MdOutlineHowToVote size={23}/>
            <span>Vote</span>
          </li>
        </Link>
        */
      }
      <a href="https://docs.thor.financial/docs/guides/disclaimer"  target="_blank" rel="noreferrer">
        <li>
          <SiReadthedocs size={23}/>
          <span>Docs</span>
        </li>
      </a>
    </nav>
  );
};

export default Sidebar;
