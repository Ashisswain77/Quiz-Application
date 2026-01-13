import React, {useState, useEffect} from 'react';
import {Link, NavLink, useNavigate} from "react-router-dom";
import {navbarStyles} from "../assets/dummyStyles.js";
import {Award, LogOut, LogIn, Menu, X} from 'lucide-react';

const Navbar = ({ logoSrc }) => {
    const navigate = useNavigate();
    // Using useState for loggedIn state, will be updated by auth events
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('authToken') ? true : false);
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Listen for auth changes
    useEffect(() => {
        try {
            const u = localStorage.getItem("authToken");
            setLoggedIn(!!u);
        } catch (e) {
            setLoggedIn(false);
        }

        const handler = (ev) => {
            const detailUser = ev?.detail?.user ?? null;
            setLoggedIn(!!detailUser);
        };
        window.addEventListener("authChanged", handler);

        return () => window.removeEventListener("authChanged", handler);
    }, []);

// Logout Function
    const handleLogout = () => {
        try {
            localStorage.removeItem('authToken');
            localStorage.clear();
        } catch (e) {
            console.log(e);
        }
        window.dispatchEvent(new CustomEvent("authChanged", {detail: {user: null} }));
        setMenuOpen(false);
        try {
            navigate('/login');
        } catch (e) {
            window.location.href = '/login';
            console.log(e);
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
                        {menuOpen ? (<X className={navbarStyles.menuIcon}/>) : (<Menu className={navbarStyles.menuIcon}/>
                        )}
                    </button>

                    {menuOpen && (
                        <div className={navbarStyles.mobileMenuPanel}>
                            <ul className={navbarStyles.mobileMenuList}>
                                <li>
                                    <NavLink to ="/result" className={navbarStyles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                                    <Award className={navbarStyles.mobileMenuItem} />
                                        My Result
                                    </NavLink>
                                </li>

                                {loggedIn ? (
                                    <li>
                                        <button type="button" className={navbarStyles.mobileMenuItem} onClick={handleLogout}>
                                            <LogOut className={navbarStyles.mobileMenuItem} />
                                                Logout
                                        </button>
                                    </li>
                                ) : (
                                    <li>
                                        <NavLink to="/login" className={navbarStyles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
                                            <LogIn className={navbarStyles.mobileMenuItem} />
                                                Login
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

       </nav>
    );
};

export default Navbar;
