import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const principles = [
	{
		label: '01',
		title: 'Research with intent',
		description:
			'We map the tension behind the brand, the audience, and the decision-making that drives growth before we design a single screen.',
	},
	{
		label: '02',
		title: 'Build for clarity',
		description:
			'Every experience is structured to remove friction, sharpen the message, and move people toward action with less noise.',
	},
	{
		label: '03',
		title: 'Design for momentum',
		description:
			'We create systems that can keep compounding — campaigns, product experiences, and assets that continue working after launch.',
	},
]

function About() {
	return (
		<>
			<Navbar />
			<main className="page-shell">
				<section className="page-hero dark-panel">
					<div className="container page-hero-inner">
						<p className="eyebrow">About Reaper</p>
						<h1>
							We build <em>signal</em> that lasts.
						</h1>
					</div>
				</section>

				<section className="section">
					<div className="container page-grid">
						<div>
							<p className="section-kicker">Who we are</p>
							<h2>
								Strategy, design, and systems for founders who want to move with intent.
							</h2>
						</div>

						<div className="page-copy">
							<p>
								Reaper is a digital studio for brands with a point of view. We work with teams that need more than a polished website — they need a sharper narrative, a better customer journey, and a visual language that can carry the business forward.
							</p>
							<p>
								We combine positioning, product thinking, and high-end design to turn ideas into experiences that feel real, memorable, and commercially useful.
							</p>
						</div>
					</div>
				</section>

				<section className="section muted-panel">
					<div className="container metrics-grid">
						<div className="metric-card">
							<span>10+</span>
							<p>Years building narrative-led digital work.</p>
						</div>
						<div className="metric-card">
							<span>42</span>
							<p>Brands and product teams shaped across strategy and launch.</p>
						</div>
						<div className="metric-card">
							<span>24/7</span>
							<p>Energy for restless founders and ambitious teams.</p>
						</div>
					</div>
				</section>

				<section className="section">
					<div className="container">
						<div className="section-heading stacked-heading">
							<p className="eyebrow">How we work</p>
							<h2>Clear thinking. Better execution.</h2>
						</div>

						<div className="principles-list">
							{principles.map((item) => (
								<div className="principle-item" key={item.label}>
									<span className="principle-number">{item.label}</span>
									<div>
										<h3>{item.title}</h3>
										<p>{item.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default About
