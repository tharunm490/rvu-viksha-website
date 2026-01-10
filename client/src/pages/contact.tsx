import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { faqs } from "@/data/faqs";

export default function Contact() {

  return (
    <Layout backgroundType="coding">
      <br />
      <br />
      <div className="animate-in fade-in duration-1000">
        {/* Header Section */}
        <section className="px-7 lg:px-8 py-10 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-b from-white via-white/90 to-cyan-400 bg-clip-text text-transparent mb-6">
              Contact Us
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Have questions about joining our club, want to collaborate on a project, or need information about our events? We'd love to hear from you!
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="px-4 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <ContactForm />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 lg:px-8 pt-20 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-[#0a0a0a] border border-white/20 rounded-2xl px-6 data-[state=open]:border-white/40 transition-all duration-300"
                >
                  <AccordionTrigger className="text-lg font-semibold text-white hover:text-cyan-300 hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </Layout>
  );
}