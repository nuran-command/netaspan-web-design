import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <Hero />
      
      {/* Spacer to demonstrate lenis scroll & parallax */}
      <section className="h-[100vh] bg-[#0A2540] flex items-center justify-center relative z-20 border-t border-white/5">
        <div className="text-center opacity-30">
          <h2 className="text-[#FF9F1C] text-sm uppercase tracking-[2px] mb-4">Discover More</h2>
          <p className="max-w-md mx-auto">This section demonstrates the smooth scrolling effect and navigation bar transition.</p>
        </div>
      </section>
    </main>
  );
}
