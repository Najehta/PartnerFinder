import React from "react";
import "./Footer.css";
import EuLogo from "../photos/EuLogo.png";
import BsfLogo from "../photos/BsfLogo.jpg";
import InnovationLogo from "../photos/InnovationLogo.jpg";
import TechnionLogo from "../photos/TechnionLogo.jpg";
import MstLogo from "../photos/MstLogo.jpg";
import IsfLogo from "../photos/IsfLogo.jpg";
/**
 * component for implementaion the footer to the website with all the organizations logos and links on the logos
 */
class Footer extends React.Component {
  render() {
    return (
      <div className="wrapper-film">
        <div className="partnerFooter">
          <a
            href="https://ec.europa.eu/info/index_en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="logoIcon" src={EuLogo} alt="EuLogo" />;
          </a>
          <a
            href="https://www.bsf.org.il"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="logoIcon" src={BsfLogo} alt="BsfLogo" />;
          </a>
          <a
            href="https://innovationisrael.org.il/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="logoIcon"
              src={InnovationLogo}
              alt="InnovationLogo"
            />
            ;
          </a>
          <a
            href="https://www.trdf.co.il/eng/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="logoIcon" src={TechnionLogo} alt="TechnionLogo" />;
          </a>
          <a
            href="https://www.gov.il/he/departments/ministry_of_science_and_technology"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="logoIcon" src={MstLogo} alt="MstLogo" />;
          </a>
          <a
            href="https://www.isf.org.il/#/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="logoIcon" src={IsfLogo} alt="IsfLogo" />;
          </a>
        </div>
      </div>
    );
  }
}

export default Footer;
