const faqs = [
  {
    q: "How do I place an order?",
    a: "Add items to your cart, open your cart, then choose Checkout. You need to be signed in to check out.",
  },
  {
    q: "How can I pay?",
    a: "Payments are handled securely by Paystack. You can pay with the options shown at checkout.",
  },
  {
    q: "Where can I see my orders?",
    a: "Open My Account from the profile icon. Your paid orders are listed under Order History.",
  },
  {
    q: "I forgot my password.",
    a: "On the login page, click Forgot Your Password? and follow the steps to set a new one.",
  },
];

export default function HelpPage() {
  return (
    <main className="profile-page">
      <h1>Help</h1>

      <section className="profile-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
