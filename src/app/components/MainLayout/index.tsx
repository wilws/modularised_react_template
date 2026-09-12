import { Outlet } from "react-router-dom";
import { Box } from "../Basic";
import { Footer } from "../Footer";
import { Header } from "../Header";
import style from "./index.module.scss";

/**
 * The single shell every module route renders inside. Modules fill <Outlet />
 * and know nothing about the chrome around them.
 */
export const MainLayout = () => (
  <Box className={style.layout}>
    <Header />
    <Box component="main" className={style.mainContent}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);
