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
        <ScrollSection zIndex={10} className="h-screen bg-white">
          <Hero />
        </ScrollSection>

        {/* Section 2: Features (Overlaps Hero) - Clearly Gray */}
        <ScrollSection zIndex={20} className="min-h-screen bg-slate-200 border-t border-gray-200 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
          <ShowcaseGrid />
        </ScrollSection>

        {/* Section 3: Why Choose (Overlaps Features) - Clearly Sky */}
        <ScrollSection zIndex={30} className="min-h-screen bg-sky-200 border-t border-sky-300 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
          <WhyChoose />
        </ScrollSection>

        {/* Section 4: CTA (Moved Up) - Clearly Indigo */}
        <ScrollSection zIndex={40} className="min-h-screen bg-indigo-200 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
          <BottomCTA />
        </ScrollSection>



        {/* Section 6: Footer (Final Layer) - White Finish */}
        <ScrollSection zIndex={60} className="bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
          <Footer />
        </ScrollSection>
      </main>
    </div>
  )
}
