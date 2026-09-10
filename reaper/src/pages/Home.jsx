import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import AboutPreview from '../components/landing/AboutPreview'
import CTA from '../components/landing/CTA'

function Home() {
	return (
		<>
			<Navbar />
			<main>
				<Hero />
				<Features />
				<AboutPreview />
				<CTA />
			</main>
			<Footer />
		</>
	)
}

export default Home
