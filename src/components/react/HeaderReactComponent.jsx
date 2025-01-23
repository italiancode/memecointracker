import React from 'react';
import logo from "/memecointracker-logo.png";

function HeaderReactComponent() {
  return (
    <div className="header flex items-center space-x-4">
          <img src={logo} alt="MemeCoin Tracker Logo" className="w-12 h-12" />
          <h1 className="font-bold whitespace-nowrap m-0">MemeCoin Tracker</h1>
        </div>
  );
}

export default HeaderReactComponent;
