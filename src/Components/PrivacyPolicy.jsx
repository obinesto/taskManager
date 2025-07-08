import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 mb-0 md:mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Privacy Policy
          </h1>
          <Card className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-sm leading-relaxed">
                    Welcome to TaskManager. We are committed to protecting your
                    personal information and your right to privacy. This Privacy
                    Policy describes how we collect, use, and share your
                    information when you use our task management service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    2. Information We Collect
                  </h2>
                  <p className="text-sm leading-relaxed">
                    We collect information that you provide directly to us,
                    including:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-2">
                    <li>Account information (name, email, password)</li>
                    <li>Task and project data</li>
                    <li>Communication preferences</li>
                    <li>Usage information and interactions with our service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-sm leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-2">
                    <li>Provide and maintain our service</li>
                    <li>Improve and personalize your experience</li>
                    <li>Communicate with you about updates and changes</li>
                    <li>Ensure the security of our service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    4. Data Security
                  </h2>
                  <p className="text-sm leading-relaxed">
                    We implement appropriate security measures to protect your
                    personal information. However, no method of transmission
                    over the internet is 100% secure, and we cannot guarantee
                    absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                  <p className="text-sm leading-relaxed">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    6. Updates to This Policy
                  </h2>
                  <p className="text-sm leading-relaxed">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the &quot;Last Updated&quot; date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
                  <p className="text-sm leading-relaxed">
                    If you have any questions about this Privacy Policy, please
                    contact us through our contact form
                  </p>
                </section>

                <p className="text-sm text-muted-foreground mt-8">
                  Last Updated: July 8, 2025
                </p>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
