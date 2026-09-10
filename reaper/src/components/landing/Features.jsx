const features = [
	['01', 'Strategy', 'Find the signal in the noise and turn it into a direction people can feel.'],
	['02', 'Identity', 'Build a visual language with enough character to be remembered.'],
	['03', 'Digital', 'Create useful, expressive experiences that give brands momentum.'],
]

function Features() {
	return (
		<section className="section features" id="features">
			<div className="container">
				<div className="section-heading">
					<p className="eyebrow">What we do / 02</p>
					<h2>Ideas with<br /><em>edge.</em></h2>
				</div>
				<div className="feature-list">
					{features.map(([number, title, description]) => (
						<article className="feature" key={number}>
							<span className="feature-number">{number}</span>
							<h3>{title}</h3>
							<p>{description}</p>
							<span className="feature-arrow" aria-hidden="true">&nearr;</span>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default Features
