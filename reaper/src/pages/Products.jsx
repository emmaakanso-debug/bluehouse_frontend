import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const products = [
	{
		tag: 'Brand systems',
		title: 'Identity architecture',
		description:
			'We shape positioning, visual language, and launch essentials so your brand feels cohesive at every touchpoint.',
	},
	{
		tag: 'Web experiences',
		title: 'Conversion-focused sites',
		description:
			'High-impact websites designed to communicate purpose clearly and turn attention into momentum for your team.',
	},
	{
		tag: 'Campaign direction',
		title: 'Launch narratives',
		description:
			'Creative systems and rollout assets that help new products and services enter the market with impact and precision.',
	},
	{
		tag: 'Product storytelling',
		title: 'Product presentation',
		description:
			'We turn technical detail into compelling product experiences that help people understand the value quickly.',
	},
]

function Products() {
	return (
		<>
			<Navbar />
			<main className="page-shell">
				<section className="page-hero dark-panel">
					<div className="container page-hero-inner">
						<p className="eyebrow">Products & Services</p>
						<h1>
							Build the <em>experience</em> behind the promise.
						</h1>
					</div>
				</section>

				<section className="section">
					<div className="container">
						<div className="section-heading">
							<p className="eyebrow">Selected work</p>
							<h2>Designed to move attention.</h2>
						</div>

						<div className="product-grid">
							{products.map((product) => (
								<article className="product-card" key={product.title}>
									<span className="product-tag">{product.tag}</span>
									<h3>{product.title}</h3>
									<p>{product.description}</p>
									<div className="product-meta">
										<span>Approach</span>
										<span aria-hidden="true">→</span>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}

export default Products
