import Header from '@/components/layout/Header'
import Hero from '@/components/home/Hero'
import ShowcaseGrid from '@/components/home/ShowcaseGrid'
import WhyChoose from '@/components/home/WhyChoose'

import BottomCTA from '@/components/home/BottomCTA'
import Footer from '@/components/layout/Footer'
import ScrollSection from '@/components/home/ScrollSection'

export default function HomePage() {
  return (
    <div className="bg-white">
      <Header variant="transparent" />

      <main>
        {/* Section 1: Hero (Base Layer) - White */}
        <ScrollSection zIndex={10} className="bg-white" safeZoneMultiplier={1.15}>
          <Hero />
        </ScrollSection>

        {/* Section 2: ShowcaseGrid - Cream/Beige */}
        <ScrollSection zIndex={20} safeZoneMultiplier={1.4}>
          <ShowcaseGrid />
        </ScrollSection>

        {/* Section 3: WhyChoose - Beige to Mint */}
        <ScrollSection zIndex={30} safeZoneMultiplier={1.4}>
          <WhyChoose />
        </ScrollSection>

        {/* Section 4: BottomCTA - Mint/Teal */}
        <ScrollSection zIndex={40} safeZoneMultiplier={1.4}>
          <BottomCTA />
        </ScrollSection>

        {/* Section 5: Footer (Final Layer) - White Finish */}
        <ScrollSection zIndex={60} className="bg-white" safeZoneMultiplier={1}>
          <Footer />
        </ScrollSection>
      </main>
    </div>
  )
}
