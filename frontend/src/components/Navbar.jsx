import React, {useState} from 'react';
import {Link, NavLink, useNavigate} from "react-router-dom";
import {navbarStyles} from "../assets/dummyStyles.js";
import {Award} from 'lucide-react';

const Navbar = (logoSrc) => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

// Logout Function
    const handleLogout = () => {
        try {
            localStorage.removeItem('authToken');
            localStorage.clear();
        } catch (e) {
            // ignore all errors
        }
        window.dispatchEvent(new CustomEvent("authChanged", {detail: {user: null} }));
        setMenuOpen(false);
        try {
            navigate('/login');
        } catch (e) {
            window.location.href = '/login';
        }
    };
    return (
       <nav className={navbarStyles.nav}>
           <div style={{
               backgroundImage: navbarStyles.decorativePatternBackground,
           }}
                className={navbarStyles.decorativePattern}>
           </div>

           <div className={navbarStyles.bubble1}></div>
           <div className={navbarStyles.bubble2}></div>
           <div className={navbarStyles.bubble3}></div>

            <div className={navbarStyles.container}>
                <div className={navbarStyles.logoContainer}>
                    <Link to="/" className={navbarStyles.logoButton}>
                        <div className={navbarStyles.logoInner}>
                            <img
                                src={
                                    logoSrc ||
                                    "https://yt3.googleusercontent.com/eD5QJD-9uS--ekQcA-kDTCu1ZO4d7d7BTKLIVH-EySZtDVw3JZcc-bHHDOMvxys92F7rD8Kgfg=s900-c-k-c0x00ffffff-no-rj"
                                }
                                alt="QuizMaster logo"
                                className={navbarStyles.logoImage}
                            />
                        </div>
                    </Link>
                </div>
                <div className={navbarStyles.titleContainer}>
                    <div className={navbarStyles.titleBackground} >
                        <h1 className={navbarStyles.titleText}>Quiz Application</h1>
                    </div>
                </div>

                <div className={navbarStyles.desktopButtonsContainer}>
                    <div className={navbarStyles.spacer}></div>
                        <NavLink to ="/result" className={navbarStyles.resultsButton}>
                        <Award className={navbarStyles.buttonIcon}/>
                            My Result
                        </NavLink>

                    {loggedIn ? (
                        <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                            <LogOut className={navbarStyles.buttonIcon}/>
                                Logout
                        </button>
                    ) : (
                        <NavLink to="/login" className={navbarStyles.loginButton}>
                            <LogIn className={navbarStyles.buttonIcon}/>
                                Login
                        </NavLink>
                    )}
                </div>

                <div className={navbarStyles.mobileMenuContainer}>
                    <button onClick={() => setMenuOpen((s) => !s)} className={navbarStyles.menuToggleButton}>
                        {menuOpen ? (<X className={navbarStyles.menuIcon}/>) : ( <Menu className={navbarStyles.buttonIcon}/>)}
                    </button>


                </div>
            </div>
       </nav>
    );
};

export default Navbar;
