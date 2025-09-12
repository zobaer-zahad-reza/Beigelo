import React from 'react'

export default function LocationMap() {
  return (
    <div className="bg-white font-sans py-12 md:py-16">
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-wider uppercase">
            Our Showroom
          </h2>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Visit us to experience our collection firsthand.
          </p>
        </div>

        {/* Responsive Map Container */}
        <div className="w-full overflow-hidden rounded-lg shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443.6332706947472!2d90.43516710809433!3d23.709489985636367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9832a8e6de1%3A0xf56086bb57f00a2e!2z4Ka54KeL4Kau4Ka_4KaTIOCmuOCngeCmuOCnjeCmrOCmvuCmuOCnjeCmpeCnjeCmryDgpqrgprDgpr_gpprgprDgp43gpq_gpr4g4Kar4Ka-4Kaw4KeN4Kau4KeH4Ka44KeA!5e0!3m2!1sen!2sbd!4v1757709369000!5m2!1sen!2sbd"
            className="w-full h-80 md:h-96 lg:h-[500px]" // Responsive height classes
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location of Beigelo Showroom"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
