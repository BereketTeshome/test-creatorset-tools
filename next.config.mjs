/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      type: "asset/resource",
    });
    return config;
  },
  // Add custom headers
  async headers() {
    return [
      // {
      //   source: '/stripe/:path*', // Apply headers to all routes under Stripe API
      //   headers: [
      //     {
      //       key: 'Cross-Origin-Embedder-Policy',
      //       value: 'unsafe-none', // Ensures embedded Stripe Elements work properly
      //     },
      //     {
      //       key: 'Cross-Origin-Opener-Policy',
      //       value: 'unsafe-none', // Ensures the same-origin policy for opening embedded content
      //     },
      //     {
      //       key: 'Content-Security-Policy',
      //       value: `
      //         default-src 'self';
      //         script-src 'self' https://js.stripe.com;
      //         frame-src 'self' https://js.stripe.com;
      //       `.replace(/\s{2,}/g, ' ').trim(), // Minify header value
      //     },
      //   ],
      // },
      //  // Headers for PayPal Embedded (https://www.paypal.com)
      //  {
      //   source: '/paypal/:path*', // Apply headers to all routes under PayPal API
      //   headers: [
      //     {
      //       key: 'Cross-Origin-Embedder-Policy',
      //       value: 'unsafe-none', // Ensures embedded PayPal buttons work properly
      //     },
      //     {
      //       key: 'Cross-Origin-Opener-Policy',
      //       value: 'unsafe-none', // Ensures the same-origin policy for opening embedded content
      //     },
      //     {
      //       key: 'Content-Security-Policy',
      //       value: `
      //         default-src 'self';
      //         script-src 'self' https://www.paypal.com;
      //         frame-src 'self' https://www.paypal.com;
      //       `.replace(/\s{2,}/g, ' ').trim(), // Minify header value
      //     },
      //   ],
      // },
      {
        // Apply headers to all routes under /api/*
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
            // value:'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
            // value:'unsafe-none'
          },
        ],
      },
      {
        // Apply headers to all routes under /api/*
        source: '/my-account/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            // value: 'require-corp',
            value:'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            // value: 'same-origin',
            value:'unsafe-none'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
