import React from 'react'

const About = () => {
  return (
    <div className="px-6 sm:px-12 py-16 max-w-6xl mx-auto text-black">

      {/* HERO */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-semibold mb-4">About Us</h1>
        <p className="text-gray-600 max-w-2xl">
          We are building more than just a store — we are building a culture.
        </p>
      </div>

      {/* STORY */}
      <div className="grid sm:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="text-xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            HoodKid was created with a vision to merge fashion, identity,
            and self-expression. We focus on clean design, premium feel, and
            timeless pieces that move with you.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To deliver high-quality pieces while keeping design simple,
            bold, and accessible. Every drop is intentional.
          </p>
        </div>
      </div>

      {/* VALUES */}
      <div className="grid sm:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="font-semibold mb-2">Quality</h3>
          <p className="text-gray-600 text-sm">Built to last, not trends.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Minimalism</h3>
          <p className="text-gray-600 text-sm">Less noise, more impact.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Community</h3>
          <p className="text-gray-600 text-sm">Driven by people, not hype.</p>
        </div>
      </div>

    </div>
  )
}

export default About