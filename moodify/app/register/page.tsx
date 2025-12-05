export default function Register() {
  return (
    <div className="split">
      <div className="left orange">
        <h2>Already have an account?</h2>

        <a className="btn" href="/login">
          Sign In
        </a>
      </div>

      <div className="right">
        <h2>Register</h2>

        <div className="form-box">
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Name" />
          <input type="password" placeholder="Password" />

          <button className="btn" style={{ width: "100%" }}>
            Register
          </button>

          <a href="#">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}
