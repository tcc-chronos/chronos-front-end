import LinkPage from '../../../../widgets/link-page';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white w-full shadow-xs">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-full-xl px-3.5 py-2.5">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src='/Chronos.svg' className="h-12" alt="Logo" />
          <span className="self-center text-2xl font-poppins-bold whitespace-nowrap">
            Chronos
          </span>
        </a>
        <div
          id="mega-menu-full"
          className="items-center justify-between font-medium hidden w-full md:flex md:w-auto md:order-1"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50  rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <LinkPage to='/Training'>Training</LinkPage>
            </li>
            <li>
              <LinkPage to='/Dashboard'>Dashboard</LinkPage>
            </li>
            <li>
              <LinkPage to='/Documentation'>Documentation</LinkPage>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
