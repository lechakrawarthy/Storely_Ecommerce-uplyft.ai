import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Shield, Truck, CreditCard, RefreshCw, Heart, Star, Zap, ChevronRight, MessageCircle, BookOpen } from '../utils/icons';

const faqData = [
  {
    id: "shipping",
    icon: Truck,
    category: "Shipping & Delivery",
    question: "What are your shipping options and delivery times?",
    answer: "We offer multiple shipping options to suit your needs: Standard delivery (3-5 business days), Express delivery (1-2 business days), and Premium overnight delivery. All orders over ₹999 qualify for free standard shipping. We deliver across India and provide real-time tracking for all orders.",
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-600",
    badgeColor: "bg-blue-100 text-blue-700"
  },
  {
    id: "returns",
    icon: RefreshCw,
    category: "Returns & Exchanges",
    question: "What is your return and exchange policy?",
    answer: "We offer a hassle-free 30-day return policy for all products. Electronics come with a 15-day exchange window, books can be returned if unopened, and textiles have a 30-day return period. Simply contact our support team, and we'll arrange a pickup at no extra cost. Refunds are processed within 5-7 business days.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-600",
    badgeColor: "bg-green-100 text-green-700"
  },
  {
    id: "payments",
    icon: CreditCard,
    category: "Payment & Security",
    question: "What payment methods do you accept and how secure are they?",
    answer: "We accept all major payment methods including credit/debit cards, UPI, net banking, digital wallets, and cash on delivery. All transactions are secured with 256-bit SSL encryption and we're PCI DSS compliant. We never store your payment information, ensuring maximum security for every purchase.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600",
    badgeColor: "bg-purple-100 text-purple-700"
  },
  {
    id: "products",
    icon: Star,
    category: "Product Information",
    question: "How do I know if a product is authentic and what's your quality guarantee?",
    answer: "All our products are sourced directly from authorized dealers and manufacturers. Electronics come with official warranties, books are genuine publications, and textiles meet our premium quality standards. We provide authenticity certificates for high-value items and offer a quality guarantee with easy returns if you're not satisfied.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
    badgeColor: "bg-amber-100 text-amber-700"
  },
  {
    id: "account",
    icon: Shield,
    category: "Account & Privacy",
    question: "How is my personal information protected and can I delete my account?",
    answer: "Your privacy is our priority. We use advanced encryption to protect your data and never share personal information with third parties without consent. You can view, edit, or delete your account data anytime from your profile settings. We comply with all data protection regulations and give you full control over your information.",
    gradient: "from-red-500/10 to-rose-500/10",
    iconColor: "text-red-600",
    badgeColor: "bg-red-100 text-red-700"
  },
  {
    id: "support",
    icon: Heart,
    category: "Customer Support",
    question: "How can I get help and what are your customer service hours?",
    answer: "Our friendly customer support team is available 24/7 through multiple channels: live chat on our website, WhatsApp support, email at support@storely.com, and phone support. You can also use our AI chatbot for instant assistance with common queries. We're committed to resolving your issues quickly and efficiently.",
    gradient: "from-teal-500/10 to-cyan-500/10",
    iconColor: "text-teal-600",
    badgeColor: "bg-teal-100 text-teal-700"
  },
  {
    id: "loyalty",
    icon: Zap,
    category: "Rewards & Offers",
    question: "Do you have a loyalty program or special offers for frequent customers?",
    answer: "Yes! Join our Storely Rewards program to earn points on every purchase. Get exclusive early access to sales, birthday discounts, free premium shipping, and special member-only deals. Plus, refer friends to earn bonus rewards. The more you shop, the more you save with our tiered loyalty benefits.",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600",
    badgeColor: "bg-violet-100 text-violet-700"
  }
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState<string>("");
  const [hoveredItem, setHoveredItem] = useState<string>("");

  return (<section className="w-full py-20 bg-gradient-to-br from-slate-50 to-cream-100 relative overflow-hidden">
    {/* Background Decorative Elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pastel-200/30 to-transparent rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sage-200/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gold-200/20 to-cream-200/20 rounded-full blur-3xl animate-pulse delay-500" />

    <div className="max-w-4xl mx-auto px-4 relative z-10">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-white/30 mb-6">
          <HelpCircle className="w-5 h-5 text-sage-600" />
          <span className="text-sm font-semibold text-sage-700">Frequently Asked Questions</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Got Questions?
          <span className="block text-3xl md:text-4xl bg-gradient-to-r from-sage-600 to-pastel-600 bg-clip-text text-transparent">
            We've Got Answers!
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to the most common questions about shopping with Storely.
          Can't find what you're looking for? Our support team is here to help!
        </p>
      </div>        {/* FAQ Accordion */}
      <div className="glass-card rounded-3xl p-8 border border-white/20 shadow-xl backdrop-blur-sm">
        <Accordion
          type="single"
          collapsible
          className="space-y-6"
          value={openItem}
          onValueChange={setOpenItem}
        >
          {faqData.map((faq, index) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-none"
              onMouseEnter={() => setHoveredItem(faq.id)}
              onMouseLeave={() => setHoveredItem("")}
            >
              <div className={`glass-subtle rounded-2xl overflow-hidden transition-all duration-500 hover:glass-strong border border-white/20 bg-gradient-to-r ${faq.gradient} transform hover:scale-[1.02] ${openItem === faq.id ? 'ring-2 ring-sage-300/50 shadow-lg' : ''} ${hoveredItem === faq.id ? 'shadow-md' : ''}`}>
                <AccordionTrigger className="px-6 py-5 hover:no-underline text-left group">
                  <div className="flex items-center gap-4 w-full">
                    {/* Icon Container */}
                    <div className={`flex-shrink-0 p-3 rounded-xl glass-strong border border-white/30 transition-all duration-300 ${openItem === faq.id ? 'scale-110 ' + faq.iconColor.replace('text-', 'bg-').replace('-600', '-100') : ''}`}>
                      <faq.icon className={`w-6 h-6 ${faq.iconColor} transition-all duration-300 ${openItem === faq.id ? 'scale-110' : ''}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${faq.badgeColor} transition-all duration-300 ${openItem === faq.id ? 'scale-105' : ''}`}>
                          {faq.category}
                        </span>
                        {openItem === faq.id && (
                          <div className="flex items-center gap-1 text-xs text-sage-600 animate-fade-in">
                            <ChevronRight className="w-3 h-3" />
                            <span className="font-medium">Expanded</span>
                          </div>
                        )}
                      </div>
                      <h3 className={`text-lg font-semibold text-gray-900 group-hover:text-sage-700 transition-colors duration-300 ${openItem === faq.id ? 'text-sage-800' : ''}`}>
                        {faq.question}
                      </h3>
                    </div>

                    {/* Enhanced Number Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-sage-100 to-pastel-100 text-sage-700 font-bold text-sm flex items-center justify-center transition-all duration-300 ${openItem === faq.id ? 'scale-110 from-sage-200 to-pastel-200 shadow-md' : ''} ${hoveredItem === faq.id ? 'scale-105' : ''}`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  <div className="pl-16 animate-fade-in">
                    <div className="glass-card rounded-xl p-5 border border-white/30 bg-gradient-to-r from-white/50 to-cream-50/50">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-sage-600" />
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed flex-1">
                          {faq.answer}
                        </p>
                      </div>

                      {/* Additional Help Links */}
                      <div className="mt-4 pt-4 border-t border-white/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <button className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                              👍 Yes
                            </button>
                            <button className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                              👎 No
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>        {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="glass-strong rounded-2xl p-8 border border-white/20 relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-sage-50/50 via-pastel-50/50 to-cream-50/50 animate-pulse" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sage-100 to-pastel-100 text-sage-700 font-medium text-sm mb-4">
              <Heart className="w-4 h-4" />
              <span>We're here to help!</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Our customer support team is available 24/7 to help you with any questions or concerns.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button className="group bg-gradient-to-r from-sage-500 to-pastel-500 hover:from-sage-600 hover:to-pastel-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Contact Support
              </button>
              <button className="group glass-subtle border-2 border-white/30 hover:glass-strong text-gray-700 hover:text-gray-900 font-semibold px-8 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Browse Help Center
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-sage-600">24/7</div>
                <div className="text-xs text-gray-500">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pastel-600">&lt;5min</div>
                <div className="text-xs text-gray-500">Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold-600">99%</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default FAQ;
