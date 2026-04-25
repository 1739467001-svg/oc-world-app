import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Radar from "./pages/Radar";
import Chat from "./pages/Chat";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import AvatarGenerator from "./pages/AvatarGenerator";
import SocialCard from "./pages/SocialCard";
import EmojiCreator from "./pages/EmojiCreator";
import MerchDesign from "./pages/MerchDesign";
import Market from "./pages/Market";
import WorldBuilding from "./pages/WorldBuilding";
import Icebreaker from "./pages/Icebreaker";
import OCInteraction from "./pages/OCInteraction";
import OCSocial from "./pages/OCSocial";
import DeFiDashboard from "./pages/DeFiDashboard";
import DeFiStaking from "./pages/DeFiStaking";
import DeFiPools from "./pages/DeFiPools";
import DeFiGovernance from "./pages/DeFiGovernance";

// Placeholder for character detail
const Character = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="pixel-card p-8 bg-white text-center">
      <span className="text-6xl block mb-4">🧙‍♂️</span>
      <h2 className="text-2xl font-bold">角色详情</h2>
      <p className="text-gray-600">开发中...</p>
    </div>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/character/:id" element={<Character />} />
                <Route path="/radar" element={<Radar />} />
                <Route path="/chat/:ocId" element={<Chat />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/avatar" element={<AvatarGenerator />} />
                <Route path="/card" element={<SocialCard />} />
                <Route path="/emoji" element={<EmojiCreator />} />
                <Route path="/merch" element={<MerchDesign />} />
                <Route path="/market" element={<Market />} />
                <Route path="/world" element={<WorldBuilding />} />
                <Route path="/icebreaker" element={<Icebreaker />} />
                <Route path="/oc-interact" element={<OCInteraction />} />
                <Route path="/oc-social" element={<OCSocial />} />
                <Route path="/defi" element={<DeFiDashboard />} />
                <Route path="/defi/stake" element={<DeFiStaking />} />
                <Route path="/defi/pools" element={<DeFiPools />} />
                <Route path="/defi/governance" element={<DeFiGovernance />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
