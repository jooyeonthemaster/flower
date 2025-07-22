import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
import ProductSection from '@/components/sections/ProductSection'
import WhyChooseSection from '@/components/sections/WhyChooseSection'
import TestimonialSection from '@/components/sections/TestimonialSection'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProductSection />
        <WhyChooseSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
