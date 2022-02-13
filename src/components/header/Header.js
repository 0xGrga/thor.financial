import "./header.scss";

const Header = () => {
  return (
    <div className="header">
      <a href="/">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="icon" className="header_logo" />
      </a>
      <a href="/">
        Thor Financial
      </a>
    </div>
  );
};

export default Header;
