import { SiteContent } from '@/models/content';
import { SystemSettings } from '@/models/settings';

export const WEBSITE_DOMAIN = 'ridmaxsteel.com';

export const THEME_COLOR = '#1b2d5b';

export const SITE_CONTENT: SiteContent = {
  home: {
    section1: {
      // Hero
      title: "Building Nigeria's Future with Premium Steel",
      subtitle: 'Premium Steel',
      body: 'Ridmax Steel is your trusted partner for high-quality steel products and services. We supply the finest steel materials for construction, manufacturing, and infrastructure development across Nigeria.',
      image: '/images/Ridmax-home/home/img1.png',
      button: { title: 'Explore Products', href: '/products' },
      buttons: [
        { title: 'Explore Products', href: '/products' },
        { title: 'Get In Touch', href: '/contact' },
      ],
    },
    section2: {
      // Featured Products
      title: 'Our Products',
      subtitle: 'Premium Steel Products for Every Need',
      body: 'We carry a wide range of certified steel products to meet every construction and industrial demand.',
      button: { title: 'View All Products', href: '/products' },
      items: [
        {
          title: 'Binding Wire',
          body: 'High-tensile binding wire for reinforcement and construction use.',
          image: '/images/Ridmax-our-products/img1.png',
          href: '/products',
        },
        {
          title: 'Iron Rods (TMT Bars)',
          body: 'Thermo-mechanically treated bars for superior strength in concrete structures.',
          image: '/images/Ridmax-our-products/img2.png',
          href: '/products',
        },
        {
          title: 'Corrugated Roofing Sheet',
          body: 'Long-span corrugated sheets for durable, weather-resistant roofing.',
          image: '/images/Ridmax-our-products/img3.png',
          href: '/products',
        },
        {
          title: 'Flat Bar',
          body: 'Versatile flat steel bars suitable for fabrication and structural applications.',
          image: '/images/Ridmax-our-products/img4.png',
          href: '/products',
        },
        {
          title: 'Square Hollow Section',
          body: 'Precision-cut square hollow sections ideal for frames and supports.',
          image: '/images/Ridmax-our-products/img5.png',
          href: '/products',
        },
        {
          title: 'Steel Pipes',
          body: 'Round steel pipes for plumbing, structural, and mechanical applications.',
          image: '/images/Ridmax-our-products/img6.png',
          href: '/products',
        },
      ],
    },
    section3: {
      // Why Choose Us
      title: 'Why Choose Ridmaxsteel?',
      body: 'We combine quality, expertise, and reliability to deliver exceptional steel solutions.',
      items: [
        {
          title: 'Premium Quality',
          subtitle: 'shield',
          body: 'High-grade stainless steel materials meeting international standards.',
        },
        {
          title: 'Reliable Delivery',
          subtitle: 'truck',
          body: 'Efficient distribution network ensuring timely project execution.',
        },
        {
          title: 'Expert Team',
          subtitle: 'users',
          body: 'Qualified welders and fabricators for precision craftsmanship.',
        },
        {
          title: 'Competitive Pricing',
          subtitle: 'tag',
          body: 'Direct sourcing for cost-effective solutions without compromising quality.',
        },
      ],
    },
    section4: {
      // Stats
      title: 'Our Numbers Speak',
      body: 'Over a decade of excellence in the Nigerian steel industry.',
      items: [
        { title: '2015', body: 'Established' },
        { title: '80%+', body: 'Steel Products' },
        { title: '1000+', body: 'Product Sales' },
        { title: '500+', body: 'Satisfied Clients' },
      ],
    },
    section5: {
      // Our Services
      title: 'Our Services',
      subtitle: 'What We Offer',
      body: 'Beyond supplying premium steel products, we offer a full suite of services designed to support your project from start to finish.',
      button: { title: 'View All Services', href: '/services' },
      items: [
        {
          title: 'Import & Export',
          body: 'We handle the entire import and export process, ensuring your steel arrives safely and on time.',
          image: '/images/Ridmax-our-services/import&export-services.png',
          href: '/services',
        },
        {
          title: 'Distribution',
          body: 'Reliable nationwide distribution services directly to your construction or manufacturing site.',
          image: '/images/Ridmax-our-services/distribution&supply.png',
          href: '/services',
        },
        {
          title: 'Steel Works',
          body: 'Professional welding, fabrication, and steel works executed by our certified technicians.',
          image: '/images/Ridmax-our-services/welding&fabrication.png',
          href: '/services',
        },
      ],
    },
    section6: {
      // Blog / Recent Updates
      title: 'Recent Updates',
      subtitle: 'Blog & News',
      body: 'Stay informed with the latest news, industry insights, and updates from Ridmax Steel.',
      button: { title: 'View All Posts', href: '/blog' },
      items: [
        {
          title: 'Growing Demand for Hollow Sections and Rectangular Aluminium Extrusions',
          body: 'As construction evolves in Nigeria, hollow sections are increasingly favoured for their strength-to-weight ratio.',
          image: '/images/Ridmax-home/Ridmax-home-blog-updates/Img1.png',
          href: '/blog',
          button: { title: 'Read More', href: '/blog' },
        },
        {
          title: 'New Arrival: Premium Aluminium Accessories',
          body: 'We have just added a new line of premium aluminium accessories to our product catalogue.',
          image: '/images/Ridmax-home/Ridmax-home-blog-updates/Img2.png',
          href: '/blog',
          button: { title: 'Read More', href: '/blog' },
        },
        {
          title: 'Steel Demand in Nigeria: Market Trends and Future Projections',
          body: 'The Nigerian steel market continues to grow. Here is what industry experts are saying about the road ahead.',
          image: '/images/Ridmax-home/Ridmax-home-blog-updates/Img3.png',
          href: '/blog',
          button: { title: 'Read More', href: '/blog' },
        },
      ],
    },
    section7: {
      // CTA Banner
      title: 'Ready to Start Your Project?',
      body: 'Get in touch with our team today and let us help you source the best steel materials at competitive prices.',
      button: { title: 'Contact Us', href: '/contact' },
    },
  },
  products: {
    section1: {
      // Hero
      title: 'Our Products',
      subtitle: 'Premium Steel Products for Every Project',
      body: 'Explore our extensive catalogue of certified steel products, sourced from trusted manufacturers and available for delivery across Nigeria.',
      image: '/images/Ridmax-our-products/img1.png',
    },
    section2: {
      // Full product catalogue
      title: 'Our Full Product Range',
      body: 'All products are available in various sizes and specifications. Contact us for bulk pricing and custom orders.',
      items: [
        {
          title: 'Brush Materials',
          subtitle: 'Available',
          body: '4FT BY 8FT 0.5MM-3MM.',
          image: '/images/brush material/_KOS6404.jpg',
          images: [
            '/images/brush material/_KOS6404.jpg',
            '/images/brush material/_KOS6405.jpg',
            '/images/brush material/_KOS6406.jpg',
            '/images/brush material/_KOS8726.jpg',
            '/images/brush material/_KOS8728.jpg',
            '/images/brush material/_KOS8730.jpg',
          ],
        },
        {
          title: 'Angle Materials',
          subtitle: 'Available',
          body: 'IN VARIOUS SIZES AND THICKNESS.',
          image: '/images/angle materials/_KOS8847.jpg',
          images: [
            '/images/angle materials/_KOS8847.jpg',
            '/images/angle materials/_KOS8853.jpg',
            '/images/angle materials/_KOS8877 copy.jpg',
            '/images/angle materials/_KOS8887.jpg',
          ],
        },
        {
          title: 'Checker Materials',
          subtitle: 'Available',
          body: 'Checkered steel plates providing anti-slip surfaces for floors and ramps.',
          image: '/images/Ridmax-our-products/img3.png',
        },
        {
          title: 'Flat Bar Materials',
          subtitle: 'Available',
          body: 'Versatile flat bars for welding, fabrication, and general construction.',
          image: '/images/Ridmax-our-products/img4.png',
        },
        {
          title: 'Multi-Material Product',
          subtitle: 'Available',
          body: 'Stocked in standard lengths to suit a wide range of project specifications.',
          image: '/images/Ridmax-our-products/img5.png',
        },
        {
          title: 'Hollow Materials Product',
          subtitle: 'Available',
          body: 'Square, rectangular, and circular hollow sections for structural applications.',
          image: '/images/Ridmax-our-products/img6.png',
        },
        {
          title: 'Iron Rod S',
          subtitle: 'Available',
          body: 'High-tensile iron rods ideal for concrete reinforcement in construction.',
          image: '/images/Ridmax-our-products/img7.png',
        },
        {
          title: 'Iron Rod C',
          subtitle: 'Available',
          body: 'Deformed and plain iron rods available in Y8 to Y25 sizes.',
          image: '/images/Ridmax-our-products/img8.png',
        },
        {
          title: 'Binding Wire',
          subtitle: 'Available',
          body: 'Annealed binding wire for tying rebar in construction work.',
          image: '/images/Ridmax-our-products/img9.png',
        },
        {
          title: 'Architectural Product',
          subtitle: 'Available',
          body: 'Decorative and structural steel products for architectural applications.',
          image: '/images/Ridmax-our-products/img10.png',
        },
        {
          title: 'Perforated Materials C',
          subtitle: 'Available',
          body: 'Perforated sheets for ventilation, screening, and decorative cladding.',
          image: '/images/Ridmax-our-products/img11.png',
        },
        {
          title: 'Solid Rod Materials',
          subtitle: 'Available',
          body: 'Solid round bars in mild steel and stainless steel grades.',
          image: '/images/Ridmax-our-products/img12.png',
        },
        {
          title: 'Steel Roofing Sheets',
          subtitle: 'Available',
          body: 'Long-span corrugated and standing-seam steel roofing sheets.',
          image: '/images/Ridmax-our-products/img13.png',
        },
        {
          title: 'Pipe Products (Long Pipe)',
          subtitle: 'Available',
          body: 'Seamless and welded steel pipes in standard and custom lengths.',
          image: '/images/Ridmax-our-products/img14.png',
        },
        {
          title: 'Stainless Steel Accessories',
          subtitle: 'Available',
          body: 'T304 grade stainless steel fittings and accessories.',
          image: '/images/Ridmax-our-products/img15.png',
        },
        {
          title: 'Stainless Steel Accessories',
          subtitle: 'Available',
          body: 'T304 grade stainless steel accessories for marine and industrial use.',
          image: '/images/Ridmax-our-products/img16.png',
        },
        {
          title: 'Stainless Steel Accessories',
          subtitle: 'Available',
          body: 'T304 premium stainless steel components and fittings.',
          image: '/images/Ridmax-our-products/img17.png',
        },
        {
          title: 'Stainless Steel Accessories',
          subtitle: 'Available',
          body: 'T304 stainless steel pipe elbows, tees, and couplings.',
          image: '/images/Ridmax-our-products/img18.png',
        },
      ],
    },
    section3: {
      // CTA
      title: 'Ready to Start Your Project?',
      body: 'Get in touch with our team today for competitive pricing and expert product consultation.',
      button: { title: 'Contact Us Now', href: '/contact' },
    },
  },
  about: {
    section1: {
      // Hero banner
      title: 'About Ridmaxsteel',
      subtitle: "Building Nigeria's Future with Premium Steel",
      body: "Nigeria's trusted partner for premium steel products and professional steel services.",
      image: '/images/Ridmax-about/img1.png',
    },
    section2: {
      // Who We Are
      title: 'Who We Are',
      body: "Ridmax Steel Limited is a leading steel products company established to serve the growing needs of Nigeria's construction and manufacturing industries. We specialise in the supply, distribution, and fabrication of high-quality steel products sourced from reputable local and international manufacturers.\n\nServing clients across many sectors including residential construction, commercial real estate, heavy industry, civil engineering and the oil and gas industry. Our team of professionals ensures that every product we deliver meets the highest standards of quality and durability.\n\nOur relationships with top-tier manufacturers and suppliers allow us to offer an extensive range of steel products at the most competitive prices in the market. We are dedicated to providing our clients with reliable delivery, expert consultation and exceptional customer service.",
      image: '/images/Ridmax-about/img2.png',
    },
    section3: {
      // Future Outlook
      title: 'Our Future Outlook',
      body: "Ridmax Steel has a clear growth strategy for the next several years, built on a drive to achieve commercial and geographic expansion. Our primary objective is to solidify our position as Nigeria's most trusted steel products company and to expand our reach to more states in Nigeria.\n\nWe plan to achieve this by investing in our distribution infrastructure, adding new product lines, and forming strategic partnerships with leading manufacturers. The future of Ridmax Steel is one of continued growth and innovation, always guided by our commitment to delivering the highest quality products at the best prices.",
    },
    section4: {
      // Mission, Vision, Advantages
      title: 'Mission, Vision & Advantages',
      body: '',
      items: [
        {
          title: 'Our Mission',
          subtitle: 'shield',
          body: "To be the most dependable steel products company, delivering top-quality materials to drive Nigeria's development while building lasting client relationships through service excellence.",
        },
        {
          title: 'Our Vision',
          subtitle: 'truck',
          body: "To become West Africa's foremost steel distribution company, setting the standard for quality, reliability, and customer-first values across the region.",
        },
        {
          title: 'Our Competitive Advantages',
          subtitle: 'users',
          body: "Direct partnerships with top manufacturers ensure unbeatable pricing. Our efficient logistics network guarantees prompt product delivery to any location in Nigeria. With experienced consultants and a comprehensive catalogue, we simplify sourcing for our clients.",
        },
      ],
    },
    section5: {
      title: 'Our Numbers',
      body: '',
      items: [
        { title: '2015', body: 'Established' },
        { title: '80%+', body: 'Steel Products' },
        { title: '1000+', body: 'Product Sales' },
        { title: '500+', body: 'Satisfied Clients' },
      ],
    },
    section6: {
      title: 'Ready to Start Your Project?',
      body: 'Get in touch with our team today for competitive pricing and expert steel consultation.',
      button: { title: 'Contact Us Now', href: '/contact' },
    },
  },
  services: {
    section1: {
      // Hero
      title: 'Our Services',
      subtitle: 'Comprehensive Steel Solutions for Every Need',
      body: 'From importation to fabrication, we provide end-to-end steel services tailored to your project requirements.',
      image: '/images/Ridmax-our-services/slide.png',
    },
    section2: {
      // Service blocks
      title: 'What We Offer',
      body: 'Our full range of professional services',
      items: [
        {
          title: 'Import & Export Services',
          subtitle: '01',
          body: 'We handle the entire import and export process for steel products, leveraging our global network of suppliers and logistics partners to ensure your materials arrive safely, on time, and at competitive prices.',
          image: '/images/Ridmax-our-services/import&export-services.png',
          buttons: [
            { title: 'Full export of any kind of steel product', href: '/contact' },
            { title: 'Standard quality assurance on all imports', href: '/contact' },
            { title: 'Full import of all types of steel product', href: '/contact' },
            { title: 'Customs clearance and documentation support', href: '/contact' },
            { title: 'Handles shipping logistics end to end', href: '/contact' },
            { title: 'Competitive pricing through direct supplier ties', href: '/contact' },
          ],
        },
        {
          title: 'Distribution & Supply',
          subtitle: '02',
          body: 'Our nationwide distribution network ensures that your steel products reach your project site on time, every time. We operate a fleet of delivery vehicles and maintain strategic warehousing locations across Nigeria.',
          image: '/images/Ridmax-our-services/distribution&supply.png',
          buttons: [
            { title: 'Same-day delivery within Lagos metropolis', href: '/contact' },
            { title: 'Nationwide delivery across all 36 states', href: '/contact' },
            { title: 'Platform sourcing for all supplies', href: '/contact' },
            { title: 'Bulk order fulfilment with volume discounts', href: '/contact' },
            { title: 'Real-time order tracking and updates', href: '/contact' },
          ],
        },
        {
          title: 'Welding & Fabrication',
          subtitle: '03',
          body: 'Our certified welders and fabricators bring precision craftsmanship to every project. From custom gates and fences to structural steel frameworks, we deliver fabrication work that meets the highest standards.',
          image: '/images/Ridmax-our-services/welding&fabrication.png',
          buttons: [
            { title: 'Custom gate and fence fabrication', href: '/contact' },
            { title: 'Structural steel framework installation', href: '/contact' },
            { title: 'MIG, TIG and arc welding services', href: '/contact' },
            { title: 'On-site and off-site fabrication available', href: '/contact' },
            { title: 'Quality inspection after every job', href: '/contact' },
          ],
        },
        {
          title: 'Technical Consultation',
          subtitle: '04',
          body: 'Our experienced technical team provides expert guidance to help you select the right steel products for your specific application. We assess your project requirements and recommend the optimal materials and specifications.',
          image: '/images/Ridmax-our-services/technical-comsultation.png',
          buttons: [
            { title: 'Free initial project assessment', href: '/contact' },
            { title: 'Steel grade and specification advice', href: '/contact' },
            { title: 'Cost optimisation recommendations', href: '/contact' },
            { title: 'On-site consultation available', href: '/contact' },
            { title: 'Load and structural capacity guidance', href: '/contact' },
          ],
        },
      ],
    },
    section3: {
      // Who We Serve
      title: 'Who We Serve',
      subtitle: 'Industries & Clients We Support',
      body: 'We proudly serve a diverse range of industries and clients across Nigeria.',
      image: '/images/Ridmax-our-services/who-we-serve.png',
      items: [
        {
          title: 'Manufacturers & Companies',
          body: 'Industrial manufacturers requiring consistent supply of quality steel raw materials for production lines and machinery.',
        },
        {
          title: 'Home Fabricators',
          body: 'Independent fabricators and artisans producing gates, doors, railings, and custom steel furniture for residential clients.',
        },
        {
          title: 'Construction Companies',
          body: 'Building contractors and construction firms requiring bulk steel supply for residential, commercial, and civil projects.',
        },
        {
          title: 'Real Estate Developers',
          body: 'Property developers needing reliable steel sourcing for large-scale housing and commercial real estate developments.',
        },
        {
          title: 'Interior Designers',
          body: 'Designers and architects specifying decorative steel elements, staircases, partitions, and feature installations.',
        },
      ],
    },
    section4: {
      // CTA
      title: 'Ready to Start Your Project?',
      body: 'Get in touch with our team today for expert consultation and competitive service pricing.',
      button: { title: 'Contact Us Now', href: '/contact' },
    },
  },
  contact: {
    section1: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team for quotes, consultations, or any inquiries.',
      body: 'We are here to answer your questions and discuss how we can work together to create impact.',
      image: '/images/Ridmax-our-services/slide.png',
    },
    section2: {
      // Contact details
      title: 'Contact Information',
      body: 'We are here to answer your questions and discuss how we can work together to create impact.',
      items: [
        {
          title: 'Head Office',
          subtitle: 'address',
          body: 'Zion Junction, Off Ajegunle Owode Onirin, Along Ikorodu, Lagos State, Nigeria',
        },
        {
          title: 'Phone Numbers',
          subtitle: 'phone',
          body: '+234 7047587807, +234 8168079241\n+234 7067094900, +234 7069377829\n+234 7088254965',
        },
        {
          title: 'Email Address',
          subtitle: 'email',
          body: 'contact.ridmaxsteel@gmail.com',
        },
        {
          title: 'Business Hours',
          subtitle: 'clock',
          body: 'Monday – Friday: 8:00 AM – 5:00 PM\nSaturday: 9:00 AM – 2:00 PM\nSunday: Closed',
        },
      ],
      // WhatsApp contacts
      buttons: [
        { title: 'Agent 1 — 07047587807', href: 'https://wa.me/2347047587807' },
        { title: 'Agent 2 — 08168079241', href: 'https://wa.me/2348168079241' },
      ],
    },
  },
  blog: {
    section1: {
      title: 'Blog & Updates',
      body: 'Stay informed with the latest news and insights from the Ridmax Steel team.',
    },
  },
  termsOfService: {
    section1: {
      title: 'Terms of Service',
      body: 'Please read these terms carefully before using our website and services.',
    },
  },
  privacyPolicy: {
    section1: {
      title: 'Privacy Policy',
      body: 'We are committed to protecting your privacy and handling your data responsibly.',
    },
  },
};

export const SYSTEM_SETTINGS: SystemSettings = {
  siteName: 'Ridmax Steel',
  siteDescription:
    'Ridmax Steel — Nigeria\'s trusted supplier of premium quality steel products and services for construction, manufacturing, and infrastructure.',
  siteLogo: `https://${WEBSITE_DOMAIN}/images/logo.svg`,
  siteIcon: `https://${WEBSITE_DOMAIN}/images/icon.svg`,
  siteUrl: `https://${WEBSITE_DOMAIN}`,
  siteSlogan: "Building Nigeria's Future with Premium Steel",
  siteGraphImage: `https://${WEBSITE_DOMAIN}/images/og-image.jpg`,
  siteKeywords: [
    'steel',
    'iron rods',
    'roofing sheets',
    'Nigeria',
    'construction materials',
    'Ridmax Steel',
  ],
  siteAuthor: 'Ridmax Steel',
  siteLocale: 'en_NG',
  siteType: 'website',
  ogTitle: "Ridmax Steel — Nigeria's Premium Steel Supplier",
  ogDescription:
    'Quality steel products and services for construction and manufacturing across Nigeria.',
  ogImage: `https://${WEBSITE_DOMAIN}/images/og-image.jpg`,
  ogImageAlt: 'Ridmax Steel',
  twitterCard: 'summary_large_image',
  twitterSite: '@ridmaxsteel',
  twitterCreator: '@ridmaxsteel',
  twitterTitle: "Ridmax Steel — Nigeria's Premium Steel Supplier",
  twitterDescription:
    'Quality steel products and services for construction and manufacturing across Nigeria.',
  twitterImage: `https://${WEBSITE_DOMAIN}/images/og-image.jpg`,
  maintenanceMode: false,
  headerLinks: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact', isButton: true },
  ],
  footerLinks: [
    {
      section: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Our Products', href: '/products' },
        { label: 'Our Services', href: '/services' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      section: 'Our Services',
      links: [
        { label: 'Import & Export', href: '/services' },
        { label: 'Distribution & Supply', href: '/services' },
        { label: 'Welding & Fabrication', href: '/services' },
        { label: 'Technical Consultation', href: '/services' },
      ],
    },
    {
      section: 'Contact Us',
      links: [
        { label: 'Email', href: 'mailto:info@ridmaxsteel.com' },
        { label: 'Phone', href: 'tel:+2348000000000' },
      ],
    },
  ],
  socialLinks: [
    { label: 'Facebook', href: 'https://www.facebook.com/ridmaxsteel', target: '_blank' },
    { label: 'Instagram', href: 'https://www.instagram.com/ridmaxsteel', target: '_blank' },
    { label: 'X', href: 'https://x.com/ridmaxsteel', target: '_blank' },
  ],
  contact: {
    email: 'info@ridmaxsteel.com',
    phones: ['+234 800 000 0000'],
    whatsappPhone: '+2348000000000',
    addresses: [
      {
        country: 'Nigeria',
        phone: '+234 800 000 0000',
        address: 'Ridmax Steel Ltd, Lagos, Nigeria',
      },
    ],
    map: '',
  },
};
