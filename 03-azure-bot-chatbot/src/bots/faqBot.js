const { ActivityHandler } = require('botbuilder');

class FaqBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const userMessage = (context.activity.text || '').toLowerCase().trim();
      let reply = "I'm sorry, I didn't understand that. You can ask about services, pricing, support, hours, or contact.";

      if (userMessage.includes('hello') || userMessage.includes('hi')) {
        reply = 'Hi! I am your Cloud Support FAQ Bot. You can ask me about services, pricing, support, hours, or contact information.';
      } else if (userMessage.includes('help')) {
        reply = 'I can help with these topics: services, pricing, support, hours, and contact.';
      } else if (userMessage.includes('service')) {
        reply = 'We offer cloud migration support, hosting guidance, backup assistance, and Azure-based solutions.';
      } else if (userMessage.includes('price')) {
        reply = 'Our starter support plan begins at $29/month, and custom cloud support plans depend on your environment size.';
      } else if (userMessage.includes('support')) {
        reply = 'To contact support, open a ticket through our portal or email support@cloudsupport.local.';
      } else if (userMessage.includes('hour')) {
        reply = 'Our support team is available Monday to Friday from 8:00 AM to 6:00 PM.';
      } else if (userMessage.includes('contact')) {
        reply = 'You can contact us at support@cloudsupport.local or call +1 800 555 0101.';
      }

      await context.sendActivity(reply);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded || [];
      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity('Welcome! I am your Cloud Support FAQ Bot. Ask me about services, pricing, support, hours, or contact.');
        }
      }
      await next();
    });
  }
}

module.exports.FaqBot = FaqBot;
