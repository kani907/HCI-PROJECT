export default function ContactPage() {
  return (
    <div className="split">
      <div className="left">
        <h2>Need help?</h2>
        <p>Email us at:</p>

        <h3>support@moodify.com</h3>

        <p>
          We'll help you reset your password manually.
        </p>

        <a className="btn" href="/login">
          Back to Login
        </a>
      </div>

      <div className="right orange">
        <h2>Support</h2>
        <p>Our team usually responds within 24 hours.</p>
      </div>
    </div>
  );
}
