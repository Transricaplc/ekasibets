import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import BettingOptions from "@/components/BettingOptions";
import WhyDifferent from "@/components/WhyDifferent";
import HowItWorks from "@/components/HowItWorks";
import Promotions from "@/components/Promotions";
import TownshipGallery from "@/components/TownshipGallery";
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
      <BettingOptions />
      <WhyDifferent />
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
