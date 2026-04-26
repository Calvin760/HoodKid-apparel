import React from 'react'

// ================= CONTACT PAGE =================
export const Contact = () => {
  return (
    <div className="px-6 sm:px-12 py-16 max-w-6xl mx-auto text-black">

      {/* HERO */}
      <div className="mb-16 text-center sm:text-left">
        <p className="text-sm uppercase tracking-[4px] text-gray-500 mb-3">
          Get In Touch
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 max-w-3xl leading-relaxed">
          We would love to hear from you. Whether it is about your order,
          collaborations, support, or general enquiries — our team is here to
          help.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

          <div className="space-y-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-black mb-1">Email</h3>
              <p>support@hoodkidapparel.com</p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-1">Phone</h3>
              <p>+27 76 993 4759</p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-1">Business Hours</h3>
              <p>Monday - Friday: 09:00 AM - 06:00 PM</p>
              <p>Saturday: 10:00 AM - 03:00 PM</p>
              <p>Sunday: Closed</p>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-1">Collaborations</h3>
              <p>
                For partnerships, influencer work, and brand collaborations,
                please contact us via email.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="border rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full border rounded-lg px-4 py-3 outline-none"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full border rounded-lg px-4 py-3 outline-none resize-none"
            />

            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
