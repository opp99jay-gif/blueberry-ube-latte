'use client';

import { motion } from 'framer-motion';

const healthBenefits = [
  {
    title: 'Heart & Circulation',
    desc: 'Anthocyanins and potassium help relax blood vessels, lower blood pressure, and improve cardiovascular function.'
  },
  {
    title: 'Immune Support',
    desc: 'Both ingredients are excellent sources of Vitamin C, strengthening the immune system against oxidative damage.'
  },
  {
    title: 'Cognitive Function',
    desc: 'Regular intake of these antioxidants has been linked to improved memory and better focus.'
  },
  {
    title: 'Gut Health & Digestion',
    desc: 'Rich in dietary fiber and resistant starch, acting as a prebiotic to feed beneficial gut bacteria.'
  }
];

export default function HealthBenefitsSection() {
  return (
    <section id="health" className="w-full bg-[#030303] py-24 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-fuchsia-400 text-sm tracking-[0.2em] uppercase font-semibold mb-4 block">Holistic Wellness</span>
          <h2 className="text-4xl md:text-6xl font-light text-white">
            Key Health <span className="font-bold">Benefits</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/50 mt-6 font-light text-lg">
            A potent dose of nutrients due to high concentrations of anthocyanins—the natural purple and blue pigments found in both ube and blueberries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthBenefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, boxShadow: '0 20px 40px -10px rgba(147,112,219,0.15)' }}
              className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col gap-4 backdrop-blur-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ube to-fuchsia-600 mb-2 flex items-center justify-center shadow-lg shadow-ube/20" />
              <h3 className="text-xl text-white font-medium">{benefit.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
