'use client';

import { motion } from 'framer-motion';
import ShopifyBuyButton from './ShopifyBuyButton';

export default function CTASection() {
  return (
    <section className="relative w-full py-40 bg-midnight flex flex-col items-center justify-center overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[800px] h-[800px] bg-gradient-to-tr from-ube to-fuchsia-600 rounded-full mix-blend-screen opacity-10 blur-[150px]"></div>
      </div>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 text-center px-4">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl font-medium tracking-tighter text-white drop-shadow-2xl mb-8"
        >
          Ready to experience <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ube to-fuchsia-400">the fusion?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative group cursor-pointer"
        >
          {/* We add a glowing wrapper to maintain the original aesthetic */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:bg-fuchsia-500/30 transition-colors duration-500"></div>
          <div className="relative">
            <ShopifyBuyButton 
              // IMPORTANT: Replace these placeholders with your actual Shopify details!
              storeDomain="YOUR_STORE_DOMAIN.myshopify.com" 
              storefrontAccessToken="YOUR_STOREFRONT_ACCESS_TOKEN"
              productId="YOUR_PRODUCT_ID"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
