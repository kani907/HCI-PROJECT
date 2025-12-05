export default function Login() {
  return (
    <div className="split">
      <div className="left">
        <h2>Sign In</h2>

        <div className="form-box">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button className="btn" style={{ width: "100%" }}>
            Sign In
          </button>

          <a href="#">Forgot password?</a>
        </div>
      </div>

      <div className="right orange">
        <h2>Don't have an account?</h2>

        <a className="btn" href="/register">
          Register
        </a>
      </div>
    </div>
  );
}
