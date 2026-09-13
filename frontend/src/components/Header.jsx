function Header({ user, onLoginClick, onSignupClick, onLogout }) {
  return (
    <header className="header">
      <div className="logo">My Website</div>

      <nav className="nav">
        {user ? (
  <>
    <span className="username">
      Welcome, {user.username}
    </span>

    <button onClick={onLogout}>Logout</button>
  </>
) : (
          <>
            <button onClick={onLoginClick}>Login</button>
            <button onClick={onSignupClick}>Sign Up</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;