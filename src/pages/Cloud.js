import React from "react";
import { Outlet } from "react-router-dom";

import CLLayout from "../components/Layout/CL-Layout.js";
import Cloud from "../components/CL-Pages/Cloud.js";
import MainNavigation from "../components/CL-Pages/MainNavigation.js";


const CloudPage = () => {

  return (
    <CLLayout>
      <Cloud>
        <MainNavigation>
          <Outlet />
        </MainNavigation>
      </Cloud>
    </CLLayout>
  );
};

export default CloudPage;
