import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import Ambassadors from "@/components/Ambassadors";
import BettingOptions from "@/components/BettingOptions";
import WhyDifferent from "@/components/WhyDifferent";
import EventsTours from "@/components/EventsTours";
import TownshipGallery from "@/components/TownshipGallery";
import HowItWorks from "@/components/HowItWorks";
import Promotions from "@/components/Promotions";
import Testimonials from "@/components/Testimonials";
import StadiumGallery from "@/components/StadiumGallery";
import ResponsibleBetting from "@/components/ResponsibleBetting";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TrustBar />
      <Ambassadors />
      <BettingOptions />
      <WhyDifferent />
      <EventsTours />
      <TownshipGallery />
      <HowItWorks />
      <Promotions />
      <Testimonials />
      <StadiumGallery />
      <ResponsibleBetting />
      <Footer />
    </div>
  );
};

export default Index;