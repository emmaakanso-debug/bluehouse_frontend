import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Contact() {
	return (
		<>
			<Navbar />
			<main className="page-shell">
				<section className="page-hero">
					<div className="container page-hero-inner">
						<p className="eyebrow">Contact</p>
						<h1>
							Let’s build <em>the next chapter</em>.
						</h1>
					</div>
				</section>

				<section className="section">
					<div className="container contact-layout">
						<div className="contact-panel">
							<h2>Start a conversation.</h2>
							<p>
								Tell us what you’re trying to build, what has stalled, and where the opportunity is. We’ll respond with a thoughtful next step.
							</p>
							<ul className="contact-points">
								<li>Strategy and positioning</li>
								<li>Brand and web design</li>
								<li>Launch systems and growth assets</li>
							</ul>
						</div>

						<form className="contact-form">
							<div className="field-row">
								<label>
									<span>Name</span>
									<input type="text" name="name" placeholder="Your name" />
								</label>
								<label>
									<span>Email</span>
									<input type="email" name="email" placeholder="you@example.com" />
								</label>
							</div>

							<label>
								<span>Company</span>
								<input type="text" name="company" placeholder="Brand or studio name" />
							</label>

							<label>
								<span>Project brief</span>
								<textarea name="message" rows="6" placeholder="Tell us a little about the work, timeline, and goals." />
							</label>

							<button type="submit" className="primary-button">
								Send inquiry
							</button>
						</form>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Contact
