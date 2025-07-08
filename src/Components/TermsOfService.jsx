import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import Footer from "./Footer";

const TermsOfService = () => {
  return (
    <>
    <div className="container mx-auto px-4 py-8 mb-0 md:mb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
        <Card className="p-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-sm leading-relaxed">
                  By accessing and using TaskManager, you accept and agree to be bound by the terms and conditions of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-sm leading-relaxed">
                  TaskManager is a task management application that allows users to create, organize, and track tasks. We reserve the right to modify or discontinue the service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-sm leading-relaxed">
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-2">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us of any unauthorized use</li>
                  <li>Ensuring your account information is accurate</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. Acceptable Use</h2>
                <p className="text-sm leading-relaxed">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-2">
                  <li>Use the service for any illegal purpose</li>
                  <li>Share inappropriate or harmful content</li>
                  <li>Attempt to gain unauthorized access</li>
                  <li>Interfere with the proper operation of the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. Data Storage</h2>
                <p className="text-sm leading-relaxed">
                  We will store and process your data in accordance with our Privacy Policy. You retain all rights to your data, and we will not share or use your data except as necessary to provide the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
                <p className="text-sm leading-relaxed">
                  TaskManager is provided &quot;as is&quot; without any warranties. We are not liable for any damages arising from the use or inability to use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
                <p className="text-sm leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
                <p className="text-sm leading-relaxed">
                  We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any reason including breach of these Terms.
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

export default TermsOfService;