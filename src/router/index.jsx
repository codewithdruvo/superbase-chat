import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatOutlet from "../outlet/ChatOutlet";
import GuestOutlet from "../outlet/GuestOutlet";
import PrivateOutlet from "../outlet/PrivateOutlet";
import LoginPage from "../pages/Auth/Login";
import Chat from "../pages/Chat";
import Community from "../pages/Community";
import Subscribe from "../pages/Onboarding/Subscribe";
import paths from "./routes";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestOutlet />}>
          <Route path={paths.auth.login} element={<LoginPage />} />
        </Route>
        <Route element={<PrivateOutlet />}>
          <Route element={<ChatOutlet />}>
            <Route path={paths.root} element={<Chat />} />
            {/* <Route path="/onboarding" element={<Onboarding />} /> */}
            <Route path={paths.channels.root} element={<Chat />} />
            <Route
              path={paths.channels.details(":chatId")}
              element={<Community />}
            />
            <Route path={paths.dm(":chatId")} element={<Community />} />
          </Route>
          <Route path="/subscribe" element={<Subscribe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
