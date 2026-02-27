import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ListView from './pages/ListView'
import DetailsPage from './pages/DetailsPage'
import { ToastContainer } from 'react-toastify';
import ProfilePage from './components/ProfilePage'
import PostProperty from './components/Models/PostProperty'
import WishlistPage from './components/WishlistPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import SetPassword from './pages/SetPassword'
import ChangePassword from './pages/ChangePassword'
import Interior from './pages/Interior'
import PopularInteriorDesign from './components/PopularInteriorDesign'
import "./styles/responsive.css"
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import BlogGrid from './pages/BlogGrid';
import SingleBlog from './pages/SingleBlog';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
      <Navbar /> 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/interior' element={<PopularInteriorDesign />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path='/set-password' element={<SetPassword />} />
          <Route path='/list-view' element={<ListView />} />
         {/* Blog Routes - Moved up for priority */}
          <Route path="/blogs" element={<BlogGrid />} />
          <Route path="/blog/:slug" element={<SingleBlog />} />
          {/* Footer area route */}
          <Route path='/:slug' element={<ListView />} />
         <Route path="/:slug" element={<ListView />} />
          <Route path="/property-below-70l" element={<ListView />} />
          {/* Nav bar location route */}
          <Route path='/list-view/:property_area' element={<ListView />} />
          {/* SEO-friendly static routes (same ListView page) */}
          <Route path='/properties-for-sale-in-chennai' element={<ListView />} />
          <Route path='/best-deals' element={<ListView />} />
          <Route path='/luxury-homes-in-chennai' element={<ListView />} />
          <Route path='/best-location-picks' element={<ListView />} />
          <Route path='/apartments-in-chennai' element={<ListView />} />
          <Route path='/villas-in-chennai' element={<ListView />} />
          <Route path='/plots-in-chennai' element={<ListView />} />
          <Route path='/individual-houses-in-Chennai' element={<ListView />} />
          <Route path='/nri-investment' element={<ListView />} />
          <Route path='/details' element={<DetailsPage />} />
          <Route path='/details/:id/:title' element={<DetailsPage />} />
          <Route path='/property/:id' element={<DetailsPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/post-property' element={<PostProperty />} />
          <Route path='/wish-list' element={<WishlistPage />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/refund-policy' element={<RefundPolicy />} />
          <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App